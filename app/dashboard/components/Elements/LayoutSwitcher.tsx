import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Table, 
  Grid, 
  List, 
  Columns, 
  Rows, 
  Layout,
  ChevronDown
} from 'lucide-react'

export type LayoutType = 'table' | 'grid' | 'list' | 'columns' | 'rows'

interface LayoutSwitcherProps {
  currentLayout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
}

const LayoutSwitcher = ({ currentLayout, onLayoutChange }: LayoutSwitcherProps) => {
  const getLayoutIcon = (layout: LayoutType) => {
    switch (layout) {
      case 'table':
        return <Table className="h-4 w-4" />
      case 'grid':
        return <Grid className="h-4 w-4" />
      case 'list':
        return <List className="h-4 w-4" />
      case 'columns':
        return <Columns className="h-4 w-4" />
      case 'rows':
        return <Rows className="h-4 w-4" />
      default:
        return <Layout className="h-4 w-4" />
    }
  }

  const getLayoutLabel = (layout: LayoutType) => {
    switch (layout) {
      case 'table':
        return 'Table'
      case 'grid':
        return 'Grid'
      case 'list':
        return 'List'
      case 'columns':
        return 'Columns'
      case 'rows':
        return 'Rows'
      default:
        return 'Layout'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3 text-xs">
          {getLayoutIcon(currentLayout)}
          <span className="ml-1 hidden sm:inline">{getLayoutLabel(currentLayout)}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 z-[100000000000000001]">
        <DropdownMenuItem onClick={() => onLayoutChange('table')}>
          <Table className="h-4 w-4 mr-2" />
          Table View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLayoutChange('grid')}>
          <Grid className="h-4 w-4 mr-2" />
          Grid View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLayoutChange('list')}>
          <List className="h-4 w-4 mr-2" />
          List View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLayoutChange('columns')}>
          <Columns className="h-4 w-4 mr-2" />
          Columns View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onLayoutChange('rows')}>
          <Rows className="h-4 w-4 mr-2" />
          Rows View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LayoutSwitcher 