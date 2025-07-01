"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin-header"
import { BarChart3, DollarSign, Loader2, TrendingUp, Truck, Users, Eye } from "lucide-react"
import React from "react"

interface ActivityItem {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  time: string
}

export default function AdminDashboardPage() {
  const [inventoryCount, setInventoryCount] = useState<number>(0)
  const [inventoryDiff, setInventoryDiff] = useState<number>(0)
  const [inquiryCount, setInquiryCount] = useState<number>(0)
  const [inquiryDiff, setInquiryDiff] = useState<number>(0)
  const [totalViews, setTotalViews] = useState<number>(0)
  const [viewsDiff, setViewsDiff] = useState<number>(0)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch inventory data - exclude SOLD trucks
        const truckResponse = await fetch('/api/trucks?status=AVAILABLE,PENDING_SALE')
        if (!truckResponse.ok) {
          throw new Error('Failed to fetch inventory data')
        }
        const truckData = await truckResponse.json()
        setInventoryCount(truckData.pagination.total || 0)
        
        // Calculate inventory difference (for demo purposes, set a relative diff)
        const lastMonthCount = truckData.trucks.filter((t: any) => {
          const createdDate = new Date(t.createdAt)
          const monthAgo = new Date()
          monthAgo.setMonth(monthAgo.getMonth() - 1)
          return createdDate >= monthAgo
        }).length
        setInventoryDiff(lastMonthCount)

        // Fetch inquiry data
        const inquiryResponse = await fetch('/api/inquiries')
        if (!inquiryResponse.ok) {
          throw new Error('Failed to fetch inquiry data')
        }
        const inquiryData = await inquiryResponse.json()
        setInquiryCount(inquiryData.pagination.total || 0)

        // Calculate inquiry difference (recent inquiries in the last day)
        const yesterdayCount = inquiryData.inquiries.filter((i: any) => {
          const createdDate = new Date(i.createdAt)
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          return createdDate >= yesterday
        }).length
        setInquiryDiff(yesterdayCount)

        // Fetch analytics data for truck views
        try {
          const analyticsResponse = await fetch('/api/analytics')
          if (analyticsResponse.ok) {
            const analyticsData = await analyticsResponse.json()
            setTotalViews(analyticsData.totalViews || 0)
            
            // Get views from last 7 days for comparison
            let recentViews = 0
            if (analyticsData.viewsByDay && analyticsData.viewsByDay.length > 0) {
              // Get views from the last day if available
              recentViews = analyticsData.viewsByDay[analyticsData.viewsByDay.length - 1]?.count || 0
            }
            setViewsDiff(recentViews)
          }
        } catch (err) {
          console.log('Analytics data not available')
        }

        // Generate recent activity from both trucks and inquiries
        const combinedActivity: ActivityItem[] = []

        // Add recent trucks as activity items
        truckData.trucks.slice(0, 2).forEach((truck: any) => {
          combinedActivity.push({
            id: `truck-${truck.id}`,
            icon: <Truck className="h-4 w-4" />,
            title: "New Truck Added",
            description: `${truck.year} ${truck.make} ${truck.model} added to inventory`,
            time: formatTimeAgo(new Date(truck.createdAt))
          })
        })

        // Add recent inquiries as activity items
        inquiryData.inquiries.slice(0, 2).forEach((inquiry: any) => {
          combinedActivity.push({
            id: `inquiry-${inquiry.id}`,
            icon: <Users className="h-4 w-4" />,
            title: "New Inquiry",
            description: `${inquiry.name} inquired about ${inquiry.truck ? inquiry.truck.make + ' ' + inquiry.truck.model : 'a vehicle'}`,
            time: formatTimeAgo(new Date(inquiry.createdAt))
          })
        })

        // Sort by date (most recent first)
        combinedActivity.sort((a, b) => {
          const timeA = parseTimeAgo(a.time)
          const timeB = parseTimeAgo(b.time)
          return timeA - timeB
        })

        setRecentActivity(combinedActivity)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Helper function to format timestamps as "X time ago"
  const formatTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    
    if (diffDay > 0) {
      return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`
    }
    if (diffHour > 0) {
      return `${diffHour} hours ago`
    }
    if (diffMin > 0) {
      return `${diffMin} minutes ago`
    }
    return 'Just now'
  }

  // Helper function to convert "X time ago" back to timestamp for sorting
  const parseTimeAgo = (timeAgo: string): number => {
    const now = new Date().getTime()
    
    if (timeAgo === 'Just now') return 0
    
    const match = timeAgo.match(/(\d+)\s+(\w+)\s+ago/)
    if (!match) return now
    
    const amount = parseInt(match[1])
    const unit = match[2]
    
    if (unit.includes('minute')) return amount * 60 * 1000
    if (unit.includes('hour')) return amount * 60 * 60 * 1000
    if (unit.includes('day')) return amount * 24 * 60 * 60 * 1000
    if (timeAgo === 'Yesterday') return 24 * 60 * 60 * 1000
    
    return now
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full">
        <div className="flex flex-col">
          <AdminHeader title="Dashboard" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading dashboard data...</span>
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
          <AdminHeader title="Dashboard" />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <AdminHeader title="Dashboard" />

        <main className="flex-1 p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Inventory</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryCount}</div>
                <p className="text-xs text-muted-foreground">+{inventoryDiff} from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Inquiries</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inquiryCount}</div>
                <p className="text-xs text-muted-foreground">+{inquiryDiff} since yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
                <p className="text-xs text-muted-foreground">+{viewsDiff} today</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((item, index) => (
                      <div key={item.id} className="flex items-start gap-4">
                        <div className="rounded-full p-2 bg-blue-100 text-blue-600">{item.icon}</div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
