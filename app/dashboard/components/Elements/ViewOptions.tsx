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
  SortAsc, 
  SortDesc, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  ChevronDown
} from 'lucide-react'

interface ViewOptionsProps {
  onSortChange: (sort: 'name' | 'type' | 'date') => void
  onOrderChange: (order: 'asc' | 'desc') => void
  onSizeChange: (size: 'small' | 'medium' | 'large') => void
  currentSort: 'name' | 'type' | 'date'
  currentOrder: 'asc' | 'desc'
  currentSize: 'small' | 'medium' | 'large'
}

const ViewOptions = ({
  onSortChange,
  onOrderChange,
  onSizeChange,
  currentSort,
  currentOrder,
  currentSize
}: ViewOptionsProps) => {
  const getSortIcon = (sort: 'name' | 'type' | 'date') => {
    switch (sort) {
      case 'name':
        return <SortAsc className="h-4 w-4" />
      case 'type':
        return <SortAsc className="h-4 w-4" />
      case 'date':
        return <SortAsc className="h-4 w-4" />
      default:
        return <SortAsc className="h-4 w-4" />
    }
  }

  const getSizeIcon = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return <ZoomOut className="h-4 w-4" />
      case 'medium':
        return <Maximize2 className="h-4 w-4" />
      case 'large':
        return <ZoomIn className="h-4 w-4" />
      default:
        return <Maximize2 className="h-4 w-4" />
    }
  }

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3 text-xs">
            {getSortIcon(currentSort)}
            <span className="ml-1 hidden sm:inline capitalize">{currentSort}</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 z-[100000000000000001]">
          <DropdownMenuItem onClick={() => onSortChange('name')}>
            <SortAsc className="h-4 w-4 mr-2" />
            Sort by Name
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('type')}>
            <SortAsc className="h-4 w-4 mr-2" />
            Sort by Type
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange('date')}>
            <SortAsc className="h-4 w-4 mr-2" />
            Sort by Date
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onOrderChange(currentOrder === 'asc' ? 'desc' : 'asc')}
        className="h-8 w-8 p-0"
      >
        {currentOrder === 'asc' ? (
          <SortAsc className="h-4 w-4" />
        ) : (
          <SortDesc className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

export default ViewOptions 