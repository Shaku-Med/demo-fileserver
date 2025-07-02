'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  MoreHorizontal,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Activity,
  Plus
} from 'lucide-react'
import { toast } from 'sonner'

interface GitHubKey {
  id: string
  name: string
  token: string
  permissions: string[]
  createdAt: string
  lastUsed?: string
  isActive: boolean
  success?: boolean
  reason?: string
}

interface KeyListProps {
  keys: GitHubKey[]
  onToggleVisibility: (id: string) => void
}

const KeyList: React.FC<KeyListProps> = ({ keys, onToggleVisibility }) => {
  const [showToken, setShowToken] = useState<{ [key: string]: boolean }>({})

  const handleCopyToken = async (token: string) => {
    try {
      // Try using the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(token)
        toast.success('Token copied to clipboard')
        return
      }
      
      // Fallback method for older browsers or non-secure contexts
      const textArea = document.createElement('textarea')
      textArea.value = token
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        document.execCommand('copy')
        toast.success('Token copied to clipboard')
      } catch (err) {
        toast.error('Failed to copy token')
      } finally {
        document.body.removeChild(textArea)
      }
    } catch (error) {
      toast.error('Failed to copy token')
    }
  }

  const toggleTokenVisibility = (keyId: string) => {
    setShowToken(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPermissionBadge = (permission: string) => {
    const permissionColors: { [key: string]: string } = {
      repo: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      user: 'bg-green-500/10 text-green-600 border-green-500/20',
      workflow: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      'admin:org': 'bg-red-500/10 text-red-600 border-red-500/20',
      delete_repo: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      gist: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
    }

    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${permissionColors[permission] || 'bg-gray-500/10 text-gray-600 border-gray-500/20'}`}
      >
        {permission}
      </Badge>
    )
  }

  if (keys.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <Key className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No access keys found</h3>
          <p className="text-muted-foreground text-center mb-4">
            You haven't added any GitHub access keys yet. Add your first key to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {keys.map((key) => (
        <Card key={key.id} className={`group py-0 hover:shadow-md transition-shadow ${key.success ? 'border-green-500/20' : 'border-red-500/20'}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4">
                {!key.success && (
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">{key.reason}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <div className="relative">
                      <Input
                        type={showToken[key.id] ? 'text' : 'password'}
                        value={key.token}
                        readOnly
                        className="pr-20 font-mono text-sm"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyToken(key.token)}
                          className="h-7 w-7 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleCopyToken(key.token)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Token
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default KeyList 