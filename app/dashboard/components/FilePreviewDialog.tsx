import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { File, X } from 'lucide-react';

interface FilePreviewDialogProps {
  file: File;
  onRemove: () => void;
}

export const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ file, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handlePreview = () => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const renderPreview = () => {
    if (file.type.startsWith('image/')) {
      return (
        <img
          src={previewUrl}
          alt={file.name}
          className="max-w-full max-h-[70vh] object-contain"
        />
      );
    } else if (file.type.startsWith('video/')) {
      return (
        <video
          src={previewUrl}
          controls
          className="max-w-full max-h-[70vh]"
        />
      );
    } else {
      return (
        <div className="p-4 text-center">
          <p className="text-lg font-medium">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      );
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePreview}
        className="h-8 w-8 p-0"
      >
       {
        file?.type?.startsWith(`image/`) ? 
        <>
          <img src={`${URL.createObjectURL(file)}`} className={`min-w-10 border rounded-lg shadow-lg object-cover`}/>
        </> :
        <>
          <div className={`min-w-10 overflow-hidden min-h-10 border rounded-lg shadow-lg object-cover flex items-center justify-center`}>
            <File className="h-4 w-4" />
          </div>
        </>
       }
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className={`max-w-3xl`}>
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{file.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            {renderPreview()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 