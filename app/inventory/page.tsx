import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, DollarSign, Calendar, Fuel, Search, SlidersHorizontal } from "lucide-react"

// Update the page metadata
export const metadata: Metadata = {
  title: "Inventory | Triple B Truck Sales",
  description:
    "Browse our inventory of medium and light duty work trucks including pickups, dump trucks, safety trucks, box trucks, flatbed trucks, and more.",
}

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
    color: "Oxford White",
    transmission: "Automatic",
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
    color: "Agate Black",
    transmission: "Automatic",
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
    color: "Velocity Blue",
    transmission: "Automatic",
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
    color: "Rapid Red",
    transmission: "Automatic",
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
    color: "Star White",
    transmission: "Automatic",
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
    color: "Carbonized Gray",
    transmission: "Automatic",
  },
]

export default function InventoryPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Our Truck Inventory</h1>

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
              <Input id="search" type="search" placeholder="Search by keyword..." className="pl-8" />
            </div>
          </div>
          <div>
            <label htmlFor="category" className="text-sm font-medium mb-1 block">
              Category
            </label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="pickups">Pickup Trucks</SelectItem>
                <SelectItem value="dump-trucks">Dump Trucks</SelectItem>
                <SelectItem value="safety-trucks">Safety Trucks</SelectItem>
                <SelectItem value="box-trucks">Box Trucks</SelectItem>
                <SelectItem value="flatbed-trucks">Flatbed Trucks</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="year" className="text-sm font-medium mb-1 block">
              Year
            </label>
            <Select>
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
              Price Range
            </label>
            <Select>
              <SelectTrigger id="price">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="under-30k">Under $30,000</SelectItem>
                <SelectItem value="30k-40k">$30,000 - $40,000</SelectItem>
                <SelectItem value="40k-50k">$40,000 - $50,000</SelectItem>
                <SelectItem value="50k-60k">$50,000 - $60,000</SelectItem>
                <SelectItem value="over-60k">Over $60,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button>Apply Filters</Button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-muted-foreground">Showing {trucks.length} trucks</p>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="mileage-low">Mileage: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trucks.map((truck) => (
          <Card key={truck.id} className="overflow-hidden">
            <div className="relative h-48 md:h-60">
              <Image src={truck.image || "/placeholder.svg"} alt={truck.title} fill className="object-cover" />
              {truck.featured && <Badge className="absolute top-2 right-2 bg-blue-600">Featured</Badge>}
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{truck.title}</h3>
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="font-bold text-lg">${truck.price.toLocaleString()}</span>
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
              <Link href={`/inventory/${truck.id}`}>
                <Button variant="outline">View Details</Button>
              </Link>
              <Link href={`/contact?truck=${truck.id}`}>
                <Button>Inquire Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
