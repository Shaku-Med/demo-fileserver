import React from 'react';
import { cn } from '@/lib/utils';

interface FileIconProps {
  type: 'file' | 'folder';
  fileType?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const getFileType = (name: string): string => {
  const extension = name.split('.').pop()?.toLowerCase();
  if (!extension) return 'file';
  
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  const audioTypes = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'];
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf'];
  const archiveTypes = ['zip', 'rar', '7z', 'tar', 'gz'];
  const codeTypes = ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'py', 'java', 'cpp', 'c'];
  
  if (imageTypes.includes(extension)) return 'image';
  if (videoTypes.includes(extension)) return 'video';
  if (audioTypes.includes(extension)) return 'audio';
  if (documentTypes.includes(extension)) return 'document';
  if (archiveTypes.includes(extension)) return 'archive';
  if (codeTypes.includes(extension)) return 'code';
  
  return 'file';
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
};

export const FileIcon: React.FC<FileIconProps> = ({ 
  type, 
  fileType, 
  className,
  size = 'md' 
}) => {
  const iconSize = sizeClasses[size];
  
  if (type === 'folder') {
    return (
      <div className={cn('relative', iconSize, className)}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className={cn('w-full h-full', iconSize)}
        >
          <path
            d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7Z"
            fill="url(#folderGradient)"
            stroke="url(#folderStroke)"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="folderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FFA500" />
            </linearGradient>
            <linearGradient id="folderStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DAA520" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  const actualFileType = fileType || 'file';
  
  const getFileIcon = () => {
    switch (actualFileType) {
      case 'image':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', iconSize)}>
            <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#imageGradient)" stroke="url(#imageStroke)" strokeWidth="1.5"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
            <path d="M21 15L16 10L5 21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="imageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="imageStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3730A3" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>
            </defs>
          </svg>
        );
        
      case 'video':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', iconSize)}>
            <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#videoGradient)" stroke="url(#videoStroke)" strokeWidth="1.5"/>
            <path d="M9 8L15 12L9 16V8Z" fill="white"/>
            <defs>
              <linearGradient id="videoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#B91C1C" />
              </linearGradient>
              <linearGradient id="videoStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#991B1B" />
                <stop offset="100%" stopColor="#7F1D1D" />
              </linearGradient>
            </defs>
          </svg>
        );
        
      case 'audio':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', iconSize)}>
            <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#audioGradient)" stroke="url(#audioStroke)" strokeWidth="1.5"/>
            <path d="M9 18V12L15 9V15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" fill="white"/>
            <path d="M18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21Z" fill="white"/>
            <defs>
              <linearGradient id="audioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="audioStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#065F46" />
                <stop offset="100%" stopColor="#064E3B" />
              </linearGradient>
            </defs>
          </svg>
        );
        
      case 'document':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', iconSize)}>
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="url(#documentGradient)" stroke="url(#documentStroke)" strokeWidth="1.5"/>
            <path d="M14 2V8H20" stroke="url(#documentStroke)" strokeWidth="1.5"/>
            <path d="M16 13H8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 17H8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10 9H8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="documentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="documentStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E40AF" />
                <stop offset="100%" stopColor="#1E3A8A" />
              </linearGradient>
            </defs>
          </svg>
        );
        
      case 'archive':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', iconSize)}>
            <path d="M21 8V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V8" stroke="url(#archiveStroke)" strokeWidth="1.5"/>
            <path d="M7 3V8H17V3" stroke="url(#archiveStroke)" strokeWidth="1.5"/>
            <path d="M7 3H17" stroke="url(#archiveStroke)" strokeWidth="1.5"/>
            <path d="M7 3C7 1.89543 7.89543 1 9 1H15C16.1046 1 17 1.89543 17 3" fill="url(#archiveGradient)" stroke="url(#archiveStroke)" strokeWidth="1.5"/>
            <path d="M9 12H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 16H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="archiveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7C2D12" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
              <linearGradient id="archiveStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#451A03" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
            </defs>
          </svg>
        );
        
      case 'code':
        return (
          <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', iconSize)}>
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="url(#codeGradient)" stroke="url(#codeStroke)" strokeWidth="1.5"/>
            <path d="M14 2V8H20" stroke="url(#codeStroke)" strokeWidth="1.5"/>
            <path d="M9 17L6 14L9 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 17L18 14L15 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
              <linearGradient id="codeStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6D28D9" />
                <stop offset="100%" stopColor="#5B21B6" />
              </linearGradient>
            </defs>
          </svg>
        );
        
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" className={cn('w-full h-full', iconSize)}>
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="url(#fileGradient)" stroke="url(#fileStroke)" strokeWidth="1.5"/>
            <path d="M14 2V8H20" stroke="url(#fileStroke)" strokeWidth="1.5"/>
            <path d="M16 13H8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 17H8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="fileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6B7280" />
                <stop offset="100%" stopColor="#4B5563" />
              </linearGradient>
              <linearGradient id="fileStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>
            </defs>
          </svg>
        );
    }
  };

  return getFileIcon();
};

export const getFileIconType = (fileName: string): string => {
  return getFileType(fileName);
};

export default FileIcon; 