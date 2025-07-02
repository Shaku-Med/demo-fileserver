'use client'
import React from 'react'
import { Button } from '../../../../../../../components/ui/button'
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Download, Fullscreen, Info, RotateCcw as Reset } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../../../../components/ui/tooltip'
import CustomSlider from './CustomSlider'

interface ImageControlsProps {
  zoom: number
  onZoomChange: (value: number) => void
  onRotateLeft: () => void
  onRotateRight: () => void
  onDownload: () => void
  onFullscreen: () => void
  onInfo: () => void
  onReset: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  hasNext: boolean
  hasPrev: boolean
  onNext: () => void
  onPrev: () => void
  imageIndex: number
  totalImages: number
}

const ImageControls: React.FC<ImageControlsProps> = ({
  zoom,
  onZoomChange,
  onRotateLeft,
  onRotateRight,
  onDownload,
  onFullscreen,
  onInfo,
  onReset,
  onZoomIn,
  onZoomOut,
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  imageIndex,
  totalImages
}) => {
  return (
    <TooltipProvider>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRotateLeft}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate Left</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRotateRight}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Rotate Right</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2 w-32">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomOut}
                  className="h-8 w-8 p-0 hover:bg-accent"
                  disabled={zoom <= 0.1}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>

            <CustomSlider
              value={[zoom]}
              onValueChange={(value: number[]) => onZoomChange(value[0])}
              min={0.1}
              max={3}
              step={0.1}
              className="w-16"
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onZoomIn}
                  className="h-8 w-8 p-0 hover:bg-accent"
                  disabled={zoom >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDownload}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFullscreen}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <Fullscreen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fullscreen</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <Reset className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset View</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onInfo}
                  className="h-8 w-8 p-0 hover:bg-accent"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Image Info</TooltipContent>
            </Tooltip>
          </div>

          {totalImages > 1 && (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                disabled={!hasPrev}
                className="h-8 w-8 p-0 hover:bg-accent disabled:opacity-50"
              >
                ←
              </Button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {imageIndex + 1} / {totalImages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                disabled={!hasNext}
                className="h-8 w-8 p-0 hover:bg-accent disabled:opacity-50"
              >
                →
              </Button>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

export default ImageControls 