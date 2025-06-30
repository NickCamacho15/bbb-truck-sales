"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, DollarSign, Calendar, Fuel } from "lucide-react"

// This would normally come from a database
const featuredTrucks = [
  {
    id: 1,
    title: "2022 Ford F-150 XLT",
    price: 42999,
    mileage: 15420,
    year: 2022,
    fuelType: "Gasoline",
    image: "/placeholder.svg?height=600&width=800",
    featured: true,
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
  },
]

export default function FeaturedTrucks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredTrucks.map((truck) => (
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
  )
}
