import CryptoJS from 'crypto-js'
import { supabase } from '../lib/supabase'
import { AuthService } from './authService'

export class RecordingService {
  static mediaRecorder = null
  static recordedChunks = []
  static stream = null

  // Start recording with specified options
  static async startRecording(options = {}) {
    try {
      const {
        video = false,
        audio = true,
        facingMode = 'environment'
      } = options

      // Request media permissions
      const constraints = {
        audio: audio,
        ...(video && {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        })
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Initialize MediaRecorder
      const mimeType = this.getSupportedMimeType()
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: mimeType
      })

      this.recordedChunks = []

      // Handle data available
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }

      // Start recording
      this.mediaRecorder.start(1000) // Collect data every second

      return {
        success: true,
        mediaRecorder: this.mediaRecorder,
        stream: this.stream
      }
    } catch (error) {
      console.error('Start recording error:', error)
      throw new Error(`Failed to start recording: ${error.message}`)
    }
  }

  // Stop recording and return blob
  static async stopRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording found'))
        return
      }

      this.mediaRecorder.onstop = () => {
        try {
          const mimeType = this.getSupportedMimeType()
          const blob = new Blob(this.recordedChunks, { type: mimeType })
          
          // Stop all tracks
          if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop())
          }

          resolve({
            blob,
            mimeType,
            duration: this.calculateDuration(),
            size: blob.size
          })
        } catch (error) {
          reject(error)
        }
      }

      this.mediaRecorder.stop()
    })
  }

  // Save recording to cloud storage
  static async saveRecording(recordingData, metadata = {}) {
    try {
      const user = await AuthService.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      const { blob, mimeType, duration } = recordingData
      
      // Encrypt the recording if user has premium features
      const userProfile = await AuthService.getUserProfile(user.id)
      const shouldEncrypt = userProfile?.subscription_tier !== 'free'
      
      let processedBlob = blob
      let encryptionKey = null

      if (shouldEncrypt) {
        const { encryptedBlob, key } = await this.encryptBlob(blob)
        processedBlob = encryptedBlob
        encryptionKey = key
      }

      // Upload to Pinata IPFS (or fallback to Supabase storage)
      const filePath = await this.uploadToStorage(processedBlob, {
        userId: user.id,
        mimeType,
        encrypted: shouldEncrypt,
        ...metadata
      })

      // Save recording metadata to database
      const recordingRecord = await this.saveRecordingMetadata({
        user_id: user.id,
        file_path: filePath,
        duration: duration,
        metadata: {
          mimeType,
          size: blob.size,
          encrypted: shouldEncrypt,
          encryptionKey: shouldEncrypt ? encryptionKey : null,
          ...metadata
        }
      })

      return {
        success: true,
        recordingId: recordingRecord.id,
        filePath,
        encrypted: shouldEncrypt
      }
    } catch (error) {
      console.error('Save recording error:', error)
      throw error
    }
  }

  // Upload to cloud storage (Pinata IPFS or Supabase)
  static async uploadToStorage(blob, metadata) {
    try {
      // Try Pinata IPFS first for premium users
      if (metadata.encrypted) {
        return await this.uploadToPinata(blob, metadata)
      }

      // Fallback to Supabase storage for free users
      return await this.uploadToSupabase(blob, metadata)
    } catch (error) {
      console.error('Upload to storage error:', error)
      // Fallback to Supabase if Pinata fails
      return await this.uploadToSupabase(blob, metadata)
    }
  }

  // Upload to Pinata IPFS
  static async uploadToPinata(blob, metadata) {
    try {
      const formData = new FormData()
      const fileName = `recording_${Date.now()}_${metadata.userId}.${this.getFileExtension(metadata.mimeType)}`
      
      formData.append('file', blob, fileName)
      formData.append('pinataMetadata', JSON.stringify({
        name: fileName,
        keyvalues: {
          userId: metadata.userId,
          encrypted: metadata.encrypted.toString(),
          timestamp: new Date().toISOString()
        }
      }))

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload to Pinata')
      }

      const data = await response.json()
      return `ipfs://${data.IpfsHash}`
    } catch (error) {
      console.error('Upload to Pinata error:', error)
      throw error
    }
  }

  // Upload to Supabase storage
  static async uploadToSupabase(blob, metadata) {
    try {
      const fileName = `recordings/${metadata.userId}/${Date.now()}.${this.getFileExtension(metadata.mimeType)}`
      
      const { data, error } = await supabase.storage
        .from('recordings')
        .upload(fileName, blob, {
          contentType: metadata.mimeType,
          metadata: {
            userId: metadata.userId,
            encrypted: metadata.encrypted.toString()
          }
        })

      if (error) throw error

      return data.path
    } catch (error) {
      console.error('Upload to Supabase error:', error)
      throw error
    }
  }

  // Save recording metadata to database
  static async saveRecordingMetadata(recordingData) {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .insert([recordingData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Save recording metadata error:', error)
      throw error
    }
  }

  // Encrypt blob for secure storage
  static async encryptBlob(blob) {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer)
      
      // Generate encryption key
      const key = CryptoJS.lib.WordArray.random(256/8).toString()
      
      // Encrypt the data
      const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString()
      
      // Convert back to blob
      const encryptedBlob = new Blob([encrypted], { type: 'application/octet-stream' })
      
      return {
        encryptedBlob,
        key
      }
    } catch (error) {
      console.error('Encrypt blob error:', error)
      throw error
    }
  }

  // Decrypt blob for playback
  static async decryptBlob(encryptedBlob, key) {
    try {
      const encryptedText = await encryptedBlob.text()
      const decrypted = CryptoJS.AES.decrypt(encryptedText, key)
      
      // Convert back to array buffer
      const arrayBuffer = this.wordArrayToArrayBuffer(decrypted)
      
      return new Blob([arrayBuffer])
    } catch (error) {
      console.error('Decrypt blob error:', error)
      throw error
    }
  }

  // Get user's recordings
  static async getUserRecordings(userId, limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get user recordings error:', error)
      throw error
    }
  }

  // Delete recording
  static async deleteRecording(recordingId, userId) {
    try {
      // Get recording metadata
      const { data: recording, error: fetchError } = await supabase
        .from('recordings')
        .select('*')
        .eq('id', recordingId)
        .eq('user_id', userId)
        .single()

      if (fetchError) throw fetchError

      // Delete from storage
      if (recording.file_path.startsWith('ipfs://')) {
        // Note: IPFS files are immutable, but we can unpin them
        await this.unpinFromPinata(recording.file_path.replace('ipfs://', ''))
      } else {
        // Delete from Supabase storage
        await supabase.storage
          .from('recordings')
          .remove([recording.file_path])
      }

      // Delete from database
      const { error: deleteError } = await supabase
        .from('recordings')
        .delete()
        .eq('id', recordingId)
        .eq('user_id', userId)

      if (deleteError) throw deleteError

      return { success: true }
    } catch (error) {
      console.error('Delete recording error:', error)
      throw error
    }
  }

  // Helper methods
  static getSupportedMimeType() {
    const types = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4',
      'audio/webm',
      'audio/mp4',
      'audio/mpeg'
    ]

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type
      }
    }

    return 'video/webm' // fallback
  }

  static getFileExtension(mimeType) {
    const extensions = {
      'video/webm': 'webm',
      'video/mp4': 'mp4',
      'audio/webm': 'webm',
      'audio/mp4': 'm4a',
      'audio/mpeg': 'mp3'
    }

    return extensions[mimeType] || 'webm'
  }

  static calculateDuration() {
    // This would be calculated based on recording time
    // For now, return a placeholder
    return Math.floor(Date.now() / 1000)
  }

  static wordArrayToArrayBuffer(wordArray) {
    const arrayOfWords = wordArray.hasOwnProperty('words') ? wordArray.words : []
    const length = wordArray.hasOwnProperty('sigBytes') ? wordArray.sigBytes : arrayOfWords.length * 4
    const uInt8Array = new Uint8Array(length)
    let index = 0

    for (let i = 0; i < length; i++) {
      const word = arrayOfWords[i]
      uInt8Array[index++] = word >> 24
      uInt8Array[index++] = (word >> 16) & 0xff
      uInt8Array[index++] = (word >> 8) & 0xff
      uInt8Array[index++] = word & 0xff
    }

    return uInt8Array.buffer
  }

  static async unpinFromPinata(hash) {
    try {
      const response = await fetch(`https://api.pinata.cloud/pinning/unpin/${hash}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
        }
      })

      if (!response.ok) {
        console.warn('Failed to unpin from Pinata:', hash)
      }
    } catch (error) {
      console.warn('Unpin from Pinata error:', error)
    }
  }
}
