import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Trash2, 
  Download, 
  Copy, 
  Scissors, 
  Edit, 
  Share, 
  MoreHorizontal,
  X,
  CheckSquare,
  Square
} from 'lucide-react'
import { useSelection } from './SelectionContext'

interface SelectionToolbarProps {
  onDelete: () => void
  onDownload: () => void
  onCopy: () => void
  onCut: () => void
  onEdit: () => void
  onShare: () => void
  onSelectAll: () => void
  onDeselectAll: () => void
  totalFiles: number
}

const SelectionToolbar = ({
  onDelete,
  onDownload,
  onCopy,
  onCut,
  onEdit,
  onShare,
  onSelectAll,
  onDeselectAll,
  totalFiles
}: SelectionToolbarProps) => {
  const { selectedCount, isSelectMode, exitSelectMode } = useSelection()

  if (!isSelectMode) return null

  return (
    <div className="bg-primary/10 dark:bg-primary/20 border-b border-border px-3 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-primary-foreground">
              {selectedCount} of {totalFiles} selected
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSelectAll}
                className="h-6 w-6 p-0 hover:bg-primary/20"
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeselectAll}
                className="h-6 w-6 p-0 hover:bg-primary/20"
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="h-8 text-xs"
          >
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="h-8 text-xs"
          >
            <Copy className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Copy</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onCut}
            className="h-8 text-xs"
          >
            <Scissors className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Cut</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 text-xs"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Edit</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-[100000000000000001]">
              <DropdownMenuItem onClick={onShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={exitSelectMode}
            className="h-8 w-8 p-0 hover:bg-primary/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SelectionToolbar 