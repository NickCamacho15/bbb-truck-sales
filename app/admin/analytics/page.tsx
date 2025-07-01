"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminHeader } from "@/components/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  LineChart,
  Loader2,
  ArrowUpRight,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react"

interface ViewsData {
  date: string
  count: number
}

interface TruckViewData {
  id: string
  title: string
  year: number
  make: string
  model: string
  views: number
}

interface SoldTruckData {
  id: string
  title: string
  year: number
  make: string
  model: string
  price: number
  soldDate: string
}

interface AnalyticsData {
  totalViews: number
  topViewedTrucks: TruckViewData[]
  soldTrucks: SoldTruckData[]
  viewsByDay: ViewsData[]
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("week")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/analytics?period=${activeTab}`)
        
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        
        const data = await response.json()
        setAnalyticsData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics")
        console.error("Error loading analytics:", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
  }, [activeTab])
  
  // Calculate daily average
  const calculateDailyAverage = () => {
    if (!analyticsData?.viewsByDay || analyticsData.viewsByDay.length === 0) return 0
    
    const sum = analyticsData.viewsByDay.reduce((acc, day) => acc + day.count, 0)
    return Math.round(sum / analyticsData.viewsByDay.length)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader title="Analytics" />
      
      <main className="flex-1 p-6">
        <Tabs defaultValue="week" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Truck Analytics</h2>
            <TabsList>
              <TabsTrigger value="day">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-80">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading analytics data...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-80">
              <div className="flex flex-col items-center gap-2 text-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
                <h3 className="text-xl font-bold">Failed to load analytics</h3>
                <p className="text-muted-foreground">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData?.totalViews || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activeTab === "day" ? "Today" 
                        : activeTab === "week" ? "Past 7 days" 
                        : activeTab === "month" ? "Past 30 days" 
                        : "All time"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{calculateDailyAverage()}</div>
                    <p className="text-xs text-muted-foreground">Views per day</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Most Viewed</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData?.topViewedTrucks?.[0]?.views || 0}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {analyticsData?.topViewedTrucks?.[0]?.title || "No data"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Trucks Sold</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analyticsData?.soldTrucks?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Total trucks sold</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                {/* Top Viewed Trucks Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Viewed Trucks</CardTitle>
                    <CardDescription>
                      Most popular inventory items
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.topViewedTrucks.slice(0, 5).map((truck, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {truck.year} {truck.make} {truck.model}
                            </p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {truck.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <Eye className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                              <span className="text-sm font-medium">{truck.views}</span>
                            </div>
                            <Link href={`/inventory/${truck.id}`} target="_blank">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="sr-only">View truck</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                      
                      {(!analyticsData?.topViewedTrucks || analyticsData.topViewedTrucks.length === 0) && (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          No view data available
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {analyticsData?.topViewedTrucks && analyticsData.topViewedTrucks.length > 5 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All
                      </Button>
                    )}
                  </CardFooter>
                </Card>
                
                {/* Sold Trucks Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recently Sold Trucks</CardTitle>
                    <CardDescription>
                      Trucks with "Sold" status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData?.soldTrucks.slice(0, 5).map((truck, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {truck.year} {truck.make} {truck.model}
                            </p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {truck.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <span className="text-sm font-medium">${truck.price.toLocaleString()}</span>
                            </div>
                            <Link href={`/inventory/${truck.id}`} target="_blank">
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ArrowUpRight className="h-4 w-4" />
                                <span className="sr-only">View truck</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                      
                      {(!analyticsData?.soldTrucks || analyticsData.soldTrucks.length === 0) && (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          No sold trucks available
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {analyticsData?.soldTrucks && analyticsData.soldTrucks.length > 5 && (
                      <Button variant="outline" size="sm" className="w-full">
                        View All
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
} 