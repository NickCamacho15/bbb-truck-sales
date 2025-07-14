"use client"

import { useState, useEffect, use } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Truck,
  DollarSign,
  Calendar,
  Fuel,
  Gauge,
  Cog,
  PaintBucket,
  Car,
  FileText,
  Share2,
  Printer,
  Heart,
  ChevronLeft,
  Loader2,
} from "lucide-react"

interface TruckImage {
  id: string
  imageUrl: string
  isPrimary: boolean
  sortOrder: number
}

interface TruckFeature {
  id: string
  featureName: string
}

interface TruckData {
  id: string
  title: string
  price: number
  listingType: "SALE" | "LEASE"
  monthlyPrice: number | null
  leaseTermMonths: number | null
  downPayment: number | null
  year: number
  make: string
  model: string
  trim: string
  mileage: number
  fuelType: string
  transmission: string
  drivetrain: string
  color: string
  vin: string
  stockNumber: string
  description: string
  status: "AVAILABLE" | "PENDING_SALE" | "SOLD"
  featured: boolean
  images: TruckImage[]
  features: TruckFeature[]
}

// Helper function to generate or get a session ID
function getOrCreateSessionId(): string {
  if (typeof window !== 'undefined') {
    // Check if we already have a session ID in cookies
    const cookies = document.cookie.split(';')
    const sessionCookie = cookies.find(c => c.trim().startsWith('session_id='))
    
    if (sessionCookie) {
      return sessionCookie.trim().split('=')[1]
    }
    
    // Create a new session ID
    const sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Store it in a cookie that expires in 30 days
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    document.cookie = `session_id=${sessionId};expires=${expiryDate.toUTCString()};path=/`
    
    return sessionId
  }
  return ''
}

