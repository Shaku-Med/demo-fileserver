import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ErrorMessage from "./dashboard/components/ErrorMessage";
import SetToken from "./Security/IsAuth/Token/SetToken";
import { SetTokenKeys } from "./Security/IsAuth/Token/TokenKeys";

import { cookies } from "next/headers";
import VerifyToken from "./Security/Verifications/VerifyToken";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `Explorer`,
    template: `%s - Explorer`
  },
  description: "Explorer - Secure File Management Platform",
};

export const ERROR_MESSAGES = {
  TOKEN_PROCESSING: "Unable to process your request. Please try again later.",
  TOKEN_GENERATION: "Oops! We had an issue processing your request. Please try again later.",
  GENERAL_ERROR: "Something went wrong on our end. If you're the developer, please check your logs to see what happened.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  NETWORK_ERROR: "Network connection error. Please check your internet connection and try again.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
} as const;

const ErrorPage = ({ message }: { message: string }) => (
  <html suppressHydrationWarning suppressContentEditableWarning lang="en">
    <body
      suppressHydrationWarning
      suppressContentEditableWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased dark min-h-screen flex items-center justify-center px-6 py-4`}
    >
      <div className="w-full max-w-md">
        <ErrorMessage message={message} />
      </div>
    </body>
  </html>
);

export const validateAndSetToken = async (attempt: number = 0, shouldSet: boolean = false): Promise<string | null> => {
  try {
    let c = await cookies()
    const keys = SetTokenKeys.find(key => key.name === 'default')?.keys || [];
    
    if (!keys || keys.length === 0 || !Array.isArray(keys)) {
      throw new Error('Invalid token keys configuration');
    }

    let a_c = c.get(`a_c`)?.value

    if(attempt > 3) return null;

    if(a_c && !shouldSet){
      let verifyAC = await VerifyToken(a_c, keys)
      if(!verifyAC){
        return await validateAndSetToken(attempt + 1, true)
      }
      return null
    }

    const accessToken = await SetToken({
      expiresIn: '1d',
      algorithm: 'HS512'
    }, keys);

    if (!accessToken) {
      return null
    }

    return accessToken;
  } catch (error) {
    console.error('Token validation error:', error);
    // throw error;
    return null;
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    // return "Hello"
    const accessToken = await validateAndSetToken();
    // 
    return (
      <html suppressHydrationWarning suppressContentEditableWarning lang="en">
        <body
          suppressHydrationWarning
          suppressContentEditableWarning
          className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
        >
          {children}
          <Toaster 
            position="bottom-center" 
            style={{
              zIndex: `100000000000000001`
            }} 
            theme={`system`}
            richColors
          />
          {
            accessToken && (
              <>
                <script>
                  {
                    `
                      if(typeof window !== 'undefined'){
                        const expires = new Date();
                        expires.setDate(expires.getDate() + 1);
                        document.cookie = 'a_c=${accessToken};expires=' + expires.toUTCString() + ';path=/;sameSite=strict;priority=high';
                      }
                    `
                  }
                </script>
              </>
            )
          }
        </body>
      </html>
    );
  } catch (error) {
    console.error('Critical error in RootLayout:', error);
    
    let errorMessage: string = ERROR_MESSAGES.GENERAL_ERROR;
    
    if (error instanceof Error) {
      if (error.message.includes('token keys')) {
        errorMessage = ERROR_MESSAGES.TOKEN_PROCESSING;
      } else if (error.message.includes('access token')) {
        errorMessage = ERROR_MESSAGES.TOKEN_GENERATION;
      }
    }

    return <ErrorPage message={errorMessage} />;
  }
}
