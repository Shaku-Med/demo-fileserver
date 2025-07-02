const { decrypt } = require('../Lock/Enc');
const OctokitConnect = require('./Database/OctokitConnect');
const db = require('./Database/Supabase');

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Octokit } = require('@octokit/rest');
const { IsAuth } = require('../Lock/IsAuth');

// Array of GitHub tokens


const getRandomGithubKey = async (userId) => {
    try {
      if (!db) return null
  
      const { data: githubKeys, error } = await db
        .from('github_keys')
        .select('key, key_data')
        .eq('user_id', userId)
        .eq('success', true)
  
      if (error || !githubKeys || githubKeys.length === 0) return null
  
      const randomIndex = Math.floor(Math.random() * githubKeys.length)
      const selectedKey = githubKeys[randomIndex]
  
      const encryptionKey = `${process.env.PASS1}+${process.env.PASS2}+${process.env.PASS3}+${process.env.PASS4}`
      const decryptedKey = decrypt(selectedKey.key, encryptionKey)
  
      if (!decryptedKey) return null
  
      let octokit = await OctokitConnect({key: decryptedKey})
      if(!octokit) return null
  
      return {
        key: decryptedKey,
        key_data: selectedKey.key_data,
        octokit: octokit
      }
    } catch {
      return null
    }
  }
  
  const searchExplorerDatabaseRepos = async (octokit) => {
    try {
      const user = await octokit.users.getAuthenticated()
      const username = user.data.login
      
      const response = await octokit.search.repos({
        q: `ex_storage user:${username}`,
        sort: 'updated',
        order: 'desc',
        per_page: 100
      })
      
      return response.data.items
    } catch (error) {
      console.error('Error searching repositories:', error)
      return []
    }
}

const checkRepoCapacity = async (octokit, repoName, owner) => {
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

const findAvailableRepo = async (octokit, owner) => {
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

const createNewRepo = async (octokit, repoNumber, owner) => {
    try {
        const repoName = `ex_storage_${repoNumber}`
        
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

const getNextRepoNumber = async (octokit, owner) => {
    try {
        const repos = await searchExplorerDatabaseRepos(octokit)
        
        let maxNumber = 0
        repos.forEach(repo => {
            const match = repo.name.match(/^ex_storage_(\d+)$/)
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

const getOrCreateAvailableRepo = async (octokit, owner) => {
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

const uploadHLSFiles = async (outputDir, body, req, res) => {
    let isAuth = await IsAuth(req, 'c_usr', 'is_auth', 'id', true)
    if(!isAuth) throw new Error('You need to be logged in to upload files');
    let git_key = await getRandomGithubKey(isAuth.id)
    if(!git_key) throw new Error('We need your github personal access token to upload files.');

    // let repos = await searchExplorerDatabaseRepos(git_key.octokit)

    const GITHUB_REPO = await getOrCreateAvailableRepo(git_key.octokit, git_key.key_data.login)
    if (!GITHUB_REPO) throw new Error('Failed to get or create repository');
    
    const files = fs.readdirSync(outputDir);
    
    const uploadPromises = files.map(async (file) => {
        const filePath = path.join(outputDir, file);
        const fileContent = fs.readFileSync(filePath, 'base64');

        const destination = `${new Date().toDateString().split('-').join('_')}/${body?.id}/${file}`;
        
        try {
            let sv = await saveToGitHub(0, GITHUB_REPO, destination, fileContent, git_key.octokit, git_key.key_data.login);
            return sv ? { destination: `${destination}`, repo: GITHUB_REPO } : null
        } catch (error) {
            console.error(`Error uploading file ${file}:`, error.message);
            return null;
        }
    });

    return Promise.all(uploadPromises);
};

const uploadFile = async (file, body, req, res) => {
    let isAuth = await IsAuth(req, 'c_usr', 'is_auth', 'id', true)
    if(!isAuth) throw new Error('You need to be logged in to upload files');
    let git_key = await getRandomGithubKey(isAuth.id)
    if(!git_key) throw new Error('We need your github personal access token to upload files.');

    const GITHUB_REPO = await getOrCreateAvailableRepo(git_key.octokit, git_key.key_data.login)
    if (!GITHUB_REPO) throw new Error('Failed to get or create repository');
    
    const fileName = body?.originalname || `file_${Date.now()}`;
    const destination = `${new Date().toDateString().split('-').join('_')}/${body?.id}/${fileName}_${body?.index}`;
    
    try {
        file = file.toString('base64');
        let sv = await saveToGitHub(0, GITHUB_REPO, destination, file, git_key.octokit, git_key.key_data.login);
        return sv ? { destination: `${destination}`, repo: GITHUB_REPO } : null
    } catch (error) {
       return null;
    }
};

const saveToGitHub = async (attempts = 0, REPO_NAME, targetFilePath, fileData, octokit, owner) => {
    if (attempts >= 3) return false;

    try {
        const result = await octokit.repos.createOrUpdateFileContents({
            owner: owner,
            repo: REPO_NAME,
            path: targetFilePath,
            message: `Upload file: ${path.basename(targetFilePath)} - delete or modify at your own risk.`,
            content: fileData,
            branch: 'main'
        })
        
        return result.status === 200 || result.status === 201
    } catch (error) {
        return await saveToGitHub(attempts + 1, REPO_NAME, targetFilePath, fileData, octokit, owner);
    }
};

module.exports = { 
    uploadHLSFiles,
    uploadFile,
    getRandomGithubKey,
    searchExplorerDatabaseRepos,
    checkRepoCapacity,
    findAvailableRepo,
    createNewRepo,
    getNextRepoNumber,
    getOrCreateAvailableRepo
}; 