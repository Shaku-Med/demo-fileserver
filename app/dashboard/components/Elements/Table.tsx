import React from 'react'
import { FileItem } from './FileItem'
import FileIcon from '../FileIcon'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Table = ({files}: {files: FileItem[]}) => {
    let nav = useRouter()
    // console.log(`Files:`, files)
    return (
    <>
        <div className="flex-1 relative">
            <div className="hidden lg:block">
            <table className="w-full text-sm">
                <thead className="bg-card/80 backdrop-blur-lg sticky top-[53px]">
                <tr className="border-b border-border">
                    <th className="text-left py-2 px-4 font-normal text-muted-foreground">#</th>
                    <th className="text-left py-2 px-4 font-normal text-muted-foreground">Name</th>
                    <th className="text-left py-2 px-4 font-normal text-muted-foreground">Title</th>
                    <th className="text-left py-2 px-4 font-normal text-muted-foreground">...</th>
                    <th className="text-left py-2 px-4 font-normal text-muted-foreground">---</th>
                </tr>
                </thead>
                <tbody>
                {files.map((file, i) => (
                        <tr key={i} className="hover:bg-accent/80 border-b border-border cursor-pointer hover:underline" onClick={() => nav.push(`/dashboard/${file.type}/${file.album}?l=${file?.repo}`)}>
                        <td className="py-2 px-4 text-muted-foreground">{i + 1}</td>
                        <td className="py-2 px-4">
                            <div className="flex items-center gap-2">
                            <FileIcon 
                                type={file.type} 
                                fileName={file.name}
                                size="sm"
                            />
                            <span>{file.name}</span>
                            </div>
                        </td>
                        <td className="py-2 px-4 text-muted-foreground">{file.title}</td>
                        <td className="py-2 px-4 text-muted-foreground">{file.artists}</td>
                        <td className="py-2 px-4 text-muted-foreground">{file.album}</td>
                        </tr>
                ))}
                </tbody>
            </table>
            </div>

            <div className="lg:hidden">
            <div className="hidden md:block lg:hidden">
                <table className="w-full text-sm">
                <thead className="bg-card sticky top-[53px]">
                    <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 font-normal text-muted-foreground">Name</th>
                    <th className="text-left py-2 px-3 font-normal text-muted-foreground">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, i) => (
                        <tr key={i} className="hover:bg-accent/80 border-b border-border cursor-pointer hover:underline" onClick={() => nav.push(`/dashboard/${file.type}/${file.album}?l=${file?.repo}`)}>
                        <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                            <FileIcon 
                                type={file.type} 
                                fileName={file.name}
                                size="sm"
                                />
                            <span className="truncate">{file.name}</span>
                            </div>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground text-xs">
                        {file.title || file.artists || file.album || 'No details'}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>

            <div className="md:hidden">
                {files.map((file, i) => (
                <Link key={i} href={`/dashboard/${file.type}/${file.album}?l=${file?.repo}`}>
                    <div className="flex items-center gap-3 p-3 border-b border-border hover:bg-accent/80 cursor-pointer hover:underline">
                    <FileIcon 
                    type={file.type} 
                    fileName={file.name}
                    size="md"
                    />
                    <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-sm">{file.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                        {file.title || file.artists || file.album || 'No details'}
                    </div>
                    </div>
                </div>
                </Link>
                ))}
            </div>
            </div>
      </div>
    </>
  )
}

export default Table
