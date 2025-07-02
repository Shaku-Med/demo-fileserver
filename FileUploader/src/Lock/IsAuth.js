const db = require('../services/Database/Supabase')
const getClientIP = require('../services/getClientIp')
const {DecryptCombine} = require('./Combine')

const TokenKeys = [
    {
        name: `is_auth`,
        keys: [`${process.env.is_auth}`],
        expiresIn: '60d',
        algorithm: 'HS512'
    }
]

const VerifyToken = async (req, where, authKeys, returnData, checkO) => {
  try {
    let h = req.headers
    let c = req.cookies
    let gip = await getClientIP(h)
    // 

    let au = h['user-agent']?.split(/\s+/).join('')
    let k = `${!checkO ? au : ''}+${process.env.TOKEN1}`
    // 
    let keys = [k, `${process.env.TOKEN2}`]
    if(authKeys && authKeys.length > 0){
        keys = [k, ...authKeys]
    }
    // console.(log("VerifyToken: ->>", keys, "\n-SPACE-\n")
    // 
    let vt = where || c?.[`_q_`]
    if(!vt) return false;
    // 
    let dec = DecryptCombine(vt, keys)

    if(dec){
        // 
        if(typeof dec === 'object'){
            return returnData ? dec : true
        }
        else {
            return typeof dec === 'undefined' ? undefined : false
        }
    }
    else {
        return typeof dec === 'undefined' ? undefined : false
    }
  }
  catch (e) {
    // console.log(e)
    return e?.toString()?.includes('expired') ? undefined : null
  }
}

const IsAuth = async (req, name, keyName, select, returnData) => {
  try {
    let ip = await getClientIP(req)
    if(!ip) return false;

    let token = req.cookies?.[name || `c_usr`]
    if(!token) {
        console.log('No token found in cookies:', req.cookies);
        return false;
    }

    let keys = TokenKeys.find(key => key.name === (keyName || `is_auth`))?.keys || []

    if(!keys || keys.length === 0) return false;

    let verify = await VerifyToken(req, token, keys, true)
    if(!verify) return false;

    if(!db) return false;
    let {error, data} = await db.from(`users`).select(`${select || `*`}`).eq(`id`, verify.id).maybeSingle()
    if(error) return false;
    if(!data) return false;

    if(returnData) return data;
    return true;
  }
  catch (error) {
    console.log("Error Found in IsAuth: ", error)
    return false;
  }
}

module.exports = {
    IsAuth,
    TokenKeys,
    VerifyToken
}
