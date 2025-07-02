'use client'

import React, { useContext, useState } from 'react'
import { KeysProps } from './keyTypes'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Key, Plus, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import KeyItem from './KeyItem'
import AddTokenDialog from '../../components/Elements/GithubKeys/components/AddTokenDialog'
import { toast } from 'sonner'
import { handleReadyStates } from '../../components/Elements/GithubKeys/GithubKeys'
import { BaseUrl } from '@/app/lib/Functions/BaseUrl'

interface KeysComponentProps {
  data?: KeysProps[]
  token?: { token: string, expires: Date }
}

const Keys: React.FC<KeysComponentProps> = ({ data, token }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [keys, setKeys] = useState<KeysProps[]>(data || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredKeys = keys.filter((key) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      key.id?.toLowerCase().includes(searchLower) ||
      key.status?.toLowerCase().includes(searchLower) ||
      key.success?.toString().toLowerCase().includes(searchLower) ||
      key.created_at?.toLowerCase().includes(searchLower) ||
      key.updated_at?.toLowerCase().includes(searchLower) ||
      key.reason?.toLowerCase().includes(searchLower)
    const matchesStatus = statusFilter === 'all' || key.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddKey = async (token_data: any) => {
    try {
        let new_key = {
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            success: true,
            reason: '',
            status: 'active' as const
        }
        setKeys(prev => [new_key, ...prev])

        if(!token) {
            toast.error(`We can't add a key without an access token.`)
            return;
        }

        let ready = await handleReadyStates(token.token)
        if(!ready) {
            return;
        }
        setIsLoading(true)
        let send_key = await fetch(`${BaseUrl}/api/github/keys`, {
            method: `POST`,
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': `application/json`,
            },
            body: JSON.stringify({
                token: token_data.token
            })
        })

        if(!send_key.ok) {
            let responseText = await send_key.text()
            setKeys(prev => prev.map(key => 
                key.id === new_key.id ? { ...key, success: false, reason: responseText, status: 'expired' as const } : key
            ))
            toast.error(`${responseText}. It wasn't added to your account.` || `Sorry! We were unable to complete your request.`)
            setIsLoading(false)
            return
        }
    
        window.location.reload()
        setIsLoading(false)
    }
    catch {
        toast.error(`Something went wrong`)
        setIsLoading(false)
    }
  }

  const handleDelete = async (keyData: KeysProps) => {
    try {
        if(!token) {
            toast.error(`We can't delete a key without an access token.`)
            return;
        }

        let ready = await handleReadyStates(token.token)
        if(!ready) {
            return;
        }

        setKeys(prev => prev.filter(key => key.id !== keyData.id))

        let delete_key = await fetch(`${BaseUrl}/api/github/keys`, {
            method: `DELETE`,
            headers: {
                'Authorization': `Bearer ${token.token}`,
                'Content-Type': `application/json`,
            },
            body: JSON.stringify({
                keyId: keyData.id
            })
        })

        if(!delete_key.ok) {
            let responseText = await delete_key.text()
            setKeys(prev => [...prev, keyData])
            toast.error(`${responseText}. The key wasn't deleted.` || `Sorry! We were unable to delete the key.`)
            return
        }

        toast.success(`Key deleted successfully`)
    }
    catch {
        setKeys(prev => [...prev, keyData])
        toast.error(`Something went wrong`)
    }
  }

  if (!keys || keys.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] h-full">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">No keys found</h3>
            <p className="text-muted-foreground">Get started by creating your first key</p>
          </div>
          <Button 
            disabled={isLoading}
            onClick={isLoading ? () => {} : handleAddKey}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Key
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 h-full px-2 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Key className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Github Keys</h2>
            <p className="text-sm text-muted-foreground">
              {filteredKeys?.length || 0} of {keys?.length || 0} key{keys?.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          <AddTokenDialog onAddToken={handleAddKey} />
        </div>
      </div>

      <Separator/>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by key ID, status, success, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <p className={`bg-blue-500/10 py-2 px-4 text-sm`}>
            For security reasons, your actual keys are hidden from view. You'll only see whether they're working successfully or if there are any issues.
        </p>
      </div>

      {filteredKeys.length === 0 && keys.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No keys match your search criteria</p>
        </div>
      )}

      {filteredKeys.length > 0 && (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm min-w-[80px]">Key ID</TableHead>
                <TableHead className="text-xs sm:text-sm min-w-[80px]">Status</TableHead>
                <TableHead className="hidden md:table-cell text-xs sm:text-sm min-w-[100px]">Created</TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm min-w-[100px]">Updated</TableHead>
                <TableHead className="hidden sm:table-cell text-xs sm:text-sm min-w-[80px]">Success</TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm min-w-[120px]">Reason</TableHead>
                <TableHead className="hidden lg:table-cell text-xs sm:text-sm min-w-[120px]">Key Data</TableHead>
                <TableHead className="w-[40px] sm:w-[50px] text-xs sm:text-sm"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeys.map((keyData: KeysProps, index: number) => (
                <KeyItem
                  key={keyData.id || index}
                  keyData={keyData}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default Keys