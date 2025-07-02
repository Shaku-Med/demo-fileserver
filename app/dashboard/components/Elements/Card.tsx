import React from 'react'
import { FileItem } from './FileItem'
import FileIcon from '../FileIcon'
import FileMoreButton from '../FileMoreButton'
import SelectableFileItem from './SelectableFileItem'

const Card = ({files}: {files: FileItem[]}) => {
  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {files.map((file, i) => (
          <SelectableFileItem key={i} file={file}>
            <div className="group relative bg-card border border-border rounded-lg p-4 hover:bg-accent/80 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <FileIcon 
                  type={file.type} 
                  fileName={file.name}
                  size="lg"
                />
                <FileMoreButton />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm truncate" title={file.name}>
                  {file.name}
                </h3>
                {file.title && (
                  <p className="text-xs text-muted-foreground truncate" title={file.title}>
                    {file.title}
                  </p>
                )}
                {file.artists && (
                  <p className="text-xs text-muted-foreground truncate" title={file.artists}>
                    {file.artists}
                  </p>
                )}
                {file.album && (
                  <p className="text-xs text-muted-foreground truncate" title={file.album}>
                    {file.album}
                  </p>
                )}
              </div>
            </div>
          </SelectableFileItem>
        ))}
      </div>
    </div>
  )
}

export default Card 