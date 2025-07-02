"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Eye, Filter, Loader2, Mail, MoreHorizontal, Search, Trash2 } from "lucide-react"

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

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  // Fetch inquiries from API
  useEffect(() => {
    fetchInquiries()
  }, [currentPage, statusFilter])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      setError(null)

      let url = `/api/inquiries?page=${currentPage}&limit=10`
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch inquiries')
      }

      const data = await response.json()
      setInquiries(data.inquiries || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (err) {
      console.error('Error fetching inquiries:', err)
      setError(err instanceof Error ? err.message : 'Failed to load inquiries')
    } finally {
      setLoading(false)
    }
  }

  const updateInquiryStatus = async (inquiryId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update inquiry status')
      }

      // Refresh inquiries
      await fetchInquiries()
    } catch (err) {
      console.error('Error updating inquiry status:', err)
      alert('Failed to update inquiry status. Please try again.')
    }
  }

  const deleteInquiry = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingId(inquiryId)
      const response = await fetch(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete inquiry')
      }

      // Refresh inquiries
      await fetchInquiries()
    } catch (err) {
      console.error('Error deleting inquiry:', err)
      alert('Failed to delete inquiry. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.phone?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      inquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inquiry.truck?.make?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (inquiry.truck?.model?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (inquiry.truck?.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (inquiry.truck?.year?.toString() || "").includes(searchQuery.toLowerCase())

    const matchesType = typeFilter === "all" || inquiry.inquiryType === typeFilter

    return matchesSearch && matchesType
  })

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "NEW": return "blue"
      case "CONTACTED": return "yellow"
      case "CLOSED": return "green"
      default: return "secondary"
    }
  }

  // For mobile view
  const handleCardClick = (inquiryId: string) => {
    router.push(`/admin/inquiries/${inquiryId}`)
  }

  if (loading && inquiries.length === 0) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex flex-col">
          <AdminHeader title="Inquiries Management" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading inquiries...</span>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex flex-col">
          <AdminHeader title="Inquiries Management" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={fetchInquiries}>Try Again</Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <AdminHeader title="Inquiries Management" />

        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Contact Inquiries</h2>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-1 h-4 w-4" />
                <span>{filteredInquiries.length} inquiries</span>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search inquiries..."
                      className="pl-8 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="CONTACTED">Contacted</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="SALES">Sales</SelectItem>
                        <SelectItem value="TEST_DRIVE">Test Drive</SelectItem>
                        <SelectItem value="FINANCING">Financing</SelectItem>
                        <SelectItem value="SERVICE">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-4">
            {loading && inquiries.length === 0 ? (
              <div className="p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <span>Loading inquiries...</span>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No inquiries found
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <Card 
                  key={inquiry.id} 
                  className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.01] hover:shadow-md"
                  onClick={() => handleCardClick(inquiry.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{inquiry.name}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(inquiry.status) as any}>
                        {inquiry.status === "NEW" ? "New" : 
                         inquiry.status === "CONTACTED" ? "Contacted" : "Closed"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(inquiry.createdAt)}</p>
                  </CardHeader>
                  <CardContent className="pb-2 pt-0">
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Contact:</span>
                        <span className="text-sm">{inquiry.email}</span>
                        {inquiry.phone && <span className="text-sm">{inquiry.phone}</span>}
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Inquiry Type:</span>
                        <span className="text-sm">{formatInquiryType(inquiry.inquiryType)}</span>
                      </div>
                      
                      {inquiry.truck && (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">Interested In:</span>
                          <span className="text-sm">{inquiry.truck.year} {inquiry.truck.make} {inquiry.truck.model} - {inquiry.truck.title}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteInquiry(inquiry.id);
                      }}
                      disabled={deletingId === inquiry.id}
                    >
                      {deletingId === inquiry.id ? 
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : 
                        <Trash2 className="h-4 w-4 mr-1" />
                      }
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto">
            <div className="rounded-lg border bg-card text-card-foreground shadow">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Email/Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Interested In
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading && inquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm text-muted-foreground">
                        No inquiries found
                      </td>
                    </tr>
                  ) : (
                    filteredInquiries.map((inquiry) => (
                      <tr 
                        key={inquiry.id} 
                        className="cursor-pointer hover:bg-muted transition-colors"
                        onClick={() => handleCardClick(inquiry.id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{inquiry.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">{inquiry.email}</div>
                          {inquiry.phone && (
                            <div className="text-sm text-muted-foreground">{inquiry.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{formatInquiryType(inquiry.inquiryType)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm max-w-xs truncate">
                            {inquiry.truck ? 
                              `${inquiry.truck.year} ${inquiry.truck.make} ${inquiry.truck.model} - ${inquiry.truck.title}` :
                              "General Inquiry"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{formatDate(inquiry.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(inquiry.status) as any}>
                            {inquiry.status === "NEW" ? "New" : 
                             inquiry.status === "CONTACTED" ? "Contacted" : "Closed"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive" 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteInquiry(inquiry.id);
                              }}
                              disabled={deletingId === inquiry.id}
                              title="Delete inquiry"
                            >
                              {deletingId === inquiry.id ? 
                                <Loader2 className="h-4 w-4 animate-spin" /> : 
                                <Trash2 className="h-4 w-4" />
                              }
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 