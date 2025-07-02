import React from 'react'
import { FileItem } from './FileItem'
import FileIcon from '../FileIcon'
import SelectableFileItem from './SelectableFileItem'
import Link from 'next/link'

const List = ({files}: {files: FileItem[]}) => {
  return (
    <div className="flex-1">
      <div className="space-y-1 p-2">
        {files.map((file, i) => (
          <SelectableFileItem key={i} file={file}>
            <Link href={`/dashboard/${file.type}/${file.album}?l=${file?.repo}`}>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/80 transition-colors cursor-pointer group">
                <FileIcon 
                  type={file.type} 
                  fileName={file.name}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-sm truncate flex-1" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {file.title && (
                        <span className="truncate max-w-32" title={file.title}>
                          {file.title}
                        </span>
                      )}
                      {file.artists && (
                        <span className="truncate max-w-32" title={file.artists}>
                          {file.artists}
                        </span>
                      )}
                      {file.album && (
                        <span className="truncate max-w-32" title={file.album}>
                          {file.album}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SelectableFileItem>
        ))}
      </div>
    </div>
  )
}

export default List 