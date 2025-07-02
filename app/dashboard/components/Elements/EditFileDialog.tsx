import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileItem } from './FileItem'

interface EditFileDialogProps {
  file: FileItem | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedFile: FileItem) => void
}

const EditFileDialog = ({ file, isOpen, onClose, onSave }: EditFileDialogProps) => {
  const [formData, setFormData] = useState<Partial<FileItem>>({})

  useEffect(() => {
    if (file) {
      setFormData({
        name: file.name,
        title: file.title,
        artists: file.artists,
        album: file.album
      })
    }
  }, [file])

  const handleSave = () => {
    if (file && formData.name) {
      onSave({
        ...file,
        ...formData
      })
      onClose()
    }
  }

  const handleCancel = () => {
    setFormData({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit File Properties</DialogTitle>
          <DialogDescription>
            Update the properties of "{file?.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="artists" className="text-right">
              Artists
            </Label>
            <Input
              id="artists"
              value={formData.artists || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, artists: e.target.value }))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="album" className="text-right">
              Album
            </Label>
            <Input
              id="album"
              value={formData.album || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, album: e.target.value }))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditFileDialog 