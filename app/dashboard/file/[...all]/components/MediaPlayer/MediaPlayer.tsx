'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { VideoPlayer } from './components'

interface MediaPlayerProps {
  url: string
  data?: any
  className?: string
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ url, data, className }) => {
  return (
    <VideoPlayer
      url={url}
      data={data}
      className={className}
    />
  )
}

export default MediaPlayer
