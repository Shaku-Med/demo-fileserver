import React from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import IsAuth from '@/app/Security/IsAuth/IsAuth'
import { getRandomGithubKey } from '../../page'
import ImagePreviewer from './components/ImagePreviewer/ImagePreviewer'
import MediaPlayer from './components/MediaPlayer/MediaPlayer'
import FilePreview from './components/FilePreview/FilePreview'

interface PageProps {
    params: Promise<{
        all: string[]
    }>
    searchParams: Promise<{
        l: string
    }>
}
const page = async ({ params, searchParams }: PageProps) => {  
    try {
        let isAuth: any = await IsAuth('c_usr', 'is_auth', 'id', true);
        if(!isAuth) return <ErrorMessage message={`Looks like you're not logged in. Please login to continue.`} />

        let githubKey = await getRandomGithubKey(isAuth.id)
        if(!githubKey) return <ErrorMessage message={`Oh no! Something went wrong. Please try again later.`} />

        const { all } = await params
        const { l } = await searchParams
        let filePath = `${all.join('/')}`

        const user = await githubKey.octokit.users.getAuthenticated()
        const username = user.data.login

        const fileContent: any = await githubKey.octokit.repos.getContent({
            owner: username,
            repo: l,
            path: filePath
        })

        if (Array.isArray(fileContent.data)) {
            return <ErrorMessage message={`This is a directory, not a file.`} />
        }

        if (fileContent.data.type !== 'file') {
            return <ErrorMessage message={`This is not a file.`} />
        }

        const content = Buffer.from(fileContent.data.content, 'base64').toString('utf-8')
        const fileName = fileContent.data.name
        const fileSize = fileContent.data.size
        const fileType = fileContent.data.type
       
        let jsonContent
        try {
            jsonContent = JSON.parse(content)
        } catch (error) {
            return <ErrorMessage message={`So sorry, but we can't read this file. The data provided is not in a valid format.`} />
        }

        let file_type_self: string = jsonContent?.fileType

        let url = `/api/load/${file_type_self.startsWith('image/') ? `image` : `media`}/${jsonContent?.access_url?.destination}?repo=${jsonContent?.access_url?.repo}&length=${jsonContent?.access_url_length}`

        return (
            <>
              {
                file_type_self.startsWith(`image/`) ?
                <ImagePreviewer image_data={jsonContent} image_url={url}/> :
                file_type_self.startsWith(`video/`) || file_type_self.startsWith(`audio/`) ?
                <MediaPlayer url={url} data={jsonContent}/> :
                <FilePreview/>
              }
            </>
        )
    }
    catch {
        return <ErrorMessage message={`Oh no! Something went wrong. Please try again later.`} />
    }
}

export default page