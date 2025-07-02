import { SetTokenKeys } from "../IsAuth/Token/TokenKeys";
import VerifyToken from "./VerifyToken";

export default async function VerifyAuthorization(auth: string, name: string){
    try {
        if(!auth || !name) return null;
        let key = SetTokenKeys.find(key => key.name === name)?.keys || []
        if(!key.length) return null;
        let verify = await VerifyToken(auth, key)
        if(!verify) return null;
        
        return true;
    }
    catch {
        return null
    }
}