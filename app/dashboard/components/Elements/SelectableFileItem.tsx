import React, { useState, useRef, useCallback } from 'react'
import { FileItem } from './FileItem'
import { useSelection } from './SelectionContext'
import { Check } from 'lucide-react'

interface SelectableFileItemProps {
  file: FileItem
  children: React.ReactNode
  onDoubleClick?: (file: FileItem) => void
  onEdit?: (file: FileItem) => void
}

const SelectableFileItem = ({ 
  file, 
  children, 
  onDoubleClick,
  onEdit 
}: SelectableFileItemProps) => {
  const { selectedFiles, toggleFileSelection, isSelectMode } = useSelection()
  const [lastTap, setLastTap] = useState(0)
  const tapTimeoutRef = useRef<number | undefined>(undefined)

  const isSelected = selectedFiles.has(file.name)

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSelectMode) {
      toggleFileSelection(file.name)
    } else {
      const currentTime = new Date().getTime()
      const tapLength = currentTime - lastTap

      if (tapLength < 500 && tapLength > 0) {
        if (onDoubleClick) {
          onDoubleClick(file)
        }
        if (onEdit) {
          onEdit(file)
        }
        setLastTap(0)
      } else {
        setLastTap(currentTime)
      }
    }
  }, [isSelectMode, toggleFileSelection, file.name, lastTap, onDoubleClick, onEdit, file])

  const handleLongPress = useCallback(() => {
    if (!isSelectMode) {
      toggleFileSelection(file.name)
    }
  }, [isSelectMode, toggleFileSelection, file.name])

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary ring-offset-2 bg-primary/10' 
          : 'hover:bg-accent/80'
      }`}
      onClick={handleClick}
      onTouchStart={() => {
        tapTimeoutRef.current = window.setTimeout(handleLongPress, 500)
      }}
      onTouchEnd={() => {
        if (tapTimeoutRef.current) {
          clearTimeout(tapTimeoutRef.current)
        }
      }}
    >
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="h-3 w-3" />
        </div>
      )}
      
      {children}
    </div>
  )
}

export default SelectableFileItem 