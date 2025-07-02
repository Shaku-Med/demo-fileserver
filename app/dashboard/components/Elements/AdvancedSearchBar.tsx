import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  X, 
  Filter, 
  Settings, 
  FileText, 
  Folder, 
  File,
  SortAsc,
  SortDesc,
  Zap,
  ChevronDown,
  Brain,
  Sparkles
} from 'lucide-react'
import { useSearch, SearchType, FileType, SortOrder } from './SearchContext'

const AdvancedSearchBar = () => {
  const { 
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
    isSearchActive 
  } = useSearch()

  const [isExpanded, setIsExpanded] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchActive && !isExpanded) {
      setIsExpanded(true)
    }
  }, [isSearchActive])

  const handleClear = () => {
    clearFilters()
    setIsExpanded(false)
    setShowFilters(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (filters.query) {
        handleClear()
      } else {
        setIsExpanded(false)
        setShowFilters(false)
      }
    }
  }

  const getSearchTypeIcon = (type: SearchType) => {
    switch (type) {
      case 'name': return <File className="h-3 w-3" />
      case 'title': return <FileText className="h-3 w-3" />
      case 'artists': return <FileText className="h-3 w-3" />
      case 'album': return <FileText className="h-3 w-3" />
      case 'type': return <Filter className="h-3 w-3" />
      case 'content': return <FileText className="h-3 w-3" />
      default: return <Search className="h-3 w-3" />
    }
  }

  const getFileTypeIcon = (type: FileType) => {
    switch (type) {
      case 'folder': return <Folder className="h-3 w-3" />
      case 'file': return <File className="h-3 w-3" />
      default: return <FileText className="h-3 w-3" />
    }
  }

  const getSortIcon = (order: SortOrder) => {
    switch (order) {
      case 'name':
      case 'type':
      case 'date':
        return <SortAsc className="h-3 w-3" />
      case 'relevance':
        return <Zap className="h-3 w-3" />
      default:
        return <SortAsc className="h-3 w-3" />
    }
  }

  const handleSimilarityChange = (value: number[]) => {
    setSimilarityThreshold(value[0])
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex flex-col gap-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={isExpanded ? "Search files..." : "Search..."}
            value={filters.query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            className="pl-8 pr-8 w-full transition-all duration-200"
          />
          {filters.query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  {getSearchTypeIcon(filters.searchType)}
                  <span className="ml-1 hidden xs:inline">
                    {filters.searchType === 'all' ? 'All' : filters.searchType}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-[100000000000000001]">
                <DropdownMenuItem onClick={() => setSearchType('all')}>
                  <Search className="h-4 w-4 mr-2" />
                  All Fields
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSearchType('name')}>
                  <File className="h-4 w-4 mr-2" />
                  File Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType('title')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Title
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType('artists')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Artists
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType('album')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Album
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType('type')}>
                  <Filter className="h-4 w-4 mr-2" />
                  File Type
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType('content')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Content
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  {getFileTypeIcon(filters.fileType)}
                  <span className="ml-1 hidden xs:inline">
                    {filters.fileType === 'all' ? 'All' : filters.fileType}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-[100000000000000001]">
                <DropdownMenuItem onClick={() => setFileType('all')}>
                  <FileText className="h-4 w-4 mr-2" />
                  All Types
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFileType('file')}>
                  <File className="h-4 w-4 mr-2" />
                  Files Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFileType('folder')}>
                  <Folder className="h-4 w-4 mr-2" />
                  Folders Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                  {getSortIcon(filters.sortOrder)}
                  <span className="ml-1 hidden xs:inline">
                    {filters.sortOrder === 'relevance' ? 'Relevance' : filters.sortOrder}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-[100000000000000001]">
                <DropdownMenuItem onClick={() => setSortOrder('relevance')}>
                  <Zap className="h-4 w-4 mr-2" />
                  Relevance
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortOrder('name')}>
                  <SortAsc className="h-4 w-4 mr-2" />
                  Name
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('type')}>
                  <SortAsc className="h-4 w-4 mr-2" />
                  Type
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('date')}>
                  <SortAsc className="h-4 w-4 mr-2" />
                  Date
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={filters.useVectorSearch ? "default" : "outline"} 
                  size="sm" 
                  className="h-7 px-2 text-xs"
                >
                  {filters.useVectorSearch ? <Brain className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                  <span className="ml-1 hidden xs:inline">
                    {filters.useVectorSearch ? 'AI' : 'Smart'}
                  </span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 z-[100000000000000001]">
                <DropdownMenuLabel>Search Mode</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setUseVectorSearch(false)}>
                  <Search className="h-4 w-4 mr-2" />
                  Text Search
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUseVectorSearch(true)}>
                  <Brain className="h-4 w-4 mr-2" />
                  AI Vector Search
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {filters.useVectorSearch && (
                  <>
                    <DropdownMenuLabel>Similarity Threshold</DropdownMenuLabel>
                    <div className="px-2 py-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={filters.similarityThreshold}
                          onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground min-w-[3rem]">
                          {(filters.similarityThreshold * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-[100000000000000001]">
                <DropdownMenuCheckboxItem
                  checked={filters.caseSensitive}
                  onCheckedChange={setCaseSensitive}
                >
                  Case Sensitive
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filters.useRegex}
                  onCheckedChange={setUseRegex}
                >
                  Use Regex
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {filters.useRegex && filters.query && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-xs text-yellow-800 dark:text-yellow-200">
          <strong>Regex Mode:</strong> Using regular expression pattern matching
        </div>
      )}

      {filters.useVectorSearch && filters.query && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md text-xs text-blue-800 dark:text-blue-200">
          <strong>AI Search:</strong> Using semantic vector search with {(filters.similarityThreshold * 100).toFixed(0)}% similarity threshold
        </div>
      )}
    </div>
  )
}

export default AdvancedSearchBar 