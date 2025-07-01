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

    return matchesSearch && matchesStatus && matchesModel
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

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search trucks..."
                      className="pl-8 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Pending Sale">Pending Sale</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <Select value={modelFilter} onValueChange={setModelFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Models</SelectItem>
                        <SelectItem value="F-150">F-150</SelectItem>
                        <SelectItem value="F-250">F-250</SelectItem>
                        <SelectItem value="F-350">F-350</SelectItem>
                        <SelectItem value="Ranger">Ranger</SelectItem>
                        <SelectItem value="Maverick">Maverick</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredTrucks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No trucks found</h3>
                <p className="text-muted-foreground mb-4">
                  {trucks.length === 0 
                    ? "Get started by adding your first truck to the inventory."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
                {trucks.length === 0 && (
                  <Link href="/admin/inventory/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Truck
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrucks.map((truck) => {
                const primaryImage = truck.images.find(img => img.isPrimary) || truck.images[0]
                const imageUrl = primaryImage?.imageUrl || "/placeholder.svg"
                
                return (
                  <Card key={truck.id} className="overflow-hidden">
                    <div className="relative h-48">
                       <Image 
                         src={imageUrl} 
                         alt={truck.title} 
                         fill 
                         className="object-cover"
                         onError={(e) => {
                           const target = e.target as HTMLImageElement
                           target.src = "/placeholder.svg"
                         }}
                       />
                      <div className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${getStatusColor(truck.status)}`}>
                        {formatStatus(truck.status)}
                      </div>
                      {truck.featured && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 text-xs font-medium rounded bg-yellow-400 text-yellow-900">
                          Featured
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{truck.title}</h3>
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                          <span className="font-bold">${truck.price.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <span>{truck.year}</span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        <p>{truck.mileage.toLocaleString()} miles • {truck.fuelType}</p>
                        <p>Stock: {truck.stockNumber}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <Link href={`/admin/inventory/${truck.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="mr-2 h-3 w-3" />
                              Edit
                            </Button>
                          </Link>
                          <Link href={`/inventory/${truck.id}?from=admin`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-2 h-3 w-3" />
                              View
                            </Button>
                          </Link>
                        </div>
                        <Button 
                          onClick={() => handleMarkAsSold(truck.id)} 
                          variant="default" 
                          size="sm" 
                          className="w-full"
                        >
                          <CheckCircle2 className="mr-2 h-3 w-3" />
                          Mark as Sold
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
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
