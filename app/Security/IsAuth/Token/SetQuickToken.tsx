'use server'

import { cookies } from "next/headers";
import VerifyToken from "../../Verifications/VerifyToken";
import SetToken from "./SetToken";
import { SetTokenKeys, TokenKeys } from "./TokenKeys";


interface SetQuickTokenProps {
    setname?: string;
    checkfor?: string;
    addKeys?: string[];
    data?: string;
}

export default async function SetQuickToken({setname, checkfor, addKeys, data}: SetQuickTokenProps){
    try {
        let c = await cookies()
        if(!data) return null;
        // 
        let keys: string[] = TokenKeys.find(key => key.name === checkfor)?.keys || [];
        if(addKeys && addKeys.length > 0 && Array.isArray(addKeys)){
            keys = [...keys, ...addKeys];
        }
        // 
        let token = await VerifyToken(data, keys, true)
        if(!token) return null;
        // 
        let setkeys: string[] = SetTokenKeys.find(key => key.name === setname)?.keys || [];
        if(!setkeys || setkeys.length === 0 || !Array.isArray(setkeys)) return null;
        // 
        let SKeys = SetTokenKeys.find(key => key.name === setname);
        // 
        let session = await SetToken({
            expiresIn: SKeys?.expiresIn || '15s',
            algorithm: SKeys?.algorithm || 'HS512'
        }, setkeys)
        if(!session) return null;
        // 
        
        c.set(`${setname}`, `${session}`, {
            httpOnly: true,
            sameSite: 'strict',
            priority: 'high',
        })
        return true;
    }
    catch {
        return null;
    }
}