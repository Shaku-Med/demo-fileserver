import { Octokit } from "@octokit/rest"

interface OctoKitConnectProps {
    key: string
}
export default async function OctoKitConnect({key}: OctoKitConnectProps) {
    try {
        if(!key) return null
        let octokit = new Octokit({
            auth: key
        })
        let user = await octokit.users.getAuthenticated()
        if(user.status !== 200) return null

        return octokit
    }
    catch {
        return null
    }
}