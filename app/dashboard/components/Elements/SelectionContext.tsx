'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { FileItem } from './FileItem'

interface SelectionContextType {
  selectedFiles: Set<string>
  isSelectMode: boolean
  selectFile: (fileName: string) => void
  deselectFile: (fileName: string) => void
  toggleFileSelection: (fileName: string) => void
  selectAll: () => void
  deselectAll: () => void
  enterSelectMode: () => void
  exitSelectMode: () => void
  getSelectedFiles: (files: FileItem[]) => FileItem[]
  selectedCount: number
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined)

export const useSelection = () => {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider')
  }
  return context
}

interface SelectionProviderProps {
  children: React.ReactNode
}

export const SelectionProvider = ({ children }: SelectionProviderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [isSelectMode, setIsSelectMode] = useState(false)

  const selectFile = useCallback((fileName: string) => {
    setSelectedFiles(prev => new Set([...prev, fileName]))
    if (!isSelectMode) setIsSelectMode(true)
  }, [isSelectMode])

  const deselectFile = useCallback((fileName: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      newSet.delete(fileName)
      return newSet
    })
  }, [])

  const toggleFileSelection = useCallback((fileName: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(fileName)) {
        newSet.delete(fileName)
      } else {
        newSet.add(fileName)
      }
      return newSet
    })
    if (!isSelectMode) setIsSelectMode(true)
  }, [isSelectMode])

  const selectAll = useCallback((files: FileItem[]) => {
    setSelectedFiles(new Set(files.map(file => file.name)))
    setIsSelectMode(true)
  }, [])

  const deselectAll = useCallback(() => {
    setSelectedFiles(new Set())
    setIsSelectMode(false)
  }, [])

  const enterSelectMode = useCallback(() => {
    setIsSelectMode(true)
  }, [])

  const exitSelectMode = useCallback(() => {
    setIsSelectMode(false)
    setSelectedFiles(new Set())
  }, [])

  const getSelectedFiles = useCallback((files: FileItem[]) => {
    return files.filter(file => selectedFiles.has(file.name))
  }, [selectedFiles])

  const value: SelectionContextType = {
    selectedFiles,
    isSelectMode,
    selectFile,
    deselectFile,
    toggleFileSelection,
    selectAll: () => selectAll([]),
    deselectAll,
    enterSelectMode,
    exitSelectMode,
    getSelectedFiles,
    selectedCount: selectedFiles.size
  }

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  )
} 