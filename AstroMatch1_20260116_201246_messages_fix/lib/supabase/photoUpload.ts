/**
 * Photo Upload to Supabase Storage
 * Handles profile photo uploads with compression and validation
 */

import { createClient } from './client'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload a profile photo to Supabase Storage
 * @param file - The image file to upload
 * @param userId - The user's ID (for folder organization)
 * @param photoIndex - Index of the photo (0-5)
 * @returns Upload result with public URL or error
 */
export async function uploadProfilePhoto(
  file: File,
  userId: string,
  photoIndex: number
): Promise<UploadResult> {
  try {
    const supabase = createClient()

    // Validate file
    const validation = validatePhotoFile(file)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Compress/resize image if needed
    const processedFile = await processImage(file)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${userId}/photo_${photoIndex}_${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, processedFile, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      })

    if (error) {
      console.error('[Photo Upload] Error uploading:', error)
      return {
        success: false,
        error: error.message || 'Failed to upload photo'
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName)

    return {
      success: true,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('[Photo Upload] Unexpected error:', error)
    return {
      success: false,
      error: 'Unexpected error uploading photo'
    }
  }
}

/**
 * Delete a profile photo from Supabase Storage
 */
export async function deleteProfilePhoto(photoUrl: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Extract file path from URL
    const urlParts = photoUrl.split('/profile-photos/')
    if (urlParts.length < 2) {
      console.error('[Photo Delete] Invalid photo URL:', photoUrl)
      return false
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('profile-photos')
      .remove([filePath])

    if (error) {
      console.error('[Photo Delete] Error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Photo Delete] Unexpected error:', error)
    return false
  }
}

/**
 * Validate photo file before upload
 */
function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.'
    }
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Maximum size is 5MB.'
    }
  }

  return { valid: true }
}

/**
 * Process/compress image before upload
 * Resizes to max 1200px width/height while maintaining aspect ratio
 */
async function processImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Resize if larger than 1200px
        const maxDimension = 1200
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension
            width = maxDimension
          } else {
            width = (width / height) * maxDimension
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file) // Can't process, return original
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file) // Can't process, return original
              return
            }

            const processedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })

            resolve(processedFile)
          },
          file.type,
          0.9 // Quality 90%
        )
      }

      img.onerror = () => {
        resolve(file) // Can't process, return original
      }
    }

    reader.onerror = () => {
      resolve(file) // Can't process, return original
    }
  })
}

/**
 * Upload multiple photos at once
 */
export async function uploadMultiplePhotos(
  files: File[],
  userId: string,
  startIndex: number = 0
): Promise<UploadResult[]> {
  const results: UploadResult[] = []

  for (let i = 0; i < files.length; i++) {
    const result = await uploadProfilePhoto(files[i], userId, startIndex + i)
    results.push(result)
  }

  return results
}

