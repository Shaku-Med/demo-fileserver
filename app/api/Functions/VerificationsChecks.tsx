import db from "@/app/lib/Database/SupaBase/Base"
import { getClientIP } from "@/app/Security/GetIp"
import VerifyAuthorization from "@/app/Security/Verifications/VerifyAuthorization"
import VerifyMainToken from "@/app/Security/Verifications/VerifyMainToken"
import VerifyQuickToken from "@/app/Security/Verifications/VerifyQuickToken"
import { cookies, headers } from "next/headers"

export const VerificationsChecks = async (request: Request, quick_key_name: string = 'github_keys', main_key_name: string = 'a_c', auth_key_name: string = 'github_keys_csrf', should_authorize: boolean = true) => {
    try {
        let h = await headers()
        let c = await cookies()
        let ip = await getClientIP(h)
        if(!ip) return null
        // Verify Quick Session
        let verify_Quick = await VerifyQuickToken(quick_key_name, quick_key_name )
        if(!verify_Quick) {
            c.delete(quick_key_name)
            return null
        }
        // Verify Main Token
        let verify_Main = await VerifyMainToken(main_key_name, `default`)
        if(!verify_Main) {
            c.delete(main_key_name)
            return null
        }
        // Verify Authorization
        if(should_authorize){
            let auth = h.get('authorization')
            if(!auth) return null
            auth = auth.split(` `)[1]
            let verify_Authorization = await VerifyAuthorization(auth, auth_key_name)
            if(!verify_Authorization) {
                c.delete(auth_key_name)
                return null
            }

            c.delete(quick_key_name)
        }

        if(!db) return null

        return true

    }
    catch {
        return null
    }
}