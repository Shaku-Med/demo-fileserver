import { Metadata } from "next";
import IsAuth from "../Security/IsAuth/IsAuth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    template: "%s | Explorer",
    default: "Account Access",
  },
  description: "Explorer",
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let isAuth = await IsAuth(`c_usr`, `is_auth`)
  if(isAuth) return redirect('/dashboard')

  return(
    <>
      <div className='flex flex-col items-center md:justify-center h-screen w-full height_watch'>
        {children}
      </div>
    </>
  )
}