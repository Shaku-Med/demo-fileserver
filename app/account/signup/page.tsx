import React from 'react'
import SignupPage from './components/SignupPage'
import { Metadata } from 'next'
import ErrorMessage from '@/app/dashboard/components/ErrorMessage'
import SetToken from '@/app/Security/IsAuth/Token/SetToken'
import { SetTokenKeys } from '@/app/Security/IsAuth/Token/TokenKeys'

export const metadata: Metadata = {
  title: {
    absolute: `Signup for Explorer`
  },
  description: "Signup",
}

const page = async () => {
  try {
      let key = SetTokenKeys.find(key => key.name === `signup_csrf`)
      let signup_csrf = await SetToken({
        expiresIn: `10m`,
        algorithm: `HS512`
      }, key?.keys || [])
      
      let date = new Date()
      let expires = new Date(date.setMinutes(date.getMinutes() + 10))

      return (
        <>
          <SignupPage csrf={signup_csrf || undefined} expires={expires}/>
        </>
      )
  }
  catch {
    return <ErrorMessage message={`Oh no! Something went wrong. Please try again later.`}/>
  }
}

export default page
