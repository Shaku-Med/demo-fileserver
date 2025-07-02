import SetToken from "@/app/Security/IsAuth/Token/SetToken"
import { SetTokenKeys } from "@/app/Security/IsAuth/Token/TokenKeys"
import { cookies } from "next/headers"

export const TokenReturn = async (expiresIn: number) => {
    try {
        let c = await cookies()
        // 
        let key = SetTokenKeys.find(key => key.name === `github_keys_csrf`)
        let github_keys_csrf = await SetToken({
            expiresIn: `${expiresIn}m`,
            algorithm: `HS512`
        }, key?.keys || [])
        
        if (!github_keys_csrf) {
            return null
        }

        let date = new Date()
        let expires = new Date(date.setMinutes(date.getMinutes() + expiresIn))

        return {
            token: github_keys_csrf,
            expires: expires
        }

    }
    catch {
        return null
    }
}
