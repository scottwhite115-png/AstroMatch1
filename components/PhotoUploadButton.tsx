/**
 * Photo Upload Button Component
 * Reusable component for uploading profile photos
 */

'use client'

import { useState, useRef } from 'react'
import { uploadProfilePhoto } from '@/lib/supabase/photoUpload'

interface PhotoUploadButtonProps {
  userId: string
  photoIndex: number
  currentPhotoUrl?: string
  onUploadSuccess: (url: string, index: number) => void
  onUploadError?: (error: string) => void
  className?: string
}

export function PhotoUploadButton({
  userId,
  photoIndex,
  currentPhotoUrl,
  onUploadSuccess,
  onUploadError,
  className = ''
}: PhotoUploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    try {
      // Simulate progress (since Supabase doesn't provide real-time progress)
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const result = await uploadProfilePhoto(file, userId, photoIndex)

      clearInterval(progressInterval)
      setProgress(100)

      if (result.success && result.url) {
        onUploadSuccess(result.url, photoIndex)
        setTimeout(() => {
          setUploading(false)
          setProgress(0)
        }, 500)
      } else {
        setUploading(false)
        setProgress(0)
        onUploadError?.(result.error || 'Upload failed')
      }
    } catch (error) {
      setUploading(false)
      setProgress(0)
      onUploadError?.('Unexpected error during upload')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className={`relative ${className}`}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm">Uploading... {progress}%</span>
          </div>
        ) : currentPhotoUrl ? (
          <span>Change Photo</span>
        ) : (
          <span>+ Add Photo</span>
        )}
      </button>
    </>
  )
}