export default function TruckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const searchParams = useSearchParams()
  const [truck, setTruck] = useState<TruckData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Check if user came from admin portal
  const fromAdmin = searchParams.get('from') === 'admin'
  const backUrl = fromAdmin ? '/admin/inventory' : '/inventory'
  const backText = fromAdmin ? 'Back to Admin Inventory' : 'Back to Inventory'

  useEffect(() => {
    // Make sure we have a session ID for analytics
    getOrCreateSessionId()
    
    const fetchTruck = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/trucks/${resolvedParams.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError("Truck not found")
          } else {
            throw new Error('Failed to fetch truck')
          }
          return
        }
        
        const truckData: TruckData = await response.json()
        setTruck(truckData)
        
      } catch (err) {
        console.error('Error fetching truck:', err)
        setError(err instanceof Error ? err.message : 'Failed to load truck')
      } finally {
        setLoading(false)
      }
    }

    fetchTruck()
  }, [resolvedParams.id])

  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!truck?.images || truck.images.length <= 1) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSelectedImageIndex(prev => 
          prev === 0 ? truck.images.length - 1 : prev - 1
        )
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setSelectedImageIndex(prev => 
          prev === truck.images.length - 1 ? 0 : prev + 1
        )
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [truck?.images])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading truck details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !truck) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="text-center min-h-[400px] flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-2">Truck Not Found</h2>
          <p className="text-muted-foreground mb-4">
            {error || "The truck you're looking for doesn't exist."}
          </p>
          <Link href={backUrl}>
            <Button>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {backText}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Ensure we have at least one image
  const truckImages = truck.images.length > 0 
    ? truck.images.map(img => img.imageUrl)
    : ['/placeholder.svg']

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <Link href={backUrl} className="flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft className="h-4 w-4 mr-1" />
          {backText}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Images Section - Left side on desktop */}
        <div className="lg:col-span-8 order-1">
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-4 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={truckImages[selectedImageIndex] || "/placeholder.svg"}
              alt={truck.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.svg'
              }}
            />
            {/* Navigation arrows */}
            {truckImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? truckImages.length - 1 : prev - 1
                  )}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === truckImages.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  aria-label="Next image"
                >
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </button>
              </>
            )}
            {/* Image counter */}
            {truckImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {selectedImageIndex + 1} / {truckImages.length}
              </div>
            )}
            {/* Lease badge */}
            {truck.listingType === "LEASE" && (
              <div className="absolute top-4 left-4 bg-green-600 text-white font-medium px-3 py-1 rounded-md">
                For Lease
              </div>
            )}
          </div>
          {truckImages.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {truckImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-16 md:h-20 rounded-md overflow-hidden transition-all ${
                    selectedImageIndex === index 
                      ? 'ring-3 ring-blue-500 ring-offset-2 opacity-100' 
                      : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${truck.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder.svg'
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Car Details Section - Right side on desktop, second on mobile */}
        <div className="order-2 lg:col-span-4">
          <div className="bg-card text-card-foreground p-6 border rounded-lg shadow-sm mb-1">
            <h1 className="text-2xl font-bold mb-2">{truck.title}</h1>
            
            {/* Price information */}
            {truck.listingType === "LEASE" ? (
              <div className="mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 text-green-600 mr-1" />
                  <span className="text-3xl font-bold text-green-600">${truck.monthlyPrice?.toLocaleString()}/mo</span>
                </div>
                {truck.downPayment && truck.downPayment > 0 && (
                  <div className="text-muted-foreground mt-1">
                    ${truck.downPayment.toLocaleString()} down payment
                  </div>
                )}
                {truck.leaseTermMonths && (
                  <div className="text-muted-foreground text-sm">
                    {truck.leaseTermMonths} month lease term
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600 mr-1" />
                <span className="text-3xl font-bold text-green-600">${truck.price.toLocaleString()}</span>
              </div>
            )}

            {/* Status Badge */}
            <div className="mb-4">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  truck.status === 'AVAILABLE' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : truck.status === 'PENDING_SALE'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {truck.status === 'AVAILABLE' ? 'Available' : 
                 truck.status === 'PENDING_SALE' ? 'Pending Sale' : 
                 (truck.status === 'SOLD' && truck.listingType === 'LEASE') ? 'Leased' : 'Sold'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Year</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{truck.year}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Mileage</span>
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{truck.mileage.toLocaleString()} mi</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Make & Model</span>
                <div className="flex items-center">
                  <Car className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{truck.make} {truck.model}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Trim</span>
                <div className="flex items-center">
                  <span className="font-medium">{truck.trim}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Fuel Type</span>
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{truck.fuelType}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Transmission</span>
                <div className="flex items-center">
                  <Cog className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{truck.transmission}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Color</span>
                <div className="flex items-center">
                  <PaintBucket className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{truck.color}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">Drivetrain</span>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="font-medium">{truck.drivetrain}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Stock #:</span>
                <span className="font-medium">{truck.stockNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">VIN:</span>
                <span className="font-mono text-xs">{truck.vin}</span>
              </div>
            </div>

            <div className="space-y-3">
              {truck.status === 'AVAILABLE' ? (
                <>
                  <Link href={`/contact?truck=${truck.id}`} className="block w-full cursor-pointer">
                    <Button className="w-full text-lg py-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
                      {truck.listingType === "LEASE" 
                        ? "Inquire About Leasing This Truck" 
                        : "Contact About This Truck"}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button disabled className="w-full text-lg py-6">
                    {truck.status === 'PENDING_SALE' ? 'Sale Pending' : 
                     (truck.status === 'SOLD' && truck.listingType === 'LEASE') ? 'Leased' : 'Sold'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description and Features Tabs - Third on mobile, below images on desktop */}
        <div className="lg:col-span-8 lg:col-start-1 order-3 mt-2 lg:mt-0">
          <div className="mt-0">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6 border rounded-md mt-2 bg-card text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-4">About This Truck</h3>
                <p className="leading-relaxed">{truck.description}</p>
              </TabsContent>
              <TabsContent value="features" className="p-6 border rounded-md mt-2 bg-card text-card-foreground shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                {truck.features.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {truck.features.map((feature, index) => (
                      <li key={feature.id} className="flex items-start">
                        <div className="mr-2 mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        <span className="font-medium">{feature.featureName}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No features listed for this truck.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
