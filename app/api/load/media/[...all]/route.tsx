import { NextRequest, NextResponse } from "next/server"
import { StreamError } from "../../../ErrorMessage/StreamError"
import { headers } from "next/headers";
import IsAuth from "@/app/Security/IsAuth/IsAuth";
import { getRandomGithubKey } from "@/app/dashboard/page";
import { Octokit } from "@octokit/rest";

interface RequestProps {
    params: Promise<{
        all: string[]
    }>
}

export async function GET(request: NextRequest, { params }: RequestProps) {
    try {
        const paramsRes = await params
        let { all } = paramsRes
        
        const repo = request.nextUrl.searchParams.get('repo')
        const length = request.nextUrl.searchParams.get('length')
        
        if (!repo || !length) {
            return StreamError(`Missing required parameters: repo and length. Received: repo=${repo}, length=${length}`, 400)
        }
        
        let h = await headers()
        let au = h.get('user-agent')?.split(/\s+/).join('')
        let isAuth: any = await IsAuth(`c_usr`, `is_auth`, 'id', true);
        if(!isAuth) return StreamError(`You must be logged in to access this resource.`, 401);

        let gKey = await getRandomGithubKey(isAuth.id)
        if (!gKey) return StreamError(`No GitHub key found. Please add a GitHub key to your account.`, 401);
                
        const owner = gKey.key_data.login
        const repoName = repo

        const blobPath = `${all.join('/')}`

        const response = await gKey.octokit.repos.getContent({
            owner,
            repo: repoName,
            path: blobPath
        })

        if ('content' in response.data && response.data.content) {
            console.log('Open work')
            const content = Buffer.from(response.data.content, 'base64')
            
            const fileExtension = all[all.length - 1]?.split('.').pop()?.toLowerCase()
            let contentType = 'application/octet-stream' // default
            
            if (fileExtension === 'm3u8') {
                contentType = 'application/vnd.apple.mpegurl'
            } else if (fileExtension === 'ts') {
                contentType = 'video/mp2t'
            } else if (fileExtension === 'mp4') {
                contentType = 'video/mp4'
            } else if (fileExtension === 'webm') {
                contentType = 'video/webm'
            }
            
            return new Response(content, {
                headers: {
                    'Content-Type': contentType,
                    'Content-Length': content.length.toString()
                }
            })
        } else {
            return new NextResponse('Blob data not found at path: ' + blobPath, { status: 404 })
        }
               
    }
    catch (error) {
        console.log(`Error Found in /api/load/image/[...all]`, error)
        return StreamError(`Something went wrong.`, 500)
    }
}