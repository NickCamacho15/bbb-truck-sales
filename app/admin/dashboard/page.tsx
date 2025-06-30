"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { BarChart3, DollarSign, Package, ShoppingCart, TrendingUp, Truck, Users } from "lucide-react"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <AdminSidebar activePage="dashboard" />

      <div className="flex flex-col">
        <AdminHeader title="Dashboard" />

        <main className="flex-1 p-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Sales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Inquiries</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+3 since yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <p className="text-xs text-muted-foreground">+2 since last week</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Sales Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-md">
                      <BarChart3 className="h-16 w-16 text-muted" />
                      <span className="ml-2 text-muted">Sales chart will appear here</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          icon: <Truck className="h-4 w-4" />,
                          title: "New Truck Added",
                          description: "2023 Ford F-150 Lariat added to inventory",
                          time: "2 hours ago",
                        },
                        {
                          icon: <Users className="h-4 w-4" />,
                          title: "New Inquiry",
                          description: "John Doe inquired about F-250 Super Duty",
                          time: "5 hours ago",
                        },
                        {
                          icon: <DollarSign className="h-4 w-4" />,
                          title: "Sale Completed",
                          description: "2022 Ford Ranger sold to Sarah Johnson",
                          time: "Yesterday",
                        },
                        {
                          icon: <TrendingUp className="h-4 w-4" />,
                          title: "Price Updated",
                          description: "Price updated for 3 trucks in inventory",
                          time: "2 days ago",
                        },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="rounded-full p-2 bg-blue-100 text-blue-600">{item.icon}</div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory by Model</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { model: "F-150", count: 18, percentage: 42 },
                        { model: "F-250/F-350", count: 12, percentage: 28 },
                        { model: "Ranger", count: 8, percentage: 19 },
                        { model: "Maverick", count: 4, percentage: 11 },
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{item.model}</span>
                            <span className="text-sm text-muted-foreground">{item.count} trucks</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href="/admin/inventory/new">
                        <Button variant="outline" className="w-full justify-start">
                          <Package className="mr-2 h-4 w-4" />
                          Add Truck
                        </Button>
                      </Link>
                      <Link href="/admin/inquiries">
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="mr-2 h-4 w-4" />
                          View Inquiries
                        </Button>
                      </Link>
                      <Link href="/admin/inventory">
                        <Button variant="outline" className="w-full justify-start">
                          <Truck className="mr-2 h-4 w-4" />
                          Manage Inventory
                        </Button>
                      </Link>
                      <Link href="/admin/reports">
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Sales Report
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Update inventory prices",
                          dueDate: "Today",
                          priority: "High",
                        },
                        {
                          title: "Follow up with potential buyers",
                          dueDate: "Tomorrow",
                          priority: "Medium",
                        },
                        {
                          title: "Schedule new truck photoshoot",
                          dueDate: "Jun 10",
                          priority: "Low",
                        },
                      ].map((task, index) => (
                        <div key={index} className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium">{task.title}</p>
                            <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                          </div>
                          <Badge priority={task.priority} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="analytics"
              className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md"
            >
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted" />
                <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                <p className="text-muted-foreground">Detailed analytics will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
              <div className="text-center">
                <TrendingUp className="h-16 w-16 mx-auto text-muted" />
                <h3 className="mt-4 text-lg font-medium">Reports Dashboard</h3>
                <p className="text-muted-foreground">Generated reports will appear here</p>
              </div>
            </TabsContent>

            <TabsContent
              value="notifications"
              className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md"
            >
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto text-muted" />
                <h3 className="mt-4 text-lg font-medium">Notifications Dashboard</h3>
                <p className="text-muted-foreground">System notifications will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

function Badge({ priority }: { priority: string }) {
  const getColor = () => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return <span className={`text-xs px-2 py-1 rounded-full ${getColor()}`}>{priority}</span>
}
