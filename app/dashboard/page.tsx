import React from 'react'
import DashboardContent from './DashboardContent/DashboardContent'
import ErrorMessage from './components/ErrorMessage'
import db from '../lib/Database/SupaBase/Base'
import IsAuth from '../Security/IsAuth/IsAuth'
import { decrypt } from '../Security/Lock/Enc'
import OctoKitConnect from './components/OctalConnect'
import { Octokit } from '@octokit/rest'

interface GithubKey {
  key: string
  key_data: any
  user_id: string
  success: boolean
}

interface DecryptedGithubKey {
  key: string
  key_data: any
  octokit: Octokit
}

interface AuthenticatedUser {
  id: string
  [key: string]: any
}

export const getRandomGithubKey = async (userId: string): Promise<DecryptedGithubKey | null> => {
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

    let octokit = await OctoKitConnect({key: decryptedKey})
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

export const searchExplorerDatabaseRepos = async (octokit: Octokit) => {
  try {
    const user = await octokit.users.getAuthenticated()
    const username = user.data.login
    
    const response = await octokit.search.repos({
      q: `explorer_database user:${username}`,
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

export const getRepoData = async (octokit: Octokit, repo: any) => {
  try {
    const [owner, repoName] = repo.full_name.split('/')
    
    const contents = await octokit.repos.getContent({
      owner,
      repo: repoName,
      path: ''
    })
    
    const contentsArray = Array.isArray(contents.data) ? contents.data : [contents.data]
    
    return {
      contents: contentsArray
    }
  } catch (error) {
    console.error(`Error getting data for ${repo.full_name}:`, error)
    return {
      contents: []
    }
  }
}

const DashboardPage = async (): Promise<React.JSX.Element> => {
  try {
    const authenticatedUser = await IsAuth('c_usr', 'is_auth', '*', true) as AuthenticatedUser
    
    if (!authenticatedUser || typeof authenticatedUser === 'boolean') {
      return <ErrorMessage message="You're not authorized to access this page." />
    }

    if (!db) {
      return <ErrorMessage message="Oh no! Something went wrong. Please try again later." />
    }

    const githubKey = await getRandomGithubKey(authenticatedUser.id)
    
    if (!githubKey) {
      return <ErrorMessage message="No github keys found. Please add a github key to your account." />
    }

    const explorerRepos = await searchExplorerDatabaseRepos(githubKey.octokit)
    
    const reposWithData = await Promise.all(
      explorerRepos.map(repo => getRepoData(githubKey.octokit, repo))
    )
    const allContents = reposWithData
      .map((repoData, index) => repoData.contents.map(item => ({
        name: item.name,
        title: item.name,
        artists: item.type === 'dir' ? 'Directory' : 'File',
        album: item.path,
        icon: item.type === 'dir' ? 'folder' : 'file',
        type: item.type === 'dir' ? 'folder' as const : 'file' as const,
        content: item.type === 'dir' ? `Directory: ${item.name}` : `File: ${item.name} (${item.path})`,
        repo: explorerRepos[index].name,
      })))
      .flat()
    
    return <DashboardContent allJsonContents={allContents} />
  } catch (error) {
    console.error('Dashboard Page Error:', error)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ErrorMessage message="Error loading dashboard" />
      </div>
    )
  }
}

export default DashboardPage
