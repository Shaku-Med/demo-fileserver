import React from 'react'
import { FileItem } from './FileItem'
import { Folder, File, FileText, Image, Music, Video, Archive } from 'lucide-react'

interface FileCounterProps {
  files: FileItem[]
}

const FileCounter = ({ files }: FileCounterProps) => {
  const totalFiles = files.length
  const folders = files.filter(file => file.type === 'folder').length
  const documents = files.filter(file => 
    file.type === 'file' && 
    (file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.txt'))
  ).length
  const images = files.filter(file => 
    file.type === 'file' && 
    (file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.gif'))
  ).length
  const music = files.filter(file => 
    file.type === 'file' && 
    (file.name.endsWith('.mp3') || file.name.endsWith('.wav') || file.name.endsWith('.flac'))
  ).length
  const videos = files.filter(file => 
    file.type === 'file' && 
    (file.name.endsWith('.mp4') || file.name.endsWith('.avi') || file.name.endsWith('.mov'))
  ).length
  const archives = files.filter(file => 
    file.type === 'file' && 
    (file.name.endsWith('.zip') || file.name.endsWith('.rar') || file.name.endsWith('.7z'))
  ).length

  return (
    <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground px-3 py-2 bg-muted/30 dark:bg-muted/20 border-b border-border">
      <div className="flex items-center gap-1">
        <span className="font-medium">{totalFiles}</span>
        <span className="hidden sm:inline">items</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {folders > 0 && (
          <div className="flex items-center gap-1">
            <Folder className="h-3 w-3" />
            <span>{folders}</span>
          </div>
        )}
        
        {documents > 0 && (
          <div className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            <span>{documents}</span>
          </div>
        )}
        
        {images > 0 && (
          <div className="flex items-center gap-1">
            <Image className="h-3 w-3" />
            <span>{images}</span>
          </div>
        )}
        
        {music > 0 && (
          <div className="flex items-center gap-1">
            <Music className="h-3 w-3" />
            <span>{music}</span>
          </div>
        )}
        
        {videos > 0 && (
          <div className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            <span>{videos}</span>
          </div>
        )}
        
        {archives > 0 && (
          <div className="flex items-center gap-1">
            <Archive className="h-3 w-3" />
            <span>{archives}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileCounter 