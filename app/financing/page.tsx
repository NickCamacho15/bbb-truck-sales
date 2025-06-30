import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, DollarSign, FileText, Calculator, CreditCard, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Financing | Triple B Truck Sales",
  description:
    "Explore financing options for your work truck purchase. Owner financing available on select vehicles. Contact Triple B Truck Sales for details.",
}

export default function FinancingPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Financing Options</h1>

      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-12">
        <Image
          src="/placeholder.svg?height=800&width=1600"
          alt="Financing Options at Triple B Truck Sales"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Flexible Financing Solutions</h1>
          <p className="text-xl max-w-2xl">Making work truck ownership accessible with various financing options</p>
        </div>
      </div>

      {/* Owner Financing Highlight */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-900">Owner Financing Available</h2>
            <p className="text-blue-700">On select vehicles - contact us for more details</p>
          </div>
        </div>
        <p className="text-blue-800 mb-4">
          We offer owner financing on some vehicles to help make your work truck purchase more accessible. This option
          may be available for qualified buyers and can provide more flexible terms than traditional financing.
        </p>
        <Link href="/contact">
          <Button className="bg-blue-600 hover:bg-blue-700">Contact Us About Owner Financing</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Financing Options */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Available Financing Options</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Traditional Auto Loans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Work with our network of trusted lenders to secure competitive rates for your work truck purchase.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Competitive interest rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Flexible loan terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Quick approval process</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Owner Financing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Available on select vehicles with flexible terms tailored to your business needs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Flexible down payment options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Customized payment schedules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Direct relationship with seller</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Commercial Financing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Specialized financing solutions for business purchases and fleet acquisitions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Business credit options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Fleet financing available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Tax advantage opportunities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financing Application */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Get Pre-Approved</CardTitle>
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
                    <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="financing-type">Financing Type</Label>
                  <Select>
                    <SelectTrigger id="financing-type">
                      <SelectValue placeholder="Select financing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional Auto Loan</SelectItem>
                      <SelectItem value="owner">Owner Financing</SelectItem>
                      <SelectItem value="commercial">Commercial Financing</SelectItem>
                      <SelectItem value="unsure">Not Sure - Need Guidance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annual-income">Annual Income</Label>
                    <Input id="annual-income" type="number" placeholder="75000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="down-payment">Down Payment</Label>
                    <Input id="down-payment" type="number" placeholder="10000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="truck-interest">Interested Truck Type</Label>
                  <Select>
                    <SelectTrigger id="truck-interest">
                      <SelectValue placeholder="Select truck type" />
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
                  <Label htmlFor="additional-info">Additional Information</Label>
                  <Textarea
                    id="additional-info"
                    placeholder="Tell us about your business needs, timeline, or any questions about financing..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Pre-Approval Application
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Payment Calculator */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Payment Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-price">Vehicle Price</Label>
                  <Input id="vehicle-price" type="number" placeholder="45000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="down-payment-calc">Down Payment</Label>
                  <Input id="down-payment-calc" type="number" placeholder="9000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                    <Input id="interest-rate" type="number" step="0.1" placeholder="6.5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loan-term">Loan Term (months)</Label>
                    <Input id="loan-term" type="number" placeholder="60" />
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  Calculate Payment
                </Button>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Estimated Monthly Payment</p>
                  <p className="text-2xl font-bold text-blue-600">$XXX</p>
                  <p className="text-xs text-gray-500">*Estimate only. Actual terms may vary.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Financing FAQ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "What is owner financing?",
              answer:
                "Owner financing means Triple B Truck Sales acts as the lender, allowing you to make payments directly to us instead of a bank. This can offer more flexible terms and faster approval.",
            },
            {
              question: "What documents do I need for financing?",
              answer:
                "Typically, you'll need proof of income, identification, insurance information, and business documentation if applying for commercial financing.",
            },
            {
              question: "Can I get financing with bad credit?",
              answer:
                "We work with various lenders and offer owner financing options that may be available for customers with less-than-perfect credit. Contact us to discuss your situation.",
            },
            {
              question: "How quickly can I get approved?",
              answer:
                "Traditional financing can often be approved within 24-48 hours. Owner financing decisions can sometimes be made the same day.",
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
        <h2 className="text-3xl font-bold mb-4">Ready to Finance Your Work Truck?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Contact our financing team today to explore your options and find the best solution for your business needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg" variant="secondary">
              Contact Financing Team
            </Button>
          </Link>
          <Link href="/inventory">
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              Browse Inventory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
