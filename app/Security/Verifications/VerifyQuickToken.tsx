import { cookies, headers } from "next/headers";
import { getClientIP } from "../GetIp";
import { SetTokenKeys } from "../IsAuth/Token/TokenKeys";
import VerifyToken from "./VerifyToken";

export default async function VerifyQuickToken(cookie: string, keyName: string){
    try {
        let c = await cookies()
        let h = await headers()
        let ip = await getClientIP(h)
        // 
        if(!ip) return null;
        let token = c.get(cookie)?.value
        if(!token) return null;

        let keys = SetTokenKeys.find(key => key.name === keyName)?.keys || []
        if(!keys.length) return null;
        let verify = await VerifyToken(token, keys)
        if(!verify) return null;

        return true;
    }
    catch {
        return null
    }
}