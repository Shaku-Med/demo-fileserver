import React from 'react'
import LoginPage from './components/LoginPage'
import { Metadata } from 'next'
import ErrorMessage from '../dashboard/components/ErrorMessage'
import { SetTokenKeys } from '../Security/IsAuth/Token/TokenKeys'
import SetToken from '../Security/IsAuth/Token/SetToken'

export const metadata: Metadata = {
  title: {
    absolute: `Login to Explorer`
  },
  description: "Login",
}

const page = async () => {
  try {

    let key = SetTokenKeys.find(key => key.name === `login_csrf`)
      let login_csrf = await SetToken({
        expiresIn: `10m`,
        algorithm: `HS512`
      }, key?.keys || [])
      
      let date = new Date()
      let expires = new Date(date.setMinutes(date.getMinutes() + 10))

    return (
      <>
        <LoginPage csrf={login_csrf || undefined} expires={expires}/>
      </>
    )
  }
  catch {
    return <ErrorMessage message={`Oh no! Something went wrong. Please try again later.`}/>
  }
}

export default page
