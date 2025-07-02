import React from 'react'
import { FileItem } from './FileItem'
import FileIcon from '../FileIcon'
import SelectableFileItem from './SelectableFileItem'
import Link from 'next/link'

const Grid = ({files}: {files: FileItem[]}) => {
  return (
    <div className="flex-1 p-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2">
        {files.map((file, i) => (
          <SelectableFileItem key={i} file={file}>
            <Link href={`/dashboard/${file.type}/${file.album}?l=${file?.repo}`}>
              <div className="group relative bg-card border border-border rounded-md p-2 hover:bg-accent/80 transition-colors cursor-pointer">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="relative">
                    <FileIcon 
                      type={file.type} 
                      fileName={file.name}
                      size="md"
                    />
                  </div>
                  <div className="w-full">
                    <h3 className="font-medium text-xs truncate" title={file.name}>
                      {file.name}
                    </h3>
                    {file.title && (
                      <p className="text-xs text-muted-foreground truncate" title={file.title}>
                        {file.title}
                      </p>
                    )}
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

export default Grid 