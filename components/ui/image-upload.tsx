"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({ 
  value = [], 
  onChange, 
  maxImages = 10,
  className 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File): Promise<string> => {
    const filename = `truck-${Date.now()}-${file.name}`
    
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      body: file,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const { url } = await response.json()
    return url
  }

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      alert('Please select valid image files')
      return
    }

    if (value.length + imageFiles.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    // Add temporary uploading state
    const tempIds = imageFiles.map(file => `uploading-${Date.now()}-${Math.random()}`)
    setUploading(prev => [...prev, ...tempIds])

    try {
      const uploadPromises = imageFiles.map(uploadFile)
      const uploadedUrls = await Promise.all(uploadPromises)
      
      onChange([...value, ...uploadedUrls])
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload one or more images')
    } finally {
      setUploading(prev => prev.filter(id => !tempIds.includes(id)))
    }
  }, [value, onChange, maxImages])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFiles(files)
    }
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }, [handleFiles])

  const removeImage = useCallback((index: number) => {
    const newImages = [...value]
    newImages.splice(index, 1)
    onChange(newImages)
  }, [value, onChange])

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging 
            ? "border-blue-400 bg-blue-50" 
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload Images</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop images here, or click to select files
        </p>
        <Button onClick={handleFileSelect} disabled={uploading.length > 0}>
          <Upload className="mr-2 h-4 w-4" />
          Select Images
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {(value.length > 0 || uploading.length > 0) && (
        <div>
          <h4 className="font-medium mb-2">
            Images ({value.length + uploading.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Main
                  </div>
                )}
              </div>
            ))}
            
            {/* Show uploading placeholders */}
            {uploading.map((id) => (
              <div key={id} className="relative">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">Uploading...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 