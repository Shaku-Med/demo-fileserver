import React from 'react'
import Keys from './components/Keys'
import ErrorMessage from '../components/ErrorMessage'
import db from '@/app/lib/Database/SupaBase/Base'
import IsAuth from '@/app/Security/IsAuth/IsAuth'
import { useDashboardContext } from '../context/Context'
import { TokenReturn } from '../components/ServerActions/TokenReturn'

const page = async () => {
  try {    // 
    let isAuth: any = await IsAuth(`c_usr`, `is_auth`, 'id', true);
    if(!isAuth) return <ErrorMessage message="You have to be logged in to continue plz." />

    if(!db) return <ErrorMessage message="Something went wrong." />
    let {data, error} = await db.from('github_keys').select('id, key_data, status, reason, success, created_at, updated_at, is_updated, user_id').eq('user_id', isAuth.id).eq('success', true)
    if(error) return <ErrorMessage message="Something went wrong." />
    if(!data) return <ErrorMessage message="No keys found." />

    let token = await TokenReturn(60)
    if(!token) return <ErrorMessage message="Something went wrong." />

    return (
      <>
        <Keys data={data} token={token} />
      </>
    )
  }
  catch {
    return <ErrorMessage message="Error fetching keys" />
  }
}

export default page
