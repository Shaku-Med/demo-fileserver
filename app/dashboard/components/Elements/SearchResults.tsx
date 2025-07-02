import React from 'react'
import { useSearch } from './SearchContext'
import { Search, X, FileText, Folder, File, Brain, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchResultsProps {
  totalFiles: number
  filteredFiles: number
}

const SearchResults = ({ totalFiles, filteredFiles }: SearchResultsProps) => {
  const { filters, clearFilters, isSearchActive } = useSearch()

  if (!isSearchActive) return null

  const resultCount = filteredFiles
  const isFiltered = resultCount !== totalFiles

  return (
    <div className="bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-200/50 dark:border-blue-800/50 px-3 py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
          <div className="flex items-center gap-2">
            {filters.useVectorSearch ? (
              <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            )}
            <span className="font-medium text-blue-900 dark:text-blue-100">
              {filters.useVectorSearch ? 'AI Search Results' : 'Search Results'}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-blue-700 dark:text-blue-300">
            <span className="text-xs sm:text-sm">
              {resultCount} of {totalFiles} files
            </span>
            
            {isFiltered && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded">
                {Math.round((resultCount / totalFiles) * 100)}% match
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {filters.searchType !== 'all' && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                Searching in: {filters.searchType}
              </span>
            )}

            {filters.fileType !== 'all' && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded flex items-center gap-1 text-blue-700 dark:text-blue-300">
                {filters.fileType === 'folder' ? (
                  <Folder className="h-3 w-3" />
                ) : (
                  <File className="h-3 w-3" />
                )}
                {filters.fileType}s only
              </span>
            )}

            {filters.caseSensitive && (
              <span className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                Case sensitive
              </span>
            )}

            {filters.useRegex && (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded text-yellow-800 dark:text-yellow-200">
                Regex mode
              </span>
            )}

            {filters.useVectorSearch && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded text-purple-800 dark:text-purple-200 flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI Search ({(filters.similarityThreshold * 100).toFixed(0)}% threshold)
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-6 px-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 self-start sm:self-auto"
        >
          <X className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>

      {resultCount === 0 && (
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          {filters.useVectorSearch 
            ? `No files found with similarity above ${(filters.similarityThreshold * 100).toFixed(0)}% for "${filters.query}"`
            : `No files found matching "${filters.query}"`
          }
        </div>
      )}
    </div>
  )
}

export default SearchResults 