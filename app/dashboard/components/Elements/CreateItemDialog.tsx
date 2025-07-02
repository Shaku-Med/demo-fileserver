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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Folder, File, FileText, Image, Music, Video, Archive } from 'lucide-react'

export type ItemType = 'folder' | 'file' | 'document' | 'image' | 'music' | 'video' | 'archive'

interface CreateItemDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string, type: ItemType) => void
  itemType: ItemType | null
}

const CreateItemDialog = ({ isOpen, onClose, onCreate, itemType }: CreateItemDialogProps) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<ItemType>('folder')

  useEffect(() => {
    if (itemType) {
      setType(itemType)
    }
  }, [itemType])

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), type)
      setName('')
      onClose()
    }
  }

  const handleCancel = () => {
    setName('')
    onClose()
  }

  const getTypeInfo = (type: ItemType) => {
    switch (type) {
      case 'folder':
        return { icon: Folder, label: 'Folder', description: 'Create a new folder' }
      case 'file':
        return { icon: File, label: 'File', description: 'Create a new file' }
      case 'document':
        return { icon: FileText, label: 'Document', description: 'Create a new document' }
      case 'image':
        return { icon: Image, label: 'Image', description: 'Create a new image file' }
      case 'music':
        return { icon: Music, label: 'Music', description: 'Create a new music file' }
      case 'video':
        return { icon: Video, label: 'Video', description: 'Create a new video file' }
      case 'archive':
        return { icon: Archive, label: 'Archive', description: 'Create a new archive file' }
    }
  }

  const typeInfo = getTypeInfo(type)
  const Icon = typeInfo.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Create New {typeInfo.label}
          </DialogTitle>
          <DialogDescription>
            {typeInfo.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Enter ${typeInfo.label.toLowerCase()} name`}
              className="col-span-3"
              autoFocus
            />
          </div>
          {!itemType && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={type} onValueChange={(value: ItemType) => setType(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="folder">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      Folder
                    </div>
                  </SelectItem>
                  <SelectItem value="file">
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4" />
                      File
                    </div>
                  </SelectItem>
                  <SelectItem value="document">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Document
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Image
                    </div>
                  </SelectItem>
                  <SelectItem value="music">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      Music
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video
                    </div>
                  </SelectItem>
                  <SelectItem value="archive">
                    <div className="flex items-center gap-2">
                      <Archive className="h-4 w-4" />
                      Archive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            Create {typeInfo.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateItemDialog 