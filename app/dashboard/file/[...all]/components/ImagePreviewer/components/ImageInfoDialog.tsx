'use client'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../../../../components/ui/dialog'
import { Badge } from '../../../../../../../components/ui/badge'
import { Separator } from '../../../../../../../components/ui/separator'
import { FileImage, Calendar, HardDrive, Monitor, Hash } from 'lucide-react'

interface ImageInfo {
  name: string
  size: number
  type: string
  dimensions: { width: number; height: number }
  lastModified?: Date
  exif?: {
    camera?: string
    dateTaken?: Date
    location?: string
    iso?: number
    aperture?: string
    shutterSpeed?: string
    focalLength?: string
  }
}

interface ImageInfoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageInfo: ImageInfo | null
}

const ImageInfoDialog: React.FC<ImageInfoDialogProps> = ({
  open,
  onOpenChange,
  imageInfo
}) => {
  if (!imageInfo) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Image Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">File Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium truncate ml-2">{imageInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="secondary" className="text-xs">
                  {imageInfo.type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{formatFileSize(imageInfo.size)}</span>
              </div>
              {imageInfo.lastModified && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modified:</span>
                  <span className="font-medium text-xs">{formatDate(imageInfo.lastModified)}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Dimensions
            </h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Resolution:</span>
              <span className="font-medium">
                {imageInfo.dimensions.width} × {imageInfo.dimensions.height}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Aspect Ratio:</span>
              <span className="font-medium">
                {(imageInfo.dimensions.width / imageInfo.dimensions.height).toFixed(2)}:1
              </span>
            </div>
          </div>

          {imageInfo.exif && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  EXIF Data
                </h4>
                <div className="space-y-2 text-sm">
                  {imageInfo.exif.camera && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Camera:</span>
                      <span className="font-medium">{imageInfo.exif.camera}</span>
                    </div>
                  )}
                  {imageInfo.exif.dateTaken && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Taken:</span>
                      <span className="font-medium text-xs">{formatDate(imageInfo.exif.dateTaken)}</span>
                    </div>
                  )}
                  {imageInfo.exif.iso && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ISO:</span>
                      <span className="font-medium">{imageInfo.exif.iso}</span>
                    </div>
                  )}
                  {imageInfo.exif.aperture && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aperture:</span>
                      <span className="font-medium">f/{imageInfo.exif.aperture}</span>
                    </div>
                  )}
                  {imageInfo.exif.shutterSpeed && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shutter Speed:</span>
                      <span className="font-medium">{imageInfo.exif.shutterSpeed}s</span>
                    </div>
                  )}
                  {imageInfo.exif.focalLength && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Focal Length:</span>
                      <span className="font-medium">{imageInfo.exif.focalLength}mm</span>
                    </div>
                  )}
                  {imageInfo.exif.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium text-xs truncate ml-2">{imageInfo.exif.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageInfoDialog 