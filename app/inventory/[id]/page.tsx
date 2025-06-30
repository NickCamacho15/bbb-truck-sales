import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { use } from "react"
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
} from "lucide-react"

export const metadata: Metadata = {
  title: "Truck Details | BBB Truck Sales",
  description: "View detailed information about this Ford truck including specifications, features, and pricing.",
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
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    featured: true,
    model: "F-150",
    trim: "XLT",
    color: "Oxford White",
    transmission: "Automatic",
    engine: "3.5L EcoBoost V6",
    drivetrain: "4x4",
    vin: "1FTEW1EP5NKD12345",
    stock: "F22-0123",
    description:
      "This 2022 Ford F-150 XLT is in excellent condition with low mileage. It features the powerful 3.5L EcoBoost V6 engine, 4x4 drivetrain, and comes loaded with features including the XLT package, SYNC 4 infotainment system, and more. Perfect for work or play, this truck offers the perfect balance of capability, comfort, and style.",
    features: [
      "SYNC 4 with 12-inch Touchscreen",
      "360-Degree Camera",
      "Pro Power Onboard Generator",
      "Lane-Keeping System",
      "Pre-Collision Assist with Automatic Emergency Braking",
      "Blind Spot Information System",
      "LED Headlamps and Taillamps",
      "Remote Start System",
      "Power-Adjustable Pedals",
      "Class IV Trailer Hitch",
      "Power-Adjustable Heated Mirrors",
      "Power-Sliding Rear Window",
    ],
    specifications: {
      exterior: {
        Length: "231.7 inches",
        Width: "79.9 inches",
        Height: "77.2 inches",
        Wheelbase: "145.4 inches",
        "Ground Clearance": "9.4 inches",
        "Bed Length": "5.5 feet",
      },
      performance: {
        Engine: "3.5L EcoBoost V6",
        Horsepower: "400 hp @ 6,000 rpm",
        Torque: "500 lb-ft @ 3,100 rpm",
        Transmission: "10-Speed Automatic",
        Drivetrain: "4x4",
        "Fuel Economy": "18 city / 23 highway / 20 combined mpg",
      },
      capacity: {
        Seating: "5 passengers",
        Payload: "1,985 lbs",
        "Towing Capacity": "12,700 lbs",
        "Fuel Tank": "26.0 gallons",
      },
    },
  },
]

export default function TruckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const truckId = Number.parseInt(resolvedParams.id)
  const truck = trucks.find((t) => t.id === truckId)

  if (!truck) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/inventory" className="flex items-center text-blue-600 hover:text-blue-800">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Inventory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-4 rounded-lg overflow-hidden">
            <Image
              src={truck.images[0] || "/placeholder.svg"}
              alt={truck.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {truck.images.map((image, index) => (
              <div key={index} className="relative h-20 rounded-md overflow-hidden cursor-pointer">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${truck.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-4 border rounded-md mt-2">
                <h3 className="text-xl font-semibold mb-4">About This Truck</h3>
                <p className="text-gray-700">{truck.description}</p>
              </TabsContent>
              <TabsContent value="features" className="p-4 border rounded-md mt-2">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {truck.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="specifications" className="p-4 border rounded-md mt-2">
                <h3 className="text-xl font-semibold mb-4">Detailed Specifications</h3>

                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-2 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-blue-600" />
                    Exterior Dimensions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(truck.specifications.exterior).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-1">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-2 flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-blue-600" />
                    Performance
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(truck.specifications.performance).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-1">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-lg mb-2 flex items-center">
                    <Truck className="h-5 w-5 mr-2 text-blue-600" />
                    Capacity
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(truck.specifications.capacity).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-1">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column - Details and Actions */}
        <div>
          <div className="bg-white p-6 border rounded-lg shadow-sm mb-6">
            <h1 className="text-2xl font-bold mb-2">{truck.title}</h1>
            <div className="flex items-center mb-4">
              <DollarSign className="h-6 w-6 text-green-600 mr-1" />
              <span className="text-3xl font-bold text-green-600">${truck.price.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Year</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="font-medium">{truck.year}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Mileage</span>
                <div className="flex items-center">
                  <Gauge className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="font-medium">{truck.mileage.toLocaleString()} mi</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Fuel Type</span>
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="font-medium">{truck.fuelType}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Transmission</span>
                <div className="flex items-center">
                  <Cog className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="font-medium">{truck.transmission}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Color</span>
                <div className="flex items-center">
                  <PaintBucket className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="font-medium">{truck.color}</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Drivetrain</span>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-1 text-gray-600" />
                  <span className="font-medium">{truck.drivetrain}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Stock #:</span>
                <span>{truck.stock}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VIN:</span>
                <span>{truck.vin}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full text-lg py-6">Contact About This Truck</Button>
              <Button variant="outline" className="w-full">
                Schedule Test Drive
              </Button>
              <Button variant="outline" className="w-full">
                Apply for Financing
              </Button>
              <Button variant="ghost" className="w-full flex items-center justify-center">
                <Heart className="mr-2 h-5 w-5" />
                Save to Favorites
              </Button>
            </div>
          </div>

          <div className="bg-white p-6 border rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4">Share This Truck</h3>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
