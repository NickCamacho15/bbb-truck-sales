import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, STORAGE_BUCKET, generateImagePath, getImageUrl } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll('images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadedImages: Array<{ url: string; path: string }> = []
    const errors: Array<{ filename: string; error: string }> = []

    for (const file of files) {
      try {
        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
          errors.push({
            filename: file.name,
            error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
          })
          continue
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push({
            filename: file.name,
            error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
          })
          continue
        }

        // Generate unique path
        const imagePath = generateImagePath(file)

        // Convert file to buffer
        const fileBuffer = await file.arrayBuffer()

        // Upload to Supabase Storage
        const { data, error } = await supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .upload(imagePath, fileBuffer, {
            contentType: file.type,
            upsert: false
          })

        if (error) {
          console.error('Supabase upload error:', error)
          errors.push({
            filename: file.name,
            error: `Upload failed: ${error.message}`
          })
          continue
        }

        // Get public URL
        const publicUrl = getImageUrl(imagePath)

        uploadedImages.push({
          url: publicUrl,
          path: imagePath
        })

      } catch (fileError) {
        console.error('File processing error:', fileError)
        errors.push({
          filename: file.name,
          error: 'Failed to process file'
        })
      }
    }

    return NextResponse.json({
      success: uploadedImages.length > 0,
      uploadedImages,
      errors: errors.length > 0 ? errors : undefined,
      message: `${uploadedImages.length} images uploaded successfully${errors.length > 0 ? `, ${errors.length} failed` : ''}`
    })

  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 