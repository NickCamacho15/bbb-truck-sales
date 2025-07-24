import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Brain, Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | BBB Truck Sales",
  description: "Learn about Triple B Truck Sales, your trusted source for quality work trucks.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-12">
        <Image
          src="/truck-image.jpeg"
          alt="Triple B Truck Sales"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">About Triple B Truck Sales</h1>
          <p className="text-xl max-w-3xl">Your trusted source for quality work trucks</p>
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Commitment To You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">A Place You Can Trust</h3>
                <p className="text-gray-600 dark:text-white leading-relaxed">
                  We know that the truck industry has a reputation of overcharging and misleading customers.
                  To ensure we're a place you can trust, we operate with complete transparency. All of our trucks are 
                  priced fairly and we provide full vehicle history reports. Our goal is to build a relationship that lasts
                  beyond your truck purchase.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Brain className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Truck Experts</h3>
                <p className="text-gray-600 dark:text-white leading-relaxed">
                  Our sales team undergoes extensive training when they join the team. They know every detail about the 
                  work trucks we sell, from specifications to capabilities. They also have continuing education to keep 
                  up with new truck models and features. This knowledge ensures you get the right truck for your needs.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Quality Trucks</h3>
                <p className="text-gray-600 dark:text-white leading-relaxed">
                  We carefully inspect and select every truck in our inventory. When you purchase a truck from us, 
                  you can be confident you're getting a quality vehicle that will serve your business needs for years
                  to come. We stand behind every truck we sell with excellent after-sale support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Process */}
      <div className="mb-20 py-12">
        <h2 className="text-3xl font-bold mb-16 text-center">Our Simple Process</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="relative flex flex-col items-center text-center h-full">
            <div className="bg-blue-600 text-white text-3xl font-bold h-16 w-16 rounded-full flex items-center justify-center mb-6 mx-auto z-10">1</div>
            <h3 className="text-xl font-bold mb-4">Browse Our Inventory</h3>
            <p className="text-gray-600 dark:text-white">
              Explore our selection of quality work trucks. Find the make, model, and specifications that match your business requirements.
            </p>
            <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-blue-200 -z-10"></div>
          </div>
          
          <div className="relative flex flex-col items-center text-center h-full">
            <div className="bg-blue-600 text-white text-3xl font-bold h-16 w-16 rounded-full flex items-center justify-center mb-6 mx-auto z-10">2</div>
            <h3 className="text-xl font-bold mb-4">Meet With Our Experts</h3>
            <p className="text-gray-600 dark:text-white">
              Connect with our professionals who will answer any questions you have about the vehicles that interest you.
            </p>
            <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-blue-200 -z-10"></div>
          </div>
          
          <div className="flex flex-col items-center text-center h-full">
            <div className="bg-blue-600 text-white text-3xl font-bold h-16 w-16 rounded-full flex items-center justify-center mb-6 mx-auto">3</div>
            <h3 className="text-xl font-bold mb-4">Drive Away Happy</h3>
            <p className="text-gray-600 dark:text-white">
              Complete your purchase and drive away in your perfect work truck.
            </p>
          </div>
        </div>
      </div>

      {/* Link to inventory */}
      <div className="text-center mb-20">
        <Link href="/inventory">
          <Button size="lg" className="font-semibold bg-blue-600 hover:bg-blue-700">
            Browse Our Truck Inventory
          </Button>
        </Link>
      </div>
    </div>
  )
}
