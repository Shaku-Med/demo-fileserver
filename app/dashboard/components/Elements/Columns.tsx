import React from 'react'
import { FileItem } from './FileItem'
import FileIcon from '../FileIcon'
import SelectableFileItem from './SelectableFileItem'
import Link from 'next/link'

const Columns = ({files}: {files: FileItem[]}) => {
  const chunkSize = Math.ceil(files.length / 3)
  const columns = [
    files.slice(0, chunkSize),
    files.slice(chunkSize, chunkSize * 2),
    files.slice(chunkSize * 2)
  ]

  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="space-y-3">
            {column.map((file, fileIndex) => (
              <SelectableFileItem key={fileIndex} file={file}>
                <Link href={`/dashboard/${file.type}/${file.album}?l=${file?.repo}`}>
                  <div className="group bg-card border border-border rounded-lg p-3 hover:bg-accent/80 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <FileIcon 
                        type={file.type} 
                        fileName={file.name}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-sm truncate" title={file.name}>
                            {file.name}
                          </h3>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {file.title && (
                            <div className="truncate" title={file.title}>
                              {file.title}
                            </div>
                          )}
                          {file.artists && (
                            <div className="truncate" title={file.artists}>
                              {file.artists}
                            </div>
                          )}
                          {file.album && (
                            <div className="truncate" title={file.album}>
                              {file.album}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </SelectableFileItem>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Columns 