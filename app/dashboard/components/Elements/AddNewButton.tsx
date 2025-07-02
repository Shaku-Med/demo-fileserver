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
  Plus, 
  Folder, 
  File, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Archive, 
  Upload,
  ChevronDown
} from 'lucide-react'

interface AddNewButtonProps {
  onAddFolder: () => void
  onAddFile: () => void
  onAddDocument: () => void
  onAddImage: () => void
  onAddMusic: () => void
  onAddVideo: () => void
  onAddArchive: () => void
  onUploadFiles: () => void
}

const AddNewButton = ({
  onAddFolder,
  onAddFile,
  onAddDocument,
  onAddImage,
  onAddMusic,
  onAddVideo,
  onAddArchive,
  onUploadFiles
}: AddNewButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="h-8 px-2 sm:px-3 text-xs text-foreground">
          <Plus className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Add New</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 z-[100000000000000001]">
        <DropdownMenuItem onClick={onAddFolder}>
          <Folder className="h-4 w-4 mr-2" />
          New Folder
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onUploadFiles}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AddNewButton 