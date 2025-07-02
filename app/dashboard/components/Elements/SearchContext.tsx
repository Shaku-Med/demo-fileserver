'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { FileItem } from './FileItem'

export type SearchType = 'all' | 'name' | 'title' | 'artists' | 'album' | 'type' | 'content'
export type FileType = 'all' | 'file' | 'folder'
export type SortOrder = 'relevance' | 'name' | 'type' | 'date'

export interface SearchFilters {
  query: string
  searchType: SearchType
  fileType: FileType
  sortOrder: SortOrder
  caseSensitive: boolean
  useRegex: boolean
  useVectorSearch: boolean
  similarityThreshold: number
}

interface SearchContextType {
  filters: SearchFilters
  setQuery: (query: string) => void
  setSearchType: (type: SearchType) => void
  setFileType: (type: FileType) => void
  setSortOrder: (order: SortOrder) => void
  setCaseSensitive: (sensitive: boolean) => void
  setUseRegex: (useRegex: boolean) => void
  setUseVectorSearch: (useVector: boolean) => void
  setSimilarityThreshold: (threshold: number) => void
  clearFilters: () => void
  searchFiles: (files: FileItem[]) => FileItem[]
  isSearchActive: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

// Simple text embedding function (in production, use a proper embedding service)
const getTextEmbedding = (text: string): number[] => {
  // Simple hash-based embedding for demo purposes
  const hash = text.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff
  }, 0)
  
  // Generate a simple 8-dimensional vector
  const vector = []
  for (let i = 0; i < 8; i++) {
    vector.push(Math.sin(hash + i) * 0.5 + 0.5)
  }
  return vector
}

// Calculate cosine similarity between two vectors
const cosineSimilarity = (a: number[], b: number[]): number => {
  if (a.length !== b.length) return 0
  
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Vector search function
const performVectorSearch = (files: FileItem[], query: string, threshold: number): FileItem[] => {
  if (!query.trim()) return files
  
  const queryEmbedding = getTextEmbedding(query.toLowerCase())
  
  return files
    .map(file => {
      // Create a combined text representation of the file
      const fileText = [
        file.name,
        file.title,
        file.artists,
        file.album,
        file.type,
        file.content || ''
      ].filter(Boolean).join(' ').toLowerCase()
      
      const fileEmbedding = getTextEmbedding(fileText)
      const similarity = cosineSimilarity(queryEmbedding, fileEmbedding)
      
      return { ...file, similarity }
    })
    .filter(file => file.similarity >= threshold)
    .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
}

// Traditional text search function
const performTextSearch = (files: FileItem[], filters: SearchFilters): FileItem[] => {
  const { query, searchType, fileType, caseSensitive, useRegex } = filters
  
  if (!query.trim()) return files
  
  let searchPattern: RegExp | string
  if (useRegex) {
    try {
      searchPattern = new RegExp(query, caseSensitive ? 'g' : 'gi')
    } catch {
      // Fallback to simple search if regex is invalid
      searchPattern = caseSensitive ? query : query.toLowerCase()
    }
  } else {
    searchPattern = caseSensitive ? query : query.toLowerCase()
  }
  
  return files.filter(file => {
    // Filter by file type first
    if (fileType !== 'all' && file.type !== fileType) {
      return false
    }
    
    // Search in specified fields
    const searchFields = []
    
    switch (searchType) {
      case 'all':
        searchFields.push(file.name, file.title, file.artists, file.album, file.type, file.content || '')
        break
      case 'name':
        searchFields.push(file.name)
        break
      case 'title':
        searchFields.push(file.title)
        break
      case 'artists':
        searchFields.push(file.artists)
        break
      case 'album':
        searchFields.push(file.album)
        break
      case 'type':
        searchFields.push(file.type)
        break
      case 'content':
        searchFields.push(file.content || '')
        break
    }
    
    return searchFields.some(field => {
      const fieldText = caseSensitive ? field : field.toLowerCase()
      
      if (useRegex && searchPattern instanceof RegExp) {
        return searchPattern.test(fieldText)
      } else {
        return fieldText.includes(searchPattern as string)
      }
    })
  })
}

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    searchType: 'all',
    fileType: 'all',
    sortOrder: 'relevance',
    caseSensitive: false,
    useRegex: false,
    useVectorSearch: false,
    similarityThreshold: 0.3
  })

  const setQuery = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, query }))
  }, [])

  const setSearchType = useCallback((searchType: SearchType) => {
    setFilters(prev => ({ ...prev, searchType }))
  }, [])

  const setFileType = useCallback((fileType: FileType) => {
    setFilters(prev => ({ ...prev, fileType }))
  }, [])

  const setSortOrder = useCallback((sortOrder: SortOrder) => {
    setFilters(prev => ({ ...prev, sortOrder }))
  }, [])

  const setCaseSensitive = useCallback((caseSensitive: boolean) => {
    setFilters(prev => ({ ...prev, caseSensitive }))
  }, [])

  const setUseRegex = useCallback((useRegex: boolean) => {
    setFilters(prev => ({ ...prev, useRegex }))
  }, [])

  const setUseVectorSearch = useCallback((useVectorSearch: boolean) => {
    setFilters(prev => ({ ...prev, useVectorSearch }))
  }, [])

  const setSimilarityThreshold = useCallback((similarityThreshold: number) => {
    setFilters(prev => ({ ...prev, similarityThreshold }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      query: '',
      searchType: 'all',
      fileType: 'all',
      sortOrder: 'relevance',
      caseSensitive: false,
      useRegex: false,
      useVectorSearch: false,
      similarityThreshold: 0.3
    })
  }, [])

  const searchFiles = useCallback((files: FileItem[]): FileItem[] => {
    let results = files

    // Perform vector search if enabled
    if (filters.useVectorSearch && filters.query.trim()) {
      results = performVectorSearch(files, filters.query, filters.similarityThreshold)
    } else if (filters.query.trim()) {
      // Perform traditional text search
      results = performTextSearch(files, filters)
    }

    // Apply sorting
    if (filters.sortOrder !== 'relevance' || !filters.useVectorSearch) {
      results.sort((a, b) => {
        let comparison = 0
        
        switch (filters.sortOrder) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'type':
            comparison = a.type.localeCompare(b.type)
            break
          case 'date':
            comparison = 0 // Would compare dates if available
            break
          case 'relevance':
            // For vector search, sort by similarity
            if (filters.useVectorSearch) {
              comparison = (b.similarity || 0) - (a.similarity || 0)
            } else {
              comparison = 0
            }
            break
        }
        
        return comparison
      })
    }

    return results
  }, [filters])

  const isSearchActive = useMemo(() => {
    return filters.query.trim().length > 0 || 
           filters.searchType !== 'all' || 
           filters.fileType !== 'all' ||
           filters.caseSensitive ||
           filters.useRegex ||
           filters.useVectorSearch
  }, [filters])

  const value: SearchContextType = {
    filters,
    setQuery,
    setSearchType,
    setFileType,
    setSortOrder,
    setCaseSensitive,
    setUseRegex,
    setUseVectorSearch,
    setSimilarityThreshold,
    clearFilters,
    searchFiles,
    isSearchActive
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
} 