import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, X, Pause, Play } from 'lucide-react'
import RecordRTC from 'recordrtc'
import uploadService from '../../services/upload'
import toast from 'react-hot-toast'

const VoiceRecorder = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioUrl, setAudioUrl] = useState(null)
  const recorderRef = useRef(null)
  const streamRef = useRef(null)
  const intervalRef = useRef(null)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  const MAX_DURATION = 120 // 2 minutes

  useEffect(() => {
    return () => {
      stopRecording()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000
      })

      recorder.startRecording()
      recorderRef.current = recorder
      setIsRecording(true)

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)

      // Start visualization
      visualizeAudio(stream)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      toast.error('Could not access microphone')
    }
  }

  const pauseRecording = () => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.pauseRecording()
      setIsPaused(true)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }

  const resumeRecording = () => {
    if (recorderRef.current && isPaused) {
      recorderRef.current.resumeRecording()
      setIsPaused(false)
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current.getBlob()
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
      })
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    setIsRecording(false)
    setIsPaused(false)
  }

  const visualizeAudio = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)
    analyser.fftSize = 256

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const canvas = canvasRef.current
    if (!canvas) return

    const canvasCtx = canvas.getContext('2d')
    const WIDTH = canvas.width
    const HEIGHT = canvas.height

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      canvasCtx.fillStyle = 'rgb(243, 244, 246)'
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

      const barWidth = (WIDTH / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * HEIGHT

        const gradient = canvasCtx.createLinearGradient(0, HEIGHT - barHeight, 0, HEIGHT)
        gradient.addColorStop(0, 'rgb(79, 70, 229)')
        gradient.addColorStop(1, 'rgb(147, 51, 234)')

        canvasCtx.fillStyle = gradient
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()
  }

  const handleSend = async () => {
    if (!audioBlob) return

    try {
      toast.loading('Sending voice message...')

      // Convert blob to file
      const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
        type: 'audio/webm'
      })

      // Upload audio file
      const result = await uploadService.uploadImage(audioFile)

      // Call parent callback with audio URL and duration
      onSend({
        type: 'voice',
        url: result.url,
        duration: duration
      })

      toast.dismiss()
      toast.success('Voice message sent!')
      handleCancel()
    } catch (error) {
      console.error('Error sending voice message:', error)
      toast.dismiss()
      toast.error('Failed to send voice message')
    }
  }

  const handleCancel = () => {
    stopRecording()
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    onCancel()
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {audioBlob ? 'Voice Message' : 'Record Voice Message'}
          </h3>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!audioBlob ? (
          <>
            {/* Recording Interface */}
            <div className="mb-6">
              <canvas
                ref={canvasRef}
                width="400"
                height="100"
                className="w-full h-24 bg-gray-100 rounded-lg mb-4"
              />
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatDuration(duration)}
                </div>
                <div className="text-sm text-gray-500">
                  {duration >= MAX_DURATION ? 'Maximum duration reached' : `Maximum ${MAX_DURATION / 60} minutes`}
                </div>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center space-x-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                >
                  <Mic className="w-8 h-8" />
                </button>
              ) : (
                <>
                  <button
                    onClick={isPaused ? resumeRecording : pauseRecording}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                  </button>
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg animate-pulse"
                  >
                    <MicOff className="w-8 h-8" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Preview Interface */}
            <div className="mb-6">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <audio src={audioUrl} controls className="w-full" />
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  Duration: {formatDuration(duration)}
                </div>
                <div className="text-sm text-gray-500">
                  Review your voice message
                </div>
              </div>
            </div>

            {/* Send Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VoiceRecorder
