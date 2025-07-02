'use client'
import React, { useEffect } from 'react'
import AdvancedSearchBar from '../Elements/AdvancedSearchBar'
import AddNewButton from '../Elements/AddNewButton'
import LayoutSwitcher from '../Elements/LayoutSwitcher'
import ViewOptions from '../Elements/ViewOptions'
import MoreButton from '../MoreButton'
import { useDashboardContext } from '../../context/Context'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Breadcrumb {
  name: string
  path: string
  isLast: boolean
}

const Nav = () => {
  const {
    openCreateDialog,
    openUploadDialog,
    currentLayout,
    setCurrentLayout,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    iconSize,
    setIconSize
  } = useDashboardContext()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const generateBreadcrumbs = (): Breadcrumb[] => {
    const segments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs: Breadcrumb[] = []
    
    let currentPath = ''
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      
      const displayName = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      // Preserve search parameters for non-last breadcrumbs
      const pathWithSearch = isLast ? currentPath : `${currentPath}?${searchParams.toString()}`
      
      breadcrumbs.push({
        name: displayName,
        path: pathWithSearch,
        isLast
      })
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {

  //     if(e.ctrlKey && e.key.toLowerCase() === 'a') {
  //       e.stopPropagation()
  //       e.preventDefault()
  //       openCreateDialog('folder')
  //     }
  //   }

  //   window.addEventListener('keydown', handleKeyDown)
    
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown)
  //   }
  // }, [openCreateDialog])

  return (
    <div className="flex-1 flex flex-col w-full justify-between max-h-fit min-h-fit sticky top-0 z-[10000001] overflow-auto overflow-y-auto">
        <div className="bg-card/80 sticky top-[0px] z-[10000001] backdrop-blur-lg border-b border-border px-3 py-2">
            <div className="flex flex-col gap-3">
            {/* <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm min-w-0 overflow-hidden">
                  {breadcrumbs.length === 0 ? (
                    <span className="text-sm md:text-base line-clamp-1">Dashboard</span>
                  ) : (
                    <>
                      <Link 
                        href={`/dashboard?${searchParams.toString()}`}
                        className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline line-clamp-1"
                      >
                        Dashboard
                      </Link>
                      {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={breadcrumb.path}>
                          <span className="text-muted-foreground hidden sm:inline">/</span>
                          {breadcrumb.isLast ? (
                            <span className="text-sm md:text-base line-clamp-1 font-medium">
                              {breadcrumb.name}
                            </span>
                          ) : (
                            <Link
                              href={breadcrumb.path}
                              className="text-muted-foreground hover:text-foreground transition-colors line-clamp-1 max-w-[120px] sm:max-w-[150px] md:max-w-[200px]"
                            >
                              {breadcrumb.name}
                            </Link>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                </div>
            </div> */}
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-1">
                <div className="w-full md:w-auto md:flex-1">
                <AdvancedSearchBar />
                </div>
                
                <div className="flex items-center gap-1 w-full md:w-auto justify-end">
                <AddNewButton
                    onAddFolder={() => openCreateDialog('folder')}
                    onAddFile={() => openCreateDialog('file')}
                    onAddDocument={() => openCreateDialog('document')}
                    onAddImage={() => openCreateDialog('image')}
                    onAddMusic={() => openCreateDialog('music')}
                    onAddVideo={() => openCreateDialog('video')}
                    onAddArchive={() => openCreateDialog('archive')}
                    onUploadFiles={openUploadDialog}
                />
                <LayoutSwitcher 
                    currentLayout={currentLayout}
                    onLayoutChange={setCurrentLayout}
                />
                <ViewOptions
                    onSortChange={setSortBy}
                    onOrderChange={setSortOrder}
                    onSizeChange={setIconSize}
                    currentSort={sortBy}
                    currentOrder={sortOrder}
                    currentSize={iconSize}
                />
                <MoreButton />
                </div>
            </div>
        </div>
  </div>
    </div>
  )
}

export default Nav
