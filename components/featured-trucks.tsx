"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, DollarSign, Calendar, Fuel, Loader2 } from "lucide-react"
import { clickable } from "@/lib/utils"

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

export default function FeaturedTrucks() {
  const [featuredTrucks, setFeaturedTrucks] = useState<TruckData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFeaturedTrucks = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/trucks?featured=true&listingType=LEASE&limit=3')
        if (!response.ok) {
          throw new Error('Failed to fetch featured trucks')
        }
        
        const data = await response.json()
        setFeaturedTrucks(data.trucks || [])
      } catch (err) {
        console.error('Error fetching featured trucks:', err)
        setError(err instanceof Error ? err.message : 'Failed to load featured trucks')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedTrucks()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading featured trucks...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error loading featured trucks. Please try again later.</p>
      </div>
    )
  }

  if (featuredTrucks.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No featured trucks available at this time.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredTrucks.map((truck) => (
        <div 
          key={truck.id}
          onClick={() => router.push(`/inventory/${truck.id}`)}
          className={clickable()}
        >
          <Card className="overflow-hidden h-full transition-transform hover:scale-[1.01] hover:shadow-md">
            <div className="relative h-48 md:h-60">
              <Image 
                src={truck.images.length > 0 ? truck.images[0].imageUrl : "/placeholder.svg"} 
                alt={truck.title} 
                fill 
                className="object-cover" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder.svg'
                }}
              />
              {truck.featured && <Badge className="absolute top-2 right-2 bg-blue-600">Featured</Badge>}
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{truck.title}</h3>
              <div className="flex justify-between mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="font-bold text-lg">${truck.monthlyPrice?.toLocaleString()}/mo</span>
                  </div>
                  {truck.downPayment && truck.downPayment > 0 && (
                    <div className="text-sm text-gray-600">
                      ${truck.downPayment.toLocaleString()} down
                    </div>
                  )}
                  {truck.leaseTermMonths && truck.leaseTermMonths > 0 && (
                    <div className="text-sm text-gray-600">
                      {truck.leaseTermMonths} month term
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 text-gray-500 mr-1" />
                  <span>{truck.mileage.toLocaleString()} mi</span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{truck.year}</span>
                </div>
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 mr-1" />
                  <span>{truck.fuelType}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button variant="outline">View Details</Button>
              <div onClick={(e) => e.stopPropagation()}>
                <Link href={`/contact?truck=${truck.id}`}>
                  <Button>Inquire Now</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  )
}
