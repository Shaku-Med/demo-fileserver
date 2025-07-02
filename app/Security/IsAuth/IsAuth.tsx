import { cookies, headers } from "next/headers";
import { TokenKeys } from "./Token/TokenKeys";
import VerifyToken from "../Verifications/VerifyToken";
import db from "@/app/lib/Database/SupaBase/Base";
import { getClientIP } from "../GetIp";

const IsAuth = async (name?: string, keyName?: string, select?: string, returnData?: boolean): Promise<boolean | object> => {
  try {
    let h = await headers()
    let c = await cookies()
    let ip = await getClientIP(h)
    if(!ip) return false;

    let token = c.get(`${name || `c_usr`}`)?.value
    if(!token) return false;

    let keys = TokenKeys.find(key => key.name === (keyName || `is_auth`))?.keys || []

    if(!keys || keys.length === 0) return false;

    let verify = await VerifyToken(token, keys, true)
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

export default IsAuth
