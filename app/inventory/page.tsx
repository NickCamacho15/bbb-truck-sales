"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, DollarSign, Calendar, Fuel, Search, SlidersHorizontal, Loader2 } from "lucide-react"
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
  createdAt: string
  updatedAt: string
}

export default function InventoryPage() {
  const [trucks, setTrucks] = useState<TruckData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [mileageFilter, setMileageFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("any")
  const [sortBy, setSortBy] = useState("newest")
  const router = useRouter()
  
  // Fetch trucks from API
  useEffect(() => {
    fetchTrucks()
  }, [])

  const fetchTrucks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Only get available LEASE trucks for public site
      const response = await fetch('/api/trucks?status=AVAILABLE&listingType=LEASE&limit=50')
      if (!response.ok) {
        throw new Error('Failed to fetch trucks')
      }
      
      const data = await response.json()
      setTrucks(data.trucks || [])
    } catch (err) {
      console.error('Error fetching trucks:', err)
      setError(err instanceof Error ? err.message : 'Failed to load trucks')
    } finally {
      setLoading(false)
    }
  }

  // Apply filters and sorting
  const getFilteredTrucks = () => {
    return trucks.filter(truck => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        truck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.trim.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Mileage filter
      const matchesMileage = mileageFilter === "all" || 
        (mileageFilter === "under-10k" && truck.mileage < 10000) ||
        (mileageFilter === "10k-30k" && truck.mileage >= 10000 && truck.mileage < 30000) ||
        (mileageFilter === "30k-60k" && truck.mileage >= 30000 && truck.mileage < 60000) ||
        (mileageFilter === "60k-100k" && truck.mileage >= 60000 && truck.mileage < 100000) ||
        (mileageFilter === "over-100k" && truck.mileage >= 100000);

      // Year filter
      const matchesYear = yearFilter === "all" || 
        (yearFilter === "2023" && truck.year === 2023) ||
        (yearFilter === "2022" && truck.year === 2022) ||
        (yearFilter === "2021" && truck.year === 2021) ||
        (yearFilter === "2020" && truck.year === 2020) ||
        (yearFilter === "older" && truck.year < 2020);

      // Price filter
      const matchesPrice = priceFilter === "any" ||
        (priceFilter === "under-300" && truck.monthlyPrice < 300) ||
        (priceFilter === "300-500" && truck.monthlyPrice >= 300 && truck.monthlyPrice < 500) ||
        (priceFilter === "500-700" && truck.monthlyPrice >= 500 && truck.monthlyPrice < 700) ||
        (priceFilter === "700-1000" && truck.monthlyPrice >= 700 && truck.monthlyPrice < 1000) ||
        (priceFilter === "over-1000" && truck.monthlyPrice >= 1000);

      return matchesSearch && matchesMileage && matchesYear && matchesPrice;
    }).sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-low":
          return (a.monthlyPrice || 0) - (b.monthlyPrice || 0);
        case "price-high":
          return (b.monthlyPrice || 0) - (a.monthlyPrice || 0);
        case "mileage-low":
          return a.mileage - b.mileage;
        default:
          return 0;
      }
    });
  }

  const filteredTrucks = getFilteredTrucks();

  const handleApplyFilters = () => {
    // This function could be used for more complex filtering scenarios
    // Currently, filters are applied reactively in the getFilteredTrucks function
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading inventory...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={fetchTrucks}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Our Trucks for Lease</h1>

      {/* Filters */}
      <div className="bg-muted rounded-lg p-4 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filter Trucks</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="text-sm font-medium mb-1 block">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="search" 
                type="search" 
                placeholder="Search by keyword..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="mileage" className="text-sm font-medium mb-1 block">
              Mileage Range
            </label>
            <Select value={mileageFilter} onValueChange={setMileageFilter}>
              <SelectTrigger id="mileage">
                <SelectValue placeholder="All Mileage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Mileage</SelectItem>
                <SelectItem value="under-10k">Under 10,000 miles</SelectItem>
                <SelectItem value="10k-30k">10,000 - 30,000 miles</SelectItem>
                <SelectItem value="30k-60k">30,000 - 60,000 miles</SelectItem>
                <SelectItem value="60k-100k">60,000 - 100,000 miles</SelectItem>
                <SelectItem value="over-100k">Over 100,000 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="year" className="text-sm font-medium mb-1 block">
              Year
            </label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger id="year">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="older">2019 & Older</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="price" className="text-sm font-medium mb-1 block">
              Monthly Payment
            </label>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger id="price">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="under-300">Under $300/mo</SelectItem>
                <SelectItem value="300-500">$300 - $500/mo</SelectItem>
                <SelectItem value="500-700">$500 - $700/mo</SelectItem>
                <SelectItem value="700-1000">$700 - $1000/mo</SelectItem>
                <SelectItem value="over-1000">Over $1000/mo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">Showing {filteredTrucks.length} trucks</p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Monthly Payment: Low to High</SelectItem>
            <SelectItem value="price-high">Monthly Payment: High to Low</SelectItem>
            <SelectItem value="mileage-low">Mileage: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredTrucks.length === 0 ? (
        <div className="text-center p-8 bg-muted rounded-lg">
          <p className="text-lg mb-2">No trucks match your search criteria</p>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search term</p>
          <Button onClick={() => {
            setSearchQuery("");
            setMileageFilter("all");
            setYearFilter("all");
            setPriceFilter("any");
          }}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrucks.map((truck) => (
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
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{truck.year}</span>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="h-4 w-4 mr-1" />
                      <span>{truck.fuelType}</span>
                    </div>
                    <div>
                      <span className="font-medium">Color:</span> {truck.color}
                    </div>
                    <div>
                      <span className="font-medium">Trim:</span> {truck.trim}
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
      )}
    </div>
  )
}
