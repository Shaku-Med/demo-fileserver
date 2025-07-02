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
        
        let remove_blob = all.splice(0, 2)
        let blobString = 'blob_'
        
        const owner = gKey.key_data.login
        const repoName = repo
        
        const lengthNum = parseInt(length)
        if (isNaN(lengthNum) || lengthNum <= 0) {
            return StreamError(`Invalid length parameter. Must be a positive number.`, 400)
        }
        
        const blobDataArray: Uint8Array[] = []
        
        for (let i = 0; i < lengthNum; i++) {
            try {
                const blobPath = `${remove_blob.join('/')}/${blobString}${i}`
                
                const response = await gKey.octokit.repos.getContent({
                    owner,
                    repo: repoName,
                    path: blobPath
                })
                
                if ('content' in response.data && response.data.content) {
                    const content = Buffer.from(response.data.content, 'base64')
                    blobDataArray.push(new Uint8Array(content))
                } else {
                    return StreamError(`Blob data not found at path: ${blobPath}`, 404)
                }
            } catch (error: any) {
                if (error.status === 404) {
                    return StreamError(`Blob not found at index ${i}`, 404)
                }
                console.error(`Error fetching blob at index ${i}:`, error)
                return StreamError(`Failed to fetch blob data at index ${i}`, 500)
            }
        }
        
        const combinedData = blobDataArray

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for (const chunk of combinedData) {
                        controller.enqueue(chunk);
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'image/jpeg',
                // 'Content-Disposition': `attachment; filename="${value}"`,
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
                'ETag': `"${repo}-${length}"`,
                'Vary': 'Accept-Encoding'
            }
        });
    }
    catch (error) {
        console.log(`Error Found in /api/load/image/[...all]`, error)
        return StreamError(`Something went wrong.`, 500)
    }
}