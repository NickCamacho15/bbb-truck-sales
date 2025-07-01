import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for frontend operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (has more permissions)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Storage bucket name
export const STORAGE_BUCKET = 'bbb-truck-images'

// Helper function to get public URL for an image
export function getImageUrl(path: string): string {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

// Helper function to generate unique filename
export function generateImagePath(file: File): string {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 15)
  const extension = file.name.split('.').pop()?.toLowerCase()
  return `trucks/${timestamp}-${randomId}.${extension}`
} 