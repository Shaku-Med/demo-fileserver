import React from 'react'
import ErrorMessage from '../../components/ErrorMessage'
import IsAuth from '@/app/Security/IsAuth/IsAuth'
import { getRandomGithubKey } from '../../page'
import DashboardContent from '../../DashboardContent/DashboardContent'

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
        let folderPath = `${all.join('/')}`

        const user = await githubKey.octokit.users.getAuthenticated()
        const username = user.data.login

        const contents = await githubKey.octokit.repos.getContent({
            owner: username,
            repo: l,
            path: folderPath
        })

        const contentsArray = Array.isArray(contents.data) ? contents.data : [contents.data]

        const allContents = contentsArray.map((item: any) => ({
            name: item.name,
            title: item.name,
            artists: item.type === 'dir' ? 'Directory' : 'File',
            album: item.path,
            icon: item.type === 'dir' ? 'folder' : 'file',
            type: item.type === 'dir' ? 'folder' as const : 'file' as const,
            content: item.type === 'dir' ? `Directory: ${item.name}` : `File: ${item.name} (${item.path})`,
            repo: l,
        }))
        
      return (
        <>
          <DashboardContent allJsonContents={allContents} />
        </>
      )
    }
    catch {
        return <ErrorMessage message="Error loading folder" />
    }
}

export default page
