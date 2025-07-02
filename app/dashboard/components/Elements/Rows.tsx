import React from 'react'
import { FileItem } from './FileItem'
import FileIcon from '../FileIcon'
import SelectableFileItem from './SelectableFileItem'
import Link from 'next/link'

const Rows = ({files}: {files: FileItem[]}) => {
  return (
    <div className="flex-1 p-4">
      <div className="space-y-3">
        {files.map((file, i) => (
          <SelectableFileItem key={i} file={file}>
            <Link href={`/dashboard/${file.type}/${file.album}?l=${file?.repo}`}>
              <div className="group bg-card border border-border rounded-lg p-4 hover:bg-accent/80 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <FileIcon 
                    type={file.type} 
                    fileName={file.name}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-base truncate" title={file.name}>
                        {file.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      {file.title && (
                        <div>
                          <span className="font-medium">Title:</span> {file.title}
                        </div>
                      )}
                      {file.artists && (
                        <div>
                          <span className="font-medium">Artist:</span> {file.artists}
                        </div>
                      )}
                      {file.album && (
                        <div>
                          <span className="font-medium">Album:</span> {file.album}
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
    </div>
  )
}

export default Rows 