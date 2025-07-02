'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import { BaseUrl } from '@/app/lib/Functions/BaseUrl'
import SetQuickToken from '@/app/Security/IsAuth/Token/SetQuickToken'
import Cookies from 'js-cookie'

const LoginPage = ({csrf, expires}: {csrf?: string, expires?: Date}) => {
  let nav = useRouter()
  // 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      let a_c = Cookies.get(`a_c`)

      if(a_c && csrf){
        let st = await SetQuickToken({
          setname: `login`,
          checkfor: `default`,
          addKeys: [],
          data: a_c
        })

        if(!st) {
          setIsLoading(false)
          toast.error(`Sorry! We were unable to complete your request.`)
          return;
        }

        let sp = await fetch(`${BaseUrl}/api/auth/login`, {
          method: `POST`,
          headers: {
            'Authorization': `Bearer ${csrf}`,
            'Content-Type': `application/json`,
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          })
        })

        if(!sp.ok) {
          setIsLoading(false)
          let data = await sp.text()
          toast.error(data || `Your request lost it's way. Please try again.`)
          return;
        }

        let data = await sp.json()
        if(data.action) {
          if(data?.action?.includes('window')){
            eval(data?.action)
          }
          else {
            nav.push(data?.action)
          }
        }

      }
      else {
        setIsLoading(false)
        toast.info(`Request Failed! We couldn't get your auth token to preceed with.`)
        return;
      }
    } catch (error) {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`)
  }

  return (
      <div className="w-full md:h-fit h-full md:max-w-md ">
        <Card className="md:shadow-xl shadow-none border-0 md:bg-card/80 bg-[transparent] border border-none md:border-1 backdrop-blur-sm height_round">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-4xl font-bold ">
             Hey, What's Up?
            </CardTitle>
            <CardDescription className="">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  {/* <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm ">Remember me</span> */}
                </label>
                <Link href="/account/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  Forgot password?
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full text-foreground font-medium py-2.5"
                disabled={isLoading}
                variant="default"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            
            {/* <div className="relative my-6 flex items-center">
              <div className='w-full h-[2px] rounded-lg bg-border' />
              <div className={`px-2 min-w-fit`}>
                <span className=" px-2 text-sm ">or continue with</span>
              </div>
              <div className='w-full h-[2px] rounded-lg bg-border' />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('github')}
                className="flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </Button>
            </div> */}
            <Separator/>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm ">
              Don't have an account?{' '}
              <Link href="/account/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
  )
}

export default LoginPage
