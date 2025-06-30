import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, CheckCircle, Clock, MapPin, Phone, Star, Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | BBB Truck Sales",
  description: "Learn about BBB Truck Sales, your trusted source for quality Ford pickup trucks since 2005.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-12">
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="BBB Truck Sales Dealership"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">About Triple B Truck Sales</h1>
          <p className="text-xl max-w-2xl">Your trusted source for medium and light duty work trucks since 2005</p>
        </div>
      </div>

      {/* Our Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4">
            <p>
              Founded in 2005 by the Brown family, Triple B Truck Sales began as a small lot with just 10 trucks. Today,
              we've grown into one of the most respected medium and light duty work truck dealerships in the region,
              with a reputation for quality vehicles and exceptional customer service.
            </p>
            <p>
              Our name, Triple B, represents the three Brown brothers who started the business: Bill, Bob, and Ben.
              Their passion for work trucks and commitment to honest business practices laid the foundation for our
              success. While we've grown over the years, we've maintained our family-owned approach and personal touch.
            </p>
            <p>
              At Triple B Truck Sales, we specialize in medium and light duty work trucks. This focused approach allows
              us to offer unparalleled expertise and the best selection of pickup trucks, dump trucks, safety trucks,
              box trucks, flatbed trucks, and other commercial vehicles in the area.
            </p>
          </div>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=800&width=800"
            alt="BBB Truck Sales Founders"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose BBB Truck Sales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Work Truck Specialists</h3>
                <p className="text-gray-600">
                  We focus exclusively on medium and light duty work trucks, giving us specialized knowledge and
                  expertise.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
                <p className="text-gray-600">Every truck undergoes a comprehensive 120-point inspection before sale.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">No hidden fees or surprises. We believe in honest, upfront pricing.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
                <p className="text-gray-600">
                  Our 4.8-star average rating reflects our commitment to exceptional service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our Team */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Bill Brown",
              title: "Founder & CEO",
              image: "/placeholder.svg?height=400&width=400",
              bio: "With over 30 years in the automotive industry, Bill's knowledge of Ford trucks is unmatched.",
            },
            {
              name: "Sarah Johnson",
              title: "Sales Manager",
              image: "/placeholder.svg?height=400&width=400",
              bio: "Sarah ensures our customers find the perfect truck to meet their needs and budget.",
            },
            {
              name: "Mike Rodriguez",
              title: "Service Director",
              image: "/placeholder.svg?height=400&width=400",
              bio: "Mike leads our service team, ensuring every truck we sell is in top condition.",
            },
            {
              name: "Jennifer Lee",
              title: "Finance Manager",
              image: "/placeholder.svg?height=400&width=400",
              bio: "Jennifer helps customers navigate financing options to make truck ownership affordable.",
            },
            {
              name: "David Clark",
              title: "Inventory Specialist",
              image: "/placeholder.svg?height=400&width=400",
              bio: "David sources the best Ford trucks to ensure our inventory meets our quality standards.",
            },
            {
              name: "Lisa Martinez",
              title: "Customer Relations",
              image: "/placeholder.svg?height=400&width=400",
              bio: "Lisa ensures every customer has an exceptional experience with BBB Truck Sales.",
            },
          ].map((member, index) => (
            <Card key={index}>
              <CardContent className="p-0">
                <div className="relative h-64 rounded-t-lg overflow-hidden">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-blue-600 mb-2">{member.title}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Visit Us */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Visit Our Dealership</h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Triple B Truck Sales</p>
                  <p>123 Truck Lane</p>
                  <p>Dallas, TX 75001</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <p>(555) 123-4567</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p>Saturday: 10:00 AM - 5:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/contact">
                <Button>Contact Us</Button>
              </Link>
              <Link href="/inventory">
                <Button variant="outline">View Inventory</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=600&width=800"
              alt="BBB Truck Sales Dealership Location"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Work Truck?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Visit our dealership today or browse our online inventory to find the medium or light duty truck that fits
          your business needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/inventory">
            <Button size="lg" variant="secondary">
              Browse Inventory
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
