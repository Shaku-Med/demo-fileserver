import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { StreamError } from "../../ErrorMessage/StreamError";
import { getClientIP } from "@/app/Security/GetIp";
import VerifyMainToken from "@/app/Security/Verifications/VerifyMainToken";
import VerifyAuthorization from "@/app/Security/Verifications/VerifyAuthorization";
import VerifyQuickToken from "@/app/Security/Verifications/VerifyQuickToken";
import VerifyForm from "@/app/Security/Verifications/VerifyForm";
import db from "@/app/lib/Database/SupaBase/Base";
import { CreatePassword } from "@/app/Security/Verifications/Password";
import LoginSession from "@/app/Security/Verifications/Login/LoginSession";

export async function POST(request: Request){
    try {
        let h = await headers()
        let c = await cookies()
        let ip = await getClientIP(h)
        if(!ip) return new NextResponse(`Unauthorized`, {status: 401});
        // Verify Quick Session
        let verify_Quick = await VerifyQuickToken(`login`, `login` )
        if(!verify_Quick) {
            c.delete('login')
            return new NextResponse(`Unauthorized`, {status: 401});
        }
        // Verify Main Token
        let verify_Main = await VerifyMainToken(`a_c`, `default`)
        if(!verify_Main) {
            c.delete('a_c')
            return new NextResponse(`Unauthorized`, {status: 401});
        }
        // Verify Authorization
        let auth = h.get('authorization')
        if(!auth) return new NextResponse(`Unauthorized`, {status: 401});
        auth = auth.split(` `)[1]
        let verify_Authorization = await VerifyAuthorization(auth, `login_csrf`)
        if(!verify_Authorization) {
            c.delete('login_csrf')
            return new NextResponse(`Unauthorized`, {status: 401});
        }

        if(!db) return new NextResponse(`Connection failed. Your request was not processed.`, {status: 500});

        let {email, password} = await request.json()
        // regix email verify and password regix verify
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
        if(!emailRegex.test(email)) return new NextResponse(`Invalid email`, {status: 400});
        if(!passwordRegex.test(password)) return new NextResponse(`Invalid password`, {status: 400});
        // 
        let {error, data} = await db.from(`users`).select(`email, id`).eq(`email`, email).maybeSingle()
        if(error) return new NextResponse(`Invalid Data.`, {status: 500});

        if(!data) return new NextResponse(`Invalid email or password`, {status: 400});
        // 

        let login_session = await LoginSession(data)
        if(!login_session) return new NextResponse(`Access not granted.`, {status: 400});
        
        c.delete('login')
        return StreamError({
            message: `Login successful`,
        }, 200)
    }
    catch {
        return new NextResponse(`Internal Server Error`, {status: 500})
    }
}