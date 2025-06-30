import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Mail, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | Triple B Truck Sales",
  description:
    "Contact Triple B Truck Sales for inquiries about our medium and light duty work trucks, financing options, or to schedule a test drive.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Doe" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiry-type">Inquiry Type</Label>
                <Select>
                  <SelectTrigger id="inquiry-type">
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="sales">Sales Inquiry</SelectItem>
                    <SelectItem value="test-drive">Schedule Test Drive</SelectItem>
                    <SelectItem value="financing">Financing Question</SelectItem>
                    <SelectItem value="service">Service Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="truck-interest">Interested in a specific truck?</Label>
                <Select>
                  <SelectTrigger id="truck-interest">
                    <SelectValue placeholder="Select a truck model (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Pickup Truck</SelectItem>
                    <SelectItem value="dump">Dump Truck</SelectItem>
                    <SelectItem value="safety">Safety Truck</SelectItem>
                    <SelectItem value="box">Box Truck</SelectItem>
                    <SelectItem value="flatbed">Flatbed Truck</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you today?" rows={5} required />
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <div>
                  <p className="font-medium">Sales Department</p>
                  <p>(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Service Department</p>
                  <p>(555) 123-4568</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium">Email</p>
                  <p>info@bbbtrucksales.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p>Saturday: 10:00 AM - 5:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-[300px] rounded-lg overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Map location of BBB Truck Sales"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                We're conveniently located just off Highway 75, with easy access from all parts of the Dallas metro
                area.
              </p>
              <Button className="w-full">Get Directions</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "Do you offer financing options?",
              answer:
                "Yes, we offer a variety of financing options to fit your budget and credit situation. Our finance team works with multiple lenders to find the best rates for you.",
            },
            {
              question: "Can I schedule a test drive online?",
              answer:
                "You can schedule a test drive through our contact form, or by calling our sales department directly.",
            },
            {
              question: "Do you accept trade-ins?",
              answer:
                "Yes, we accept trade-ins of all makes and models. Our team will provide a fair market value for your vehicle.",
            },
            {
              question: "Do you offer delivery services?",
              answer:
                "We offer delivery services within a 100-mile radius of our dealership. Contact us for more details and availability.",
            },
          ].map((faq, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Work Truck?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Visit our dealership today or browse our online inventory to find the medium or light duty truck that fits
          your business needs.
        </p>
        <Link href="/inventory">
          <Button size="lg" variant="secondary">
            Browse Inventory
          </Button>
        </Link>
      </div>
    </div>
  )
}
