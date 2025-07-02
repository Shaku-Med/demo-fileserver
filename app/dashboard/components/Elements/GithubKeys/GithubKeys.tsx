'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Key, Eye, EyeOff, Copy, Edit, Trash2, ExternalLink, AlertTriangle, Info, CheckCircle2, Github, Shield, ArrowRight } from 'lucide-react'
import KeyList from './components/KeyList'
import Instructions from './components/Instructions'
import AddTokenDialog from './components/AddTokenDialog'
import SetQuickToken from '@/app/Security/IsAuth/Token/SetQuickToken'
import { toast } from 'sonner'
import Cookies from 'js-cookie'
import { BaseUrl } from '@/app/lib/Functions/BaseUrl'

interface GitHubKey {
  id: string
  name: string
  token: string
  permissions: string[]
  createdAt: string
  lastUsed?: string
  isActive: boolean
  success: boolean
  reason?: string
}

interface GithubKeysProps {
  token: {
    token: string
    expires: Date
  } | null
}

export const handleReadyStates = async (token: string, setname: string = 'github_keys') => {
    try {
        if(!token) return null
        let a_c = Cookies.get(`a_c`)

        if(a_c && token){
          let st = await SetQuickToken({
            setname: setname,
            checkfor: `default`,
            addKeys: [],
            data: a_c
          })
  
          if(!st) {
            toast.error(`Sorry! We were unable to complete your request.`)
            return null
          }

          return true
        }
    }
    catch {
        return null
    }
}

const GithubKeys = ({ token }: GithubKeysProps) => {
  const [keys, setKeys] = useState<GitHubKey[]>([])

  const [activeTab, setActiveTab] = useState('keys')

  const addKey = async (newKey: { token: string }) => {
    if(!token) {
        toast.error(`We can't add a key without an access token.`)
        return;
    }
    const key: GitHubKey = {
      name: 'GitHub Token',
      token: newKey.token,
      permissions: ['repo'],
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      success: true,
      reason: ''
    }
    setKeys(prev => [key, ...prev])
    // 
    let ready = await handleReadyStates(token.token)
    if(!ready) {
        return;
    }
    let send_key = await fetch(`${BaseUrl}/api/github/keys`, {
        method: `POST`,
        headers: {
            'Authorization': `Bearer ${token.token}`,
            'Content-Type': `application/json`,
        },
        body: JSON.stringify({
            token: newKey.token
        })
    })
    if(!send_key.ok) {
        let data = await send_key.text()
        setKeys(prev => prev.map(key => 
            key.id === key.id ? { ...key, success: false, reason: data } : key
        ))
        toast.error(data || `Sorry! We were unable to complete your request.`)
        return
    }

    window.location.reload()
  }

  const toggleKeyVisibility = (id: string) => {
    setKeys(prev => prev.map(key => 
      key.id === id ? { ...key, isActive: !key.isActive } : key
    ))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <Github className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div className="space-y-2 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">GitHub Access Tokens</h1>
              <p className="text-base md:text-sm text-xs text-muted-foreground max-w-2xl leading-relaxed">
                We need your GitHub access to serve as a storage system for your files, giving you complete personal control over everything
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2">
                <Badge variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3 py-1">
                  {keys.length} key{keys.length !== 1 ? 's' : ''} configured
                </Badge>
                <Badge variant="outline" className="text-xs sm:text-sm px-2 sm:px-3 py-1 border-green-500/30 text-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure Storage
                </Badge>
              </div>
            </div>
          </div>
          <AddTokenDialog onAddToken={addKey} />
        </div>

        <Card className="py-0 bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-200 flex-shrink-0">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm sm:text-base">Why GitHub Storage?</h3>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Your files are stored directly in your GitHub repositories, ensuring you maintain complete ownership and control. 
                  This approach provides enterprise-grade security, version control, and the ability to access your files from anywhere.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6 py-6">
        <TabsList className="grid w-full grid-cols-2 h-10 sm:h-12">
          <TabsTrigger value="keys" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium">
            <Key className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Access Keys</span>
            <span className="sm:hidden">Keys</span>
            {keys.length > 0 && (
              <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                {keys.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-medium">
            <Info className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Setup Guide</span>
            <span className="sm:hidden">Guide</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-4">
          <KeyList 
            keys={keys}
            onToggleVisibility={toggleKeyVisibility}
          />
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <Instructions />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default GithubKeys
