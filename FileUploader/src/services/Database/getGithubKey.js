const { decrypt } = require('../../Lock/Enc')
const OctoKitConnect = require('./OctokitConnect')
const db = require('./Supabase')

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

moduled.exports = { getRandomGithubKey }