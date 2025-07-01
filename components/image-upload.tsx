"use client"

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image, Loader2 } from 'lucide-react'

interface UploadedImage {
  url: string
  path: string
  file?: File
}

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  maxFileSize?: number // in MB
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  maxFileSize = 5 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return

    // Check if adding these files would exceed max images
    if (images.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`)
      return
    }

    setUploading(true)
    const formData = new FormData()

    // Add all files to FormData
    Array.from(files).forEach((file) => {
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`)
        return
      }
      formData.append('images', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success && result.uploadedImages) {
        // Add new image URLs to existing images
        const newImageUrls = result.uploadedImages.map((img: UploadedImage) => img.url)
        onImagesChange([...images, ...newImageUrls])

        if (result.errors && result.errors.length > 0) {
          console.error('Some uploads failed:', result.errors)
          alert(`Some files failed to upload: ${result.errors.map((e: any) => e.filename).join(', ')}`)
        }
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onImagesChange(newImages)
  }

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 px-6">
          {uploading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Uploading images...</span>
            </div>
          ) : (
            <>
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload Images</h3>
              <p className="text-gray-600 text-center mb-4">
                Drag and drop images here, or click to select files
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Maximum {maxImages} images • Max {maxFileSize}MB per file • JPEG, PNG, WebP
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= maxImages}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Images
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imageUrl, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Requirements Info */}
      {images.length < 3 && (
        <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
          <Image className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Image Requirements</p>
            <ul className="text-blue-700 mt-1 space-y-1">
              <li>• Minimum 3 images required</li>
              <li>• Include exterior shots from all angles</li>
              <li>• Add interior photos showing dashboard, seats, and cargo area</li>
              <li>• Include engine bay and undercarriage if applicable</li>
              <li>• Use high resolution (minimum 1200x800 pixels)</li>
              <li>• Ensure good lighting and clear visibility</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
} 