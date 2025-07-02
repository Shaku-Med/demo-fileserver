const { Octokit } = require("@octokit/rest")

module.exports = async function OctoKitConnect({key}) {
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