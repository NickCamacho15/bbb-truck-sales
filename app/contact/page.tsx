"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { useSearchParams } from "next/navigation"

export default function ContactPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-xl mb-1">Triple B Truck Sales</p>
                <p className="text-lg">250 Gordon Ln</p>
                <p className="text-lg">Morehead, KY 40351</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-xl mb-1">Phone</p>
                <p className="text-lg">606-776-3999</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-xl mb-1">Email</p>
                <p className="text-lg">parts@superdutyfordtruckparts.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-xl mb-2">Business Hours</p>
                <p className="text-lg mb-1">Monday - Friday: 8am - 5pm</p>
                <p className="text-lg mb-1">Saturday: 9am - 3pm or By appointment</p>
                <p className="text-lg">Sunday: Closed or By appointment only</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Work Truck?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Visit our dealership today or browse our online inventory to find the medium or light duty truck 
          that fits your business needs.
        </p>
        <Link href="/inventory">
          <Button size="lg" variant="secondary">
            Browse Truck Inventory
          </Button>
        </Link>
      </div>
    </div>
  )
}

interface Truck {
  id: string
  title: string
  year: number
  make: string
  model: string
  status: string
}

function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
    truckId: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [isLoadingTrucks, setIsLoadingTrucks] = useState(true)
  const [trucksError, setTrucksError] = useState<string | null>(null)

  // Get the truck ID from URL query parameter if it exists
  const searchParams = useSearchParams()
  const truckIdFromUrl = searchParams.get('truck')

  // Fetch available trucks
  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        setIsLoadingTrucks(true)
        setTrucksError(null)
        
        // Fetch only available sale trucks
        const response = await fetch('/api/trucks?status=AVAILABLE&listingType=SALE')
        
        if (!response.ok) {
          throw new Error('Failed to fetch trucks')
        }
        
        const data = await response.json()
        setTrucks(data.trucks || [])

        // If a truck ID is provided in the URL, preselect it
        if (truckIdFromUrl) {
          setFormData(prev => ({
            ...prev,
            truckId: truckIdFromUrl,
            inquiryType: 'SALES' // Auto-select sales inquiry type
          }))
        }
      } catch (err) {
        console.error('Error fetching trucks:', err)
        setTrucksError('Failed to load available trucks')
      } finally {
        setIsLoadingTrucks(false)
      }
    }

    fetchTrucks()
  }, [truckIdFromUrl])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus('idle')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          inquiryType: formData.inquiryType || 'GENERAL',
          message: formData.message,
          truckId: formData.truckId && !['none', 'error', 'loading', 'empty'].includes(formData.truckId) ? formData.truckId : undefined,
        }),
      })

      if (response.ok) {
        setFormStatus('success')
        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          inquiryType: "",
          truckId: "",
          message: "",
        })
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTruckOption = (truck: Truck) => {
    return `${truck.year} ${truck.make} ${truck.model} - ${truck.title}`
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {formStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-4">
          Thank you for your message! We will get back to you shortly.
        </div>
      )}

      {formStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
          There was an error submitting your form. Please try again.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe" 
            required 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com" 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            type="tel" 
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567" 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="inquiryType">Inquiry Type</Label>
        <Select 
          value={formData.inquiryType} 
          onValueChange={(value) => handleSelectChange("inquiryType", value)}
        >
          <SelectTrigger id="inquiryType">
            <SelectValue placeholder="Select inquiry type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GENERAL">General Inquiry</SelectItem>
            <SelectItem value="SALES">Sales Inquiry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="truckId">Interested in a specific truck for sale?</Label>
        <Select 
          value={formData.truckId} 
          onValueChange={(value) => handleSelectChange("truckId", value)}
        >
          <SelectTrigger id="truckId">
            <SelectValue placeholder={isLoadingTrucks ? "Loading available trucks for sale..." : "Select a truck (optional)"} />
          </SelectTrigger>
          <SelectContent>
            {trucksError ? (
              <SelectItem value="error" disabled>Error loading trucks</SelectItem>
            ) : isLoadingTrucks ? (
              <SelectItem value="loading" disabled>Loading trucks...</SelectItem>
            ) : trucks.length === 0 ? (
              <SelectItem value="empty" disabled>No trucks currently available for sale</SelectItem>
            ) : (
              <>
                <SelectItem value="none">Not interested in a specific truck</SelectItem>
                {trucks.map((truck) => (
                  <SelectItem key={truck.id} value={truck.id}>
                    {formatTruckOption(truck)}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message" 
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you today?" 
          rows={5} 
          required 
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
