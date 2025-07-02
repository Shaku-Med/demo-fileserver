'use client'
import React, { useState, useCallback, useRef } from 'react'
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { Card } from '../../../../../../../components/ui/card'

interface ImageViewerProps {
  src: string
  alt: string
  zoom?: number
  rotation?: number
  onZoomChange?: (zoom: number) => void
  onRotationChange?: (rotation: number) => void
  isProgrammaticZoom?: boolean
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void
  transformRef?: React.RefObject<ReactZoomPanPinchRef | null>
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt,
  zoom,
  rotation,
  onZoomChange,
  onRotationChange,
  isProgrammaticZoom,
  onLoad,
  onError,
  transformRef
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    setImageLoaded(true)
    onLoad?.(e)
  }, [onLoad])

  return (
    <Card className="relative rounded-none border-none bg-[transparent] w-full h-full overflow-hidden bg-muted/20 border-0">
      <TransformWrapper
        ref={transformRef}
        key={`${src}-${rotation || 0}`}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          contentClass="w-full h-full flex items-center justify-center"
          contentStyle={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          wrapperStyle={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0'
          }}
        >
                  <div
          className="relative transition-transform duration-200 ease-out"
          style={{
            transform: `rotate(${rotation || 0}deg)`,
            transformOrigin: 'center'
          }}
        >
            <img
              src={src}
              alt={alt}
              className={`max-w-none transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                maxHeight: '80vh',
                maxWidth: '80vw'
              }}
              onLoad={handleImageLoad}
              onError={onError}
              draggable={false}
            />
            
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>


    </Card>
  )
}

export default ImageViewer 