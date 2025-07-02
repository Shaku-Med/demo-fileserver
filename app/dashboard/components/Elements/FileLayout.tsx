import React from 'react'
import { FileItem } from './FileItem'
import Table from './Table'
import List from './List'
import Grid from './Grid'
import Rows from './Rows'
import Columns from './Columns'
import { LayoutType } from './LayoutSwitcher'

interface FileLayoutProps {
  files: FileItem[]
  layout: LayoutType
}

const FileLayout = ({ files, layout }: FileLayoutProps) => {
  switch (layout) {
    case 'table':
      return <Table files={files} />
    case 'list':
      return <List files={files} />
    case 'grid':
      return <Grid files={files} />
    case 'rows':
      return <Rows files={files} />
    case 'columns':
      return <Columns files={files} />
    default:
      return <Table files={files} />
  }
}

export default FileLayout 