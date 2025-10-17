import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Download } from 'lucide-react'

const VoiceMessagePlayer = ({ audioUrl, duration, sender, timestamp }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSpeedChange = () => {
    const speeds = [1, 1.5, 2]
    const currentIndex = speeds.indexOf(playbackSpeed)
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length]
    setPlaybackSpeed(nextSpeed)
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed
    }
  }

  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `voice-message-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg max-w-xs">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayback}
        className="flex-shrink-0 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center transition-colors"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </button>

      {/* Waveform and Progress */}
      <div className="flex-1 min-w-0">
        <div className="relative h-8 flex items-center mb-1">
          {/* Progress Bar */}
          <div className="w-full h-1 bg-primary-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-primary-700 font-medium">
            {isPlaying ? formatTime(currentTime) : formatTime(duration)}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSpeedChange}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              {playbackSpeed}x
            </button>
            <button
              onClick={handleDownload}
              className="text-primary-600 hover:text-primary-700"
            >
              <Download className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceMessagePlayer
