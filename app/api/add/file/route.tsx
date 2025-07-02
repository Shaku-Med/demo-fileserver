import { encrypt } from "@/app/Security/Lock/Enc";
import { StreamError } from "@/app/api/ErrorMessage/StreamError";
import { VerificationsChecks } from "@/app/api/Functions/VerificationsChecks";
import IsAuth from "@/app/Security/IsAuth/IsAuth";
import { cookies, headers } from "next/headers";
import { FileServerUrl } from "@/app/lib/Functions/BaseUrl";
import { NextResponse } from "next/server";
import { getRandomGithubKey, searchExplorerDatabaseRepos } from "@/app/dashboard/page";
import { Octokit } from "@octokit/rest";
import OctoKitConnect from "@/app/dashboard/components/OctalConnect";

const checkRepoCapacity = async (octokit: Octokit, repoName: string, owner: string) => {
    try {
        const repo = await octokit.repos.get({
            owner: owner,
            repo: repoName
        })
        
        const sizeInMB = repo.data.size / 1024
        const maxSizeMB = 20480 // 20GB in MB
        
        return {
            isFull: sizeInMB >= maxSizeMB,
            currentSize: sizeInMB,
            maxSize: maxSizeMB,
            repo: repo.data
        }
    } catch (error) {
        return {
            isFull: false,
            currentSize: 0,
            maxSize: 20480, // 20GB in MB
            repo: null
        }
    }
}

const findAvailableRepo = async (octokit: Octokit, owner: string) => {
    try {
        const repos = await searchExplorerDatabaseRepos(octokit)
        
        for (const repo of repos) {
            const capacity = await checkRepoCapacity(octokit, repo.name, owner)
            if (!capacity.isFull) {
                return repo.name
            }
        }
        
        return null
    } catch (error) {
        return null
    }
}

const createNewRepo = async (octokit: Octokit, repoNumber: number, owner: string) => {
    try {
        const repoName = `explorer_database_${repoNumber}`
        
        const newRepo = await octokit.repos.createForAuthenticatedUser({
            name: repoName,
            private: true,
            auto_init: true
        })
        
        return newRepo.data.name
    } catch (error) {
        return null
    }
}

const getNextRepoNumber = async (octokit: Octokit, owner: string) => {
    try {
        const repos = await searchExplorerDatabaseRepos(octokit)
        
        let maxNumber = 0
        repos.forEach(repo => {
            const match = repo.name.match(/^explorer_database_(\d+)$/)
            if (match) {
                const number = parseInt(match[1])
                if (number > maxNumber) {
                    maxNumber = number
                }
            }
        })
        
        return maxNumber + 1
    } catch (error) {
        return 1
    }
}

const getOrCreateAvailableRepo = async (octokit: Octokit, owner: string) => {
    try {
        let availableRepo = await findAvailableRepo(octokit, owner)
        
        if (availableRepo) {
            return availableRepo
        }
        
        const nextNumber = await getNextRepoNumber(octokit, owner)
        const newRepoName = await createNewRepo(octokit, nextNumber, owner)
        
        return newRepoName
    } catch (error) {
        return null
    }
}

const saveToGitHub = async (attempts: number = 0, REPO_NAME: string, targetFilePath: string, fileData: string, octokit: Octokit, owner: string) => {
    if (attempts >= 3) return false;

    try {
        let sha = null;
        
        try {
            const existingFile = await octokit.repos.getContent({
                owner: owner,
                repo: REPO_NAME,
                path: targetFilePath,
                ref: 'main'
            });
            
            if (Array.isArray(existingFile.data)) {
                sha = null;
            } else {
                sha = existingFile.data.sha;
            }
        } catch (error: any) {
            if (error.status === 404) {
                sha = null;
            } else {
                throw error;
            }
        }

        const result = await octokit.repos.createOrUpdateFileContents({
            owner: owner,
            repo: REPO_NAME,
            path: targetFilePath,
            message: `Upload file: ${targetFilePath.split('/').pop()} - delete or modify at your own risk.`,
            content: fileData,
            branch: 'main',
            ...(sha && { sha: sha })
        })
        
        return result.status === 200 || result.status === 201
    } catch (error: any) {
        console.log(`GitHub API Error (attempt ${attempts + 1}):`, error.message);
        if (error.status === 422) {
            console.log(`422 Error details:`, error.response?.data);
            return false;
        }
        return await saveToGitHub(attempts + 1, REPO_NAME, targetFilePath, fileData, octokit, owner);
    }
};

const sanitizePath = (path: string): string => {
    return path
        .replace(/[<>:"|?*]/g, '_')
        .replace(/\s+/g, '_')
        .replace(/\/+/g, '/')
        .replace(/^\/+|\/+$/g, '');
};

const uploadFile = async (data: any, git_key: any) => {
    let GITHUB_REPO = null;
    
    if (data.repo && data.repo.trim() !== '') {
        const capacity = await checkRepoCapacity(git_key.octokit, data.repo, git_key.key_data.login);
        if (!capacity.isFull) {
            GITHUB_REPO = data.repo;
        }
    }
    
    if (!GITHUB_REPO) {
        GITHUB_REPO = await getOrCreateAvailableRepo(git_key.octokit, git_key.key_data.login);
    }
    
    if (!GITHUB_REPO) return null;
    
    let destination = data.path || `${new Date().toDateString().split('-').join('_')}/${data.id}/metadata.json`;
    destination = sanitizePath(destination);
    
    // console.log(`Uploading to repo: ${GITHUB_REPO}, path: ${destination}`);
    
    try {
        const fileData = Buffer.from(JSON.stringify(data), 'utf8').toString('base64');
        let sv = await saveToGitHub(0, GITHUB_REPO, destination, fileData, git_key.octokit, git_key.key_data.login);
        return sv ? { destination: `${destination}`, repo: GITHUB_REPO } : null
    } catch (error) {
        console.log(`Error Found in Upload File: `, error)
        return null;
    }
};

export async function POST(request: Request) {
    try {
        let h = await headers()
        let c = await cookies()
        let au = h.get('user-agent')?.split(/\s+/).join('')
        let isAuth: any = await IsAuth(`c_usr`, `is_auth`, 'id', true);
        if(!isAuth) return StreamError(`Hmm, It looks like you're not logged in, Please login to your account to continue.`, 401);
        
        let verify = await VerificationsChecks(request, 'add_file', 'a_c', '', false)
        if(!verify) return StreamError(`You're not allowed to make this request`, 401);

        c.delete('add_file')

        let git_key = await getRandomGithubKey(isAuth.id)
        if(!git_key) return StreamError(`We need your github personal access token to upload files.`, 401);
        
        const data = await request.json();
        
        if (!data) {
            return StreamError('No data provided', 400);
        }
        
        // console.log('Received data:', JSON.stringify(data, null, 2));
        
        const result = await uploadFile(data, git_key);
        
        if (result) {
            return NextResponse.json({
                success: true,
                message: 'File metadata uploaded successfully',
                urls: result,
                length: 1
            });
        } else {
            return StreamError('Error processing metadata', 500);
        }
        
    }
    catch (error: any) {
        console.log(`Error Found in Upload Route: `, error)
        console.log(`Error stack: `, error.stack)
        return StreamError(`Oh no! Something went wrong.`, 500)
    }
}