import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Upload, X, File, Check } from 'lucide-react'
import { FileUpload } from '../FileUploader'
import { toast } from 'sonner'
import { handleReadyStates } from './GithubKeys/GithubKeys'
import { BaseUrl } from '@/app/lib/Functions/BaseUrl'
import { usePathname, useSearchParams } from 'next/navigation'

interface FileUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (files: File[]) => void
}


/**
 * Interface defining the structure of file chunks for chunked uploads
 */
interface FileChunk {
  id: string;
  blob: Blob;
  name: string;
  index: number;
  totalChunks: number;
  objectUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  path?: string;
  url?: string;
  responseData?: any;
  length: number;
}

/**
 * Interface for generated video thumbnails
 */
interface VideoThumbnail {
  id: string;
  width: number;
  height: number;
  thumbnail: string; // Base64 data URL
  timeStamp: number;
  selected: boolean;
}


interface UploadFile {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
}

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error' | 'pending-thumbnail';
  error?: string;
  customName?: string;
  url?: string;
  retryCount?: number;
  responseData?: any;
  chunkLength?: number;
  totalChunks?: number;
  chunks: FileChunk[];
  chunkingProgress?: number;
  path?: string;
  fileType?: string;
  // Video thumbnail related properties
  isVideo?: boolean;
  generatedThumbnails?: VideoThumbnail[];
  selectedThumbnail?: VideoThumbnail;
  customThumbnail?: File;
  thumbnailGenerationProgress?: number;
  thumbnailUrl?: string;
  showThumbnailSelector?: boolean;
}

const FileUploadDialog = ({ isOpen, onClose, onUpload }: FileUploadDialogProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  let handleSubmitData = async (data: UploadedFile) => {
    try {
      let verify = await handleReadyStates('token', 'add_file')
      if(!verify) {
        toast.error(`Failed to verify token`)
        return
      }

      let send_data = {
        customName: data.customName,
        fileType: data.fileType,
        isVideo: data.isVideo,
        id: data.id,
        access_url: data?.responseData?.urls,
        thumbnail: data?.responseData?.thumbnail?.url,
        access_url_length: data?.responseData?.length,
        access_url_thumbnail_length: data?.responseData?.thumbnail?.length,
        path: `${pathname?.split(`/folder/`)[1] || ''}/${data?.file?.name}`,
        repo: searchParams.get('l') || ``
      }

      let push_data = await fetch(`${BaseUrl}/api/add/file`, {
        method: `POST`,
        body: JSON.stringify(send_data)
      })

      if(!push_data.ok) {
        toast.error(`Failed to upload file`)
        return
      }

      toast.success(`File uploaded successfully`)
      // onClose()
    }
    catch {
      toast.error(`Something went wrong`)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open && isUploading) {
      return
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={` overflow-auto max-h-full`}>
        <FileUpload addVideoThumbnail onProcessing={(e) => {
          setIsUploading(e)
        }} onFilesChange={(e) => {
          handleSubmitData(e[e.length - 1])
        }} />
      </DialogContent>
    </Dialog>
  )
}

export default FileUploadDialog 