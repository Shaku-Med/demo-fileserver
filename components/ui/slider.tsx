"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  onPointerDown?: () => void
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ 
    className, 
    value = [0], 
    defaultValue = [0],
    min = 0, 
    max = 100, 
    step = 1,
    onValueChange,
    onValueCommit,
    onPointerDown,
    disabled = false,
    ...props 
  }, ref) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [currentValue, setCurrentValue] = React.useState(value[0] ?? defaultValue[0] ?? 0)
    const trackRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (value[0] !== undefined) {
        setCurrentValue(value[0])
      }
    }, [value])

    const getPercentage = (val: number) => {
      return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100))
    }

    const handlePointerDown = (e: React.PointerEvent) => {
      if (disabled) return
      
      setIsDragging(true)
      onPointerDown?.()
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
      e.preventDefault()
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      const newValue = min + (percentage * (max - min))
      const clampedValue = Math.max(min, Math.min(max, newValue))
      const steppedValue = Math.round(clampedValue / step) * step

      setCurrentValue(steppedValue)
      onValueChange?.([steppedValue])
    }

    const handlePointerUp = () => {
      setIsDragging(false)
      onValueCommit?.([currentValue])
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    }

    const handleClick = (e: React.MouseEvent) => {
      if (disabled || !trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percentage = x / rect.width
      const newValue = min + (percentage * (max - min))
      const clampedValue = Math.max(min, Math.min(max, newValue))
      const steppedValue = Math.round(clampedValue / step) * step

      setCurrentValue(steppedValue)
      onValueChange?.([steppedValue])
      onValueCommit?.([steppedValue])
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <div
          ref={trackRef}
          className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary cursor-pointer"
          onClick={handleClick}
          onPointerDown={handlePointerDown}
        >
          <div 
            className="absolute h-full bg-primary rounded-full transition-all duration-150"
            style={{ width: `${getPercentage(currentValue)}%` }}
          />
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              disabled ? "pointer-events-none opacity-50" : "cursor-pointer hover:scale-110",
              isDragging && "scale-110"
            )}
            style={{ 
              left: `${getPercentage(currentValue)}%`,
              transform: 'translateX(-50%) translateY(-50%)'
            }}
            onPointerDown={handlePointerDown}
          />
        </div>
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider } 