"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, Mail, Phone, Calendar, User, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Inquiry {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  inquiryType: "GENERAL" | "SALES" | "TEST_DRIVE" | "FINANCING" | "SERVICE"
  status: "NEW" | "CONTACTED" | "CLOSED"
  createdAt: string
  updatedAt: string
  truckId?: string
  truck?: {
    id: string
    title: string
    year: number
    make: string
    model: string
  } | null
}

export default function InquiryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const inquiryId = params.id as string
  
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (inquiryId) {
      fetchInquiry()
    }
  }, [inquiryId])

  const fetchInquiry = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/inquiries/${inquiryId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch inquiry')
      }

      const data = await response.json()
      setInquiry(data)
      setStatus(data.status)
    } catch (err) {
      console.error('Error fetching inquiry:', err)
      setError(err instanceof Error ? err.message : 'Failed to load inquiry')
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async () => {
    if (!inquiry || status === inquiry.status) return

    try {
      setIsUpdating(true)
      
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update inquiry status')
      }

      // Refresh inquiry
      await fetchInquiry()
    } catch (err) {
      console.error('Error updating inquiry status:', err)
      alert('Failed to update inquiry status. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const deleteInquiry = async () => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return
    }

    try {
      setIsDeleting(true)

      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete inquiry')
      }

      // Redirect back to inquiries list
      router.push('/admin/inquiries')
    } catch (err) {
      console.error('Error deleting inquiry:', err)
      alert('Failed to delete inquiry. Please try again.')
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatInquiryType = (type: string) => {
    switch (type) {
      case "GENERAL": return "General"
      case "SALES": return "Sales"
      case "TEST_DRIVE": return "Test Drive"
      case "FINANCING": return "Financing"
      case "SERVICE": return "Service"
      default: return type
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW": return "bg-blue-100 text-blue-800"
      case "CONTACTED": return "bg-yellow-100 text-yellow-800"
      case "CLOSED": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex flex-col">
          <AdminHeader title="Inquiry Details" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading inquiry details...</span>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !inquiry) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex flex-col">
          <AdminHeader title="Inquiry Details" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error || 'Inquiry not found'}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={fetchInquiry}>Try Again</Button>
                <Button variant="outline" onClick={() => router.push('/admin/inquiries')}>
                  Back to Inquiries
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <AdminHeader title="Inquiry Details" />

        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <Link href="/admin/inquiries">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Inquiries
              </Button>
            </Link>

            <div className="flex gap-4">
              <Button 
                variant="destructive" 
                onClick={deleteInquiry}
                disabled={isDeleting}
                className="gap-2"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete Inquiry
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main inquiry details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Inquiry Details</CardTitle>
                    <Badge className={getStatusColor(inquiry.status)}>
                      {inquiry.status === "NEW" ? "New" : 
                      inquiry.status === "CONTACTED" ? "Contacted" : "Closed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Received on {formatDate(inquiry.createdAt)}</span>
                    </div>

                    <div>
                      <Badge variant="outline">{formatInquiryType(inquiry.inquiryType)}</Badge>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{inquiry.message}</p>
                    </div>
                  </div>

                  {inquiry.truck && (
                    <div className="mt-6 border-t pt-4">
                      <h3 className="font-medium text-lg mb-2">Interested in:</h3>
                      <Link 
                        href={`/admin/inventory/${inquiry.truckId}/edit`}
                        className="text-blue-600 hover:underline"
                      >
                        {inquiry.truck.year} {inquiry.truck.make} {inquiry.truck.model} - {inquiry.truck.title}
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact info and status */}
            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{inquiry.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                          {inquiry.email}
                        </a>
                      </div>
                    </div>

                    {inquiry.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">
                            {inquiry.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Update Status</label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="CONTACTED">Contacted</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      onClick={updateInquiryStatus} 
                      disabled={isUpdating || status === inquiry.status}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Status'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 