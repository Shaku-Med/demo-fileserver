'use client'

import React from 'react'
import { KeysProps } from './keyTypes'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Clock, Key, CheckCircle, XCircle, AlertCircle, MoreHorizontal, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import KeyDataDialog from './KeyDataDialog'

interface KeyItemProps {
  keyData: KeysProps
  index: number
  onDelete?: (keyData: KeysProps) => void
}

const KeyItem: React.FC<KeyItemProps> = ({ 
  keyData, 
  index, 
  onDelete 
}) => {
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Key className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'expired':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(keyData)
    } else {
      console.log('Delete key:', keyData.id)
    }
  }

  return (
    <TableRow key={keyData.id || index}>
      <TableCell className="text-xs sm:text-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          {getStatusIcon(keyData.status)}
          <span className="font-medium truncate max-w-[60px] sm:max-w-none">
            {keyData.id?.slice(0, 6)}...
          </span>
        </div>
      </TableCell>
      <TableCell className="text-xs sm:text-sm">
        <Badge 
          variant="secondary" 
          className={`${getStatusColor(keyData.status)} border-0 text-xs`}
        >
          <span className="hidden sm:inline">{keyData.status || 'unknown'}</span>
          <span className="sm:hidden">{keyData.status?.slice(0, 3) || 'unk'}</span>
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell text-xs sm:text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{formatDate(keyData.created_at)}</span>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{formatDate(keyData.updated_at)}</span>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-xs sm:text-sm">
        <div className="flex flex-wrap gap-1">
          {keyData.success !== undefined && (
            <Badge variant={keyData.success ? "default" : "destructive"} className="text-xs">
              {keyData.success ? 'Success' : 'Failed'}
            </Badge>
          )}
          {keyData.is_updated && (
            <Badge variant="outline" className="text-xs">
              Updated
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-muted-foreground max-w-[150px] line-clamp-1 cursor-help">
                {keyData.reason?.slice(0, 100) || 'N/A'}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs whitespace-pre-wrap break-words">
                {keyData.reason || 'N/A'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-xs sm:text-sm">
        {keyData.key_data ? (
          <KeyDataDialog keyData={keyData.key_data}>
            <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View Data
            </Button>
          </KeyDataDialog>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        )}
      </TableCell>
      <TableCell className="text-xs sm:text-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32 sm:w-40">
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600 text-xs sm:text-sm"
            >
              <Trash2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

export default KeyItem