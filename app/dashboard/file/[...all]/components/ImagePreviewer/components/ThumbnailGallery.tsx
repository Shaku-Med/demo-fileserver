'use client'
import React from 'react'
import { Card } from '../../../../../../../components/ui/card'
import { Button } from '../../../../../../../components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Thumbnail {
  id: string
  src: string
  alt: string
  name: string
}

interface ThumbnailGalleryProps {
  thumbnails: Thumbnail[]
  currentIndex: number
  onThumbnailClick: (index: number) => void
  visible?: boolean
}

const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({
  thumbnails,
  currentIndex,
  onThumbnailClick,
  visible = true
}) => {
  if (!visible || thumbnails.length <= 1) return null

  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      const thumbnailElement = scrollContainerRef.current.children[currentIndex] as HTMLElement
      if (thumbnailElement) {
        thumbnailElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }, [currentIndex])

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2 shadow-lg">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className="h-6 w-6 p-0 hover:bg-accent"
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex gap-2 max-w-64 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {thumbnails.map((thumbnail, index) => (
            <Card
              key={thumbnail.id}
              className={`relative cursor-pointer transition-all duration-200 hover:scale-105 ${
                index === currentIndex
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:ring-1 hover:ring-border'
              }`}
              onClick={() => onThumbnailClick(index)}
            >
              <div className="w-12 h-12 overflow-hidden rounded-md">
                <img
                  src={thumbnail.src}
                  alt={thumbnail.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {index === currentIndex && (
                <div className="absolute inset-0 bg-primary/20 rounded-md flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className="h-6 w-6 p-0 hover:bg-accent"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export default ThumbnailGallery 