import { StreamError } from "@/app/api/ErrorMessage/StreamError";
import db from "@/app/lib/Database/SupaBase/Base";
import { getClientIP } from "@/app/Security/GetIp";
import IsAuth from "@/app/Security/IsAuth/IsAuth";
import { EncryptCombine } from "@/app/Security/Lock/Combine";
import { encrypt } from "@/app/Security/Lock/Enc";
import { CreatePassword } from "@/app/Security/Verifications/Password";
import VerifyAuthorization from "@/app/Security/Verifications/VerifyAuthorization";
import VerifyGithubToken from "@/app/Security/Verifications/VerifyGithubToken";
import VerifyMainToken from "@/app/Security/Verifications/VerifyMainToken";
import VerifyQuickToken from "@/app/Security/Verifications/VerifyQuickToken";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { VerificationsChecks } from "../../Functions/VerificationsChecks";


// Create a GitHub key
export async function POST(request: Request) {
    let c = await cookies()
    try {
        let isAuth: any = await IsAuth(`c_usr`, `is_auth`, 'id', true);
        if(!isAuth) return StreamError(`Hmm, It looks like you're not logged in, Please login to your account to continue.`, 401);
        // 
        let verify = await VerificationsChecks(request)
        if(!verify) return StreamError(`You're not allowed to make this request`, 401);
        // 
        let {token} = await request.json()
        let verify_token: any = await VerifyGithubToken(token)
        if(!verify_token) return StreamError(`Your request couldn't make it through.`, 401);
        if(typeof verify_token === 'string') return StreamError(verify_token, 401);

        if(typeof verify_token !== 'object') return StreamError(`Something happened.`, 403)

        let new_user_data = {
            login: verify_token.login,
            avatar_url: verify_token.avatar_url,
            name: verify_token.name,
            url: verify_token.url,
            created_at: verify_token.created_at,
            updated_at: verify_token.updated_at,
        }

        let Key_Password = encrypt(`${token}`, `${process.env.PASS1}+${process.env.PASS2}+${process.env.PASS3}+${process.env.PASS4}`)
        if(!Key_Password) return StreamError(`Oh no! Something failed here.`, 403)

        if(!db) return StreamError(`We were unable to make connections.`, 403);
        // Check if the key already exists
        let {data: existingKey, error: error_existingKey} = await db.from('github_keys').select('*').eq('user_id', isAuth.id).order('created_at', {ascending: true}).limit(1).maybeSingle()
        if(error_existingKey){
            console.log(`Error captured in Keys/Route.tsx line 88:`, error_existingKey)
            return StreamError(`Something went wrong`, 403);
        }

        let handleReturn_Result = async () => {
            try {
                if(!db) return StreamError(`We were unable to make connections.`, 403);

                let {error} = await db.from('github_keys').insert({
                    user_id: isAuth.id,
                    key: Key_Password,
                    status: `active`,
                    reason: ``,
                    success: true,
                    updated_at: new Date().toISOString(),
                    key_data: new_user_data,
        
                })
        
                if(error) {
                    console.log(`Error captured in Keys/Route.tsx line 95:`, error)
                    return StreamError(`Something went wrong`, 403);
                }
        
                return StreamError(`Key added successfully`, 200)

            }
            catch {
                return StreamError(`Something went wrong`, 403);
            }
        }

        if(existingKey){
            if(new_user_data.login !== existingKey.key_data.login){
                return new NextResponse(`For security, we only allow keys from one account. Your current keys are linked to: ${existingKey.key_data.login}. Please remove your existing key before adding a new one from a different account.`, {status: 403});
            }
            return await handleReturn_Result()
        }
        return await handleReturn_Result()
    }
    catch (e) {
        c.delete('github_keys')
        console.error(`Error captured in Keys/Route.tsx:`, e)
        return StreamError(`Something went wrong`, 500)
    }
}

// Delete a GitHub key
export async function DELETE(request: Request) {
    let c = await cookies()
    try {
        let isAuth: any = await IsAuth(`c_usr`, `is_auth`, 'id', true);
        if(!isAuth) return StreamError(`Hmm, It looks like you're not logged in, Please login to your account to continue.`, 401);
        
        let verify = await VerificationsChecks(request)
        if(!verify) return StreamError(`You're not allowed to make this request`, 401)
        
        let {keyId} = await request.json()
        if(!keyId) return StreamError(`Key ID is required`, 400)
        
        if(!db) return StreamError(`We were unable to make connections.`, 403);
        
        let {error} = await db.from('github_keys').delete().eq('id', keyId).eq('user_id', isAuth.id)
        
        if(error) {
            console.log(`Error captured in Keys/Route.tsx DELETE:`, error)
            return StreamError(`Something went wrong`, 403);
        }
        
        return StreamError(`Key deleted successfully`, 200)
    }
    catch (e) {
        c.delete('github_keys')
        console.error(`Error captured in Keys/Route.tsx DELETE:`, e)
        return StreamError(`Something went wrong`, 500)
    }
}