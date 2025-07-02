import React from "react"
import ErrorMessage from "./components/ErrorMessage";
import { DashboardSidebar } from "./components/Sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import IsAuth from "../Security/IsAuth/IsAuth";
import { redirect } from "next/navigation";
import db from "../lib/Database/SupaBase/Base";
import GithubKeys from "./components/Elements/GithubKeys/GithubKeys";
import { SetTokenKeys } from "../Security/IsAuth/Token/TokenKeys";
import SetToken from "../Security/IsAuth/Token/SetToken";
import { cookies } from "next/headers";
import { ContextProvider } from "./context/Context";
import Nav from "./components/Nav/Nav";
import { SearchProvider } from "./components/Elements/SearchContext";
import { SelectionProvider } from "./components/Elements/SelectionContext";
import { TokenReturn } from "./components/ServerActions/TokenReturn";

export default async function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    if(!db) return <ErrorMessage message={`Something went wrong.`}/>
    let isAuth: any = await IsAuth(`c_usr`, `is_auth`, 'id', true);
    if(!isAuth) return redirect('/account');
    
    try {
        let {data: github_keys, error: github_keys_error} = await db.from('github_keys').select('user_id').eq('user_id', isAuth.id).eq('success', true).limit(1);
        if(github_keys_error) {
            return <ErrorMessage message={`Something went wrong.`}/>
        }
        
        if(github_keys && github_keys.length < 1) {
            // console.log("No github keys found")
            const tokenData = await TokenReturn(60)
            if (!tokenData?.token) {
                return <ErrorMessage message="Failed to generate token."/>
            }
            return <GithubKeys token={{ token: tokenData.token, expires: tokenData.expires }}/>
        }

        return (
            <>
            <ContextProvider>
                <SidebarProvider className={` w-full`}>
                    <div className="flex h-screen bg-background text-foreground overflow-hidden w-full">
                        {/* <DashboardSidebar /> */}
                        <SidebarInset className={` w-full`}>
                        <SearchProvider>
                            <SelectionProvider>
                                <div className="flex-1 flex flex-col w-full justify-between h-full overflow-auto overflow-y-auto">
                                    <Nav/>
                                    {children}
                                </div>
                            </SelectionProvider>
                        </SearchProvider>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </ContextProvider>
            </>
        )
    }
    catch (error) {
        console.log("Error Found in DashboardLayout: ", error)
        return <ErrorMessage message={`Something went wrong.`}/>
    }
}