'use server'
import { headers } from 'next/headers'
import React from 'react'
import { EncryptCombine } from '../../Lock/Combine';
import { getClientIP } from '../../GetIp';

const SetToken = async (options?: object, authKeys?: any[], addData?: object, setUA?: boolean) => {
  try {
        let h = await headers()
        let gip = await getClientIP(h)
        //
        if(!gip) return null;
        let o = {
            'sec-ch-ua-platform': h.get('sec-ch-ua-platform'),
            'user-agent': h.get('user-agent')?.split(/\s+/)?.join(''),
            'x-forwarded-for': h.get('x-forwarded-for')
        } 
        let obj = {
            ip: gip,
            ...o
        }
        // 
        if(addData){
            obj = {
                ...obj,
                ...addData
            }
        }
        // 
        let k = `${!setUA ? o['user-agent'] : ''}+${process.env.TOKEN1}`
        // 
        let keys = [k, process.env.TOKEN2]

        if(authKeys && authKeys.length > 0){
            keys = [k, ...authKeys]
        }


        let enc2 = EncryptCombine(obj, keys, options || {
            expiresIn: '6m',
            algorithm: 'HS512'
        })
        return enc2
  }
  catch (e) {
    console.log("Error Found in SetToken: ", e)
    return null
  }
}

export default SetToken