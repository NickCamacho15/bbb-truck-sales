"use client"

import type React from "react"

import { useState } from "react"
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
import { AdminSidebar } from "@/components/admin-sidebar"
import { Calendar, DollarSign, Edit, Eye, Filter, MoreHorizontal, Plus, Search, Trash2, Truck } from "lucide-react"

// This would normally come from a database
const trucks = [
  {
    id: 1,
    title: "2022 Ford F-150 XLT",
    price: 42999,
    mileage: 15420,
    year: 2022,
    fuelType: "Gasoline",
    image: "/placeholder.svg?height=600&width=800",
    featured: true,
    model: "F-150",
    trim: "XLT",
    status: "Available",
  },
  {
    id: 2,
    title: "2021 Ford F-250 Super Duty Lariat",
    price: 56799,
    mileage: 22150,
    year: 2021,
    fuelType: "Diesel",
    image: "/placeholder.svg?height=600&width=800",
    featured: true,
    model: "F-250",
    trim: "Lariat",
    status: "Available",
  },
  {
    id: 3,
    title: "2023 Ford Ranger XLT",
    price: 36500,
    mileage: 8750,
    year: 2023,
    fuelType: "Gasoline",
    image: "/placeholder.svg?height=600&width=800",
    featured: true,
    model: "Ranger",
    trim: "XLT",
    status: "Available",
  },
  {
    id: 4,
    title: "2020 Ford F-150 Raptor",
    price: 59999,
    mileage: 28500,
    year: 2020,
    fuelType: "Gasoline",
    image: "/placeholder.svg?height=600&width=800",
    featured: false,
    model: "F-150",
    trim: "Raptor",
    status: "Pending Sale",
  },
  {
    id: 5,
    title: "2022 Ford F-350 Super Duty King Ranch",
    price: 72500,
    mileage: 12800,
    year: 2022,
    fuelType: "Diesel",
    image: "/placeholder.svg?height=600&width=800",
    featured: false,
    model: "F-350",
    trim: "King Ranch",
    status: "Available",
  },
  {
    id: 6,
    title: "2021 Ford Ranger Lariat",
    price: 38750,
    mileage: 19200,
    year: 2021,
    fuelType: "Gasoline",
    image: "/placeholder.svg?height=600&width=800",
    featured: false,
    model: "Ranger",
    trim: "Lariat",
    status: "Sold",
  },
]

export default function AdminInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [modelFilter, setModelFilter] = useState("all")

  const filteredTrucks = trucks.filter((truck) => {
    const matchesSearch = truck.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || truck.status === statusFilter
    const matchesModel = modelFilter === "all" || truck.model === modelFilter

    return matchesSearch && matchesStatus && matchesModel
  })

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar activePage="inventory" />

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
                        <SelectItem value="Sold">Sold</SelectItem>
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrucks.map((truck) => (
              <Card key={truck.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={truck.image || "/placeholder.svg"} alt={truck.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/inventory/${truck.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {truck.featured ? (
                            <>
                              <Star className="mr-2 h-4 w-4 fill-yellow-400 text-yellow-400" />
                              Remove Featured
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Mark as Featured
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div
                    className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded ${
                      truck.status === "Available"
                        ? "bg-green-100 text-green-800"
                        : truck.status === "Pending Sale"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {truck.status}
                  </div>
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
                  <div className="flex justify-between">
                    <Link href={`/admin/inventory/${truck.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/inventory/${truck.id}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-3 w-3" />
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
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
