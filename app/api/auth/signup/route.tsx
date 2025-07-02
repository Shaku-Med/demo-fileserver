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
        let verify_Quick = await VerifyQuickToken(`signup`, `signup` )
        if(!verify_Quick) {
            c.delete('signup')
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
        let verify_Authorization = await VerifyAuthorization(auth, `signup_csrf`)
        if(!verify_Authorization) {
            c.delete('signup_csrf')
            return new NextResponse(`Unauthorized`, {status: 401});
        }

        const form = await request.json()
        let verify_Form = await VerifyForm(form)
        if(typeof verify_Form === `string`) return new NextResponse(verify_Form, {status: 400});
        if(!verify_Form) return new NextResponse(`Invalid data`, {status: 400});

        if(!db) return new NextResponse(`Connection failed. Your request was not processed.`, {status: 500});

        let {email, password, firstName, lastName, agreeToTerms} = form
        let {error, data} = await db.from(`users`).select(`email`).eq(`email`, email).maybeSingle()

        if(error) return new NextResponse(`Your request failed successfully. Please try again later.`, {status: 500});
        if(data) return new NextResponse(`Account already exists and cannot be created.`, {status: 400});

        let password_Hash = await CreatePassword(password)

        if(!password_Hash) return new NextResponse(`Something happened. Please try again later.`, {status: 500});
        
        const { data: userData, error: userError } = await db
            .from('users')
            .insert({
                email,
                firstname: firstName,
                lastname: lastName,
                terms_agreed: agreeToTerms,
                is_active: true,
                last_active: new Date().toISOString(),
                created_at: new Date().toISOString()
            })
            .select('id')
            .single()

        if(userError) return new NextResponse(`Something went wrong. Instant fix initiated... Issue reported.`, {status: 500});

        const { error: passwordError } = await db
            .from('password')
            .insert({
                id: userData.id,
                password: password_Hash,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })

        if(passwordError) return new NextResponse(`Something failed. Please try again later.`, {status: 500});

        let login_session = await LoginSession(userData)

        c.delete('signup')
        return StreamError({
            message: `Signup successful`,
            action: login_session ? `window.location.reload()` : `/account`
        }, 200)
    }
    catch {
        return new NextResponse(`Internal Server Error`, {status: 500})
    }
}