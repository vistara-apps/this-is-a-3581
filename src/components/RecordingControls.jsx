import React, { useState, useRef, useEffect } from 'react'
import { Video, Square, Mic, MicOff, Lock } from 'lucide-react'

const RecordingControls = ({ isRecording, onToggleRecording, userSubscription, onUpgrade }) => {
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaStream, setMediaStream] = useState(null)
  const [recordingType, setRecordingType] = useState('audio') // audio, video
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      setRecordingTime(0)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const constraints = recordingType === 'video' 
        ? { audio: true, video: { facingMode: 'environment' } }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setMediaStream(stream)
      onToggleRecording(true)
    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Unable to access camera/microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      setMediaStream(null)
    }
    onToggleRecording(false)
  }

  const handleRecordingToggle = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const canUseVideo = userSubscription !== 'free'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 z-30">
      <div className="max-w-screen-lg mx-auto">
        {/* Recording Status */}
        {isRecording && (
          <div className="text-center mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="recording-indicator w-3 h-3"></div>
              <span className="text-emergency font-semibold">RECORDING</span>
            </div>
            <div className="text-2xl font-mono font-bold text-text">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {recordingType === 'video' ? 'Video + Audio' : 'Audio Only'}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          {/* Recording Type Selector */}
          {!isRecording && (
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setRecordingType('audio')}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  recordingType === 'audio' 
                    ? 'bg-white text-text shadow-sm' 
                    : 'text-gray-600 hover:text-text'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>Audio</span>
              </button>
              
              <button
                onClick={() => canUseVideo ? setRecordingType('video') : onUpgrade()}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  recordingType === 'video' 
                    ? 'bg-white text-text shadow-sm' 
                    : 'text-gray-600 hover:text-text'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
                {!canUseVideo && (
                  <Lock className="w-3 h-3 text-warning" />
                )}
              </button>
            </div>
          )}

          {/* Main Record Button */}
          <button
            onClick={handleRecordingToggle}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
              isRecording 
                ? 'bg-emergency hover:bg-red-600' 
                : 'bg-emergency hover:bg-red-600'
            }`}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white" />
            ) : recordingType === 'video' ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Mute Toggle (when recording) */}
          {isRecording && (
            <button
              className="w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center transition-colors"
            >
              <MicOff className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Instructions */}
        {!isRecording && (
          <div className="text-center mt-3">
            <p className="text-sm text-gray-600">
              Tap to start recording. Keep your phone visible and in a safe position.
            </p>
            {userSubscription === 'free' && (
              <p className="text-xs text-warning mt-1">
                Upgrade for video recording and cloud backup
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RecordingControls