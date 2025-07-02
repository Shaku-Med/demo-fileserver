'use client'

import React from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface KeyDataDialogProps {
  keyData: any
  children: React.ReactNode
}

const KeyDataDialog: React.FC<KeyDataDialogProps> = ({ keyData, children }) => {
  const formatObject = (obj: any, indent = 0): string => {
    if (obj === null) return 'null'
    if (obj === undefined) return 'undefined'
    if (typeof obj === 'string') return `"${obj}"`
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj)
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]'
      return `[\n${obj.map(item => '  '.repeat(indent + 1) + formatObject(item, indent + 1)).join(',\n')}\n${'  '.repeat(indent)}]`
    }
    if (typeof obj === 'object') {
      const keys = Object.keys(obj)
      if (keys.length === 0) return '{}'
      return `{\n${keys.map(key => '  '.repeat(indent + 1) + `"${key}": ${formatObject(obj[key], indent + 1)}`).join(',\n')}\n${'  '.repeat(indent)}}`
    }
    return String(obj)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] select_txt overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Key Data Details</DialogTitle>
        </DialogHeader>
        <div className="py-2 flex flex-col gap-2">
          <Link className='select_txt py-4' href={`https://github.com/${keyData.login}`} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-4 py-4 hover:bg-muted/50 rounded-md transition-colors cursor-pointer">
              <Avatar className="w-30 h-30">
                <AvatarImage src={keyData.avatar_url} />
                <AvatarFallback>{keyData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold">{keyData.name}</h1>
                <p className="text-sm text-muted-foreground">{keyData.login}</p>
              </div>
            </div>
          </Link>
          <pre className="bg-muted select-text p-4 rounded-md text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {formatObject(keyData)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default KeyDataDialog 