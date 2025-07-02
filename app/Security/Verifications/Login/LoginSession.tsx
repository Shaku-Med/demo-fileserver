import { SetLoginCookie } from "../Password";

interface LoginSessionProps {
    id: string;
}

export default async function LoginSession(userData: LoginSessionProps){
    try {
        let object = [
            {
                name: `c_usr`,
                value: {
                    id: userData.id,
                },
                keyName: `is_auth`,
                shouldEncrypt: true,
                options: {
                    httpOnly: true,
                    // secure: true,
                    maxAge: 60 * 60 * 24 * 60, // 60 days
                    path: `/`,
                }
            },
        ]

        let session = await SetLoginCookie(object)
        if(!session) return null;
        return true;
    }
    catch {
        return null
    }
}