'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Key, Eye, EyeOff, Github, Shield, AlertTriangle } from 'lucide-react'

interface AddTokenDialogProps {
  onAddToken: (token: { token: string }) => void
}

const AddTokenDialog: React.FC<AddTokenDialogProps> = ({ onAddToken }) => {
  const [open, setOpen] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!token) {
      setError('Token is required')
      return
    }
    
    if (!token.startsWith('ghp_')) {
      setError('Token must start with "ghp_"')
      return
    }
    
    onAddToken({ token })
    setToken('')
    setOpen(false)
  }

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value)
    if (error) setError('')
  }

  const isValidToken = token && token.startsWith('ghp_')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add New Token</span>
          <span className="sm:hidden">Add Token</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20">
              <Github className="h-5 w-5 text-primary" />
            </div>
            Add GitHub Access Token
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="token" className="text-sm font-medium">
              Access Token
            </Label>
            <div className="relative">
              <Input
                id="token"
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={handleTokenChange}
                className={`h-10 pr-10 ${error ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-10 w-10 p-0 hover:bg-transparent"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Your token must start with "ghp_" for GitHub Personal Access Tokens
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-blue-200 flex-shrink-0">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Security Notice</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your access token will be encrypted and stored securely.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValidToken}
              className="flex-1 gap-2"
            >
              <Key className="h-4 w-4" />
              Add Token
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddTokenDialog 