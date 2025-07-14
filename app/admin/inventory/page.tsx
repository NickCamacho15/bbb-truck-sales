"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { Calendar, DollarSign, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash2, Truck, Loader2, CheckCircle2 } from "lucide-react"

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

interface Truck {
  id: string
  title: string
  price: number
  listingType: "SALE" | "LEASE"
  monthlyPrice?: number | null
  leaseTermMonths?: number | null
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
  createdAt: string
  updatedAt: string
  images: TruckImage[]
  features: TruckFeature[]
}

export default function AdminInventoryPage() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modelFilter, setModelFilter] = useState("all")
  const [listingTypeFilter, setListingTypeFilter] = useState("all")

  // Fetch trucks from API
  useEffect(() => {
    fetchTrucks()
  }, [])

  const fetchTrucks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/trucks')
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

  const handleDeleteTruck = async (truckId: string) => {
    if (!confirm('Are you sure you want to delete this truck? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/trucks/${truckId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete truck')
      }

      // Refresh the trucks list
      await fetchTrucks()
    } catch (err) {
      console.error('Error deleting truck:', err)
      alert('Failed to delete truck. Please try again.')
    }
  }

  const handleToggleFeatured = async (truckId: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/trucks/${truckId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !currentFeatured,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update truck')
      }

      // Refresh the trucks list
      await fetchTrucks()
    } catch (err) {
      console.error('Error updating truck:', err)
      alert('Failed to update truck. Please try again.')
    }
  }

  const handleMarkAsSold = async (truckId: string) => {
    if (!confirm('Are you sure you want to mark this truck as sold?')) {
      return
    }

    try {
      const response = await fetch(`/api/trucks/${truckId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: "SOLD",
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update truck status')
      }

      // Refresh the trucks list
      await fetchTrucks()
    } catch (err) {
      console.error('Error updating truck status:', err)
      alert('Failed to mark truck as sold. Please try again.')
    }
  }

  const handleMarkAsLeased = async (truckId: string) => {
    if (!confirm('Are you sure you want to mark this truck as leased?')) {
      return
    }

    try {
      const response = await fetch(`/api/trucks/${truckId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: "SOLD", // We use the same SOLD status for leased trucks
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update truck status')
      }

      // Refresh the trucks list
      await fetchTrucks()
    } catch (err) {
      console.error('Error updating truck status:', err)
      alert('Failed to mark truck as leased. Please try again.')
    }
  }

  // First filter out any trucks with SOLD status
  const activeTrucks = trucks.filter(truck => truck.status !== "SOLD")
  
  const filteredTrucks = activeTrucks.filter((truck) => {
    const matchesSearch = truck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         truck.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         truck.model.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "Available" && truck.status === "AVAILABLE") ||
                         (statusFilter === "Pending Sale" && truck.status === "PENDING_SALE")
    
    const matchesModel = modelFilter === "all" || truck.model === modelFilter
    
    const matchesListingType = listingTypeFilter === "all" || 
                              (listingTypeFilter === "Sale" && truck.listingType === "SALE") ||
                              (listingTypeFilter === "Lease" && truck.listingType === "LEASE")

    return matchesSearch && matchesStatus && matchesModel && matchesListingType
  })

  const formatStatus = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "Available"
      case "PENDING_SALE": return "Pending Sale"
      case "SOLD": return "Sold"
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE": return "bg-green-100 text-green-800"
      case "PENDING_SALE": return "bg-yellow-100 text-yellow-800"
      case "SOLD": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex flex-col">
          <AdminHeader title="Inventory Management" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading trucks...</span>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex flex-col">
          <AdminHeader title="Inventory Management" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={fetchTrucks}>Try Again</Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <AdminHeader title="Inventory Management" />

        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Truck Inventory</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Truck className="mr-1 h-4 w-4" />
                <span>{filteredTrucks.length} trucks</span>
              </div>
            </div>

            <Link href="/admin/inventory/new">
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add New Truck
              </Button>
            </Link>
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trucks..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Filter by status */}
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Status: {statusFilter === "all" ? "All" : statusFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Pending Sale">Pending Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter by listing type */}
                <div>
                  <Select value={listingTypeFilter} onValueChange={setListingTypeFilter}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Listing Type: {listingTypeFilter === "all" ? "All" : listingTypeFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Sale">For Sale</SelectItem>
                      <SelectItem value="Lease">For Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Filter by model */}
                <div>
                  <Select value={modelFilter} onValueChange={setModelFilter}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        <span>Model: {modelFilter === "all" ? "All" : modelFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Models</SelectItem>
                      {Array.from(new Set(trucks.map((truck) => truck.model))).sort().map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {filteredTrucks.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No trucks found matching your filters.</p>
                  <Button variant="link" onClick={() => {
                    setSearchQuery('')
                    setStatusFilter('all')
                    setModelFilter('all')
                    setListingTypeFilter('all')
                  }}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredTrucks.map((truck) => {
                  const primaryImage = truck.images.find((img) => img.isPrimary) || truck.images[0]
                  
                  return (
                    <Card key={truck.id} className="overflow-hidden">
                      <div className="aspect-video relative bg-muted">
                        {/* Badge for listing type */}
                        <div className="absolute top-2 left-2 z-10">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${(truck.listingType || "SALE") === "SALE" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                            {(truck.listingType || "SALE") === "SALE" ? "For Sale" : "For Lease"}
                          </div>
                        </div>
                        
                        {/* Featured badge */}
                        {truck.featured && (
                          <div className="absolute top-2 right-2 z-10">
                            <div className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-medium">
                              Featured
                            </div>
                          </div>
                        )}
                        
                        {/* Status badge */}
                        <div className="absolute bottom-2 left-2 z-10">
                          <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(truck.status)}`}>
                            {formatStatus(truck.status)}
                          </div>
                        </div>
                        
                        {primaryImage ? (
                          <Image
                            src={primaryImage.imageUrl}
                            alt={truck.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Truck className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{truck.title}</h3>
                        <div className="grid grid-cols-2 gap-y-2 mb-4">
                          {(truck.listingType || "SALE") === "SALE" ? (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="font-medium">${truck.price.toLocaleString()}</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="font-medium">${truck.monthlyPrice?.toLocaleString() || truck.price.toLocaleString()}/mo</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{truck.year}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sm text-muted-foreground">
                              {truck.mileage.toLocaleString()} miles • {truck.color} • Stock #{truck.stockNumber}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Link href={`/admin/inventory/${truck.id}/edit`}>
                              <Button size="sm" variant="outline" className="h-8 gap-1">
                                <Edit className="h-3 w-3" />
                                <span>Edit</span>
                              </Button>
                            </Link>
                            
                            <Link href={`/inventory/${truck.id}`} target="_blank">
                              <Button size="sm" variant="outline" className="h-8 gap-1">
                                <Eye className="h-3 w-3" />
                                <span>View</span>
                              </Button>
                            </Link>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleToggleFeatured(truck.id, truck.featured)}
                              >
                                {truck.featured ? "Remove from Featured" : "Mark as Featured"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => truck.listingType === "LEASE" ? handleMarkAsLeased(truck.id) : handleMarkAsSold(truck.id)}
                              >
                                {truck.listingType === "LEASE" ? "Mark as Leased" : "Mark as Sold"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteTruck(truck.id)}
                              >
                                Delete Listing
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
