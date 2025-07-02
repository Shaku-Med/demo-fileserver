'use client'
import React, { useRef, useEffect, useState } from 'react'
import { cn } from '../../../../../../../lib/utils'

interface CustomSliderProps {
  value: number[]
  onValueChange: (value: number[]) => void
  min: number
  max: number
  step: number
  className?: string
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  onValueChange,
  min,
  max,
  step,
  className
}) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleMouseMove(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const percentage = Math.max(0, Math.min(1, x / width))
    const newValue = min + (max - min) * percentage
    const steppedValue = Math.round(newValue / step) * step
    
    onValueChange([steppedValue])
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  const percentage = ((value[0] - min) / (max - min)) * 100

  return (
    <div
      ref={sliderRef}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      onMouseDown={handleMouseDown}
    >
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background shadow transition-all hover:scale-110 active:scale-95"
        style={{ left: `calc(${percentage}% - 10px)` }}
      />
    </div>
  )
}

export default CustomSlider 