import { encrypt } from "@/app/Security/Lock/Enc";
import { StreamError } from "../ErrorMessage/StreamError";
import { VerificationsChecks } from "../Functions/VerificationsChecks";
import IsAuth from "@/app/Security/IsAuth/IsAuth";
import { headers } from "next/headers";
import { FileServerUrl } from "@/app/lib/Functions/BaseUrl";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        let h = await headers()
        let au = h.get('user-agent')?.split(/\s+/).join('')
        let isAuth: any = await IsAuth(`c_usr`, `is_auth`, 'id', true);
        if(!isAuth) return StreamError(`Hmm, It looks like you're not logged in, Please login to your account to continue.`, 401);
        
        let verify = await VerificationsChecks(request, 'file_token', 'a_c', '', false)
        if(!verify) return StreamError(`You're not allowed to make this request`, 401);

        let d = encrypt(`${process.env.FILE_TOKEN_MAIN}`, `${process.env.KEY_LOCK}+${au}`)
        let f = await fetch(`${FileServerUrl}/`, {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'referer': `${FileServerUrl}/`,
                'user-agent': `${au}`,
            },
            cache: 'no-cache',
            body: JSON.stringify({
                token: d
            })
        })

        if(!f.ok) {
            return StreamError(`Access Denied.`, 401);
        }

        return NextResponse.json(await f.json(), {status: 200})
    }
    catch (error) {
        console.log(`Error Found in Upload Route: `, error)
        return StreamError(`Oh no! Something went wrong.`, 500)
    }
}