import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET /api/analytics - Get analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated and an admin
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "week" // day, week, month, all
    
    // Calculate the date range based on period
    const now = new Date()
    let startDate = new Date()
    
    if (period === "day") {
      startDate.setDate(now.getDate() - 1)
    } else if (period === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1)
    } else if (period === "all") {
      startDate = new Date(0) // Beginning of time
    }
    
    // Get total views in the period
    const viewsCountResult = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM "truck_views"
      WHERE "timestamp" >= ${startDate}
    `
    const totalViews = Number((viewsCountResult as any)[0]?.count || 0)
    
    // Get trucks with most views
    const trucksWithViews = await prisma.$queryRaw`
      SELECT t.id, t.title, t.year, t.make, t.model, COUNT(tv.id) as views
      FROM "trucks" t
      JOIN "truck_views" tv ON t.id = tv."truckId"
      WHERE tv.timestamp >= ${startDate}
      GROUP BY t.id, t.title, t.year, t.make, t.model
      ORDER BY views DESC
      LIMIT 10
    `
    
    // Get sold trucks
    const soldTrucks = await prisma.truck.findMany({
      where: {
        status: "SOLD"
      },
      select: {
        id: true,
        title: true,
        year: true,
        make: true,
        model: true,
        price: true,
        listingType: true,
        monthlyPrice: true,
        updatedAt: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 10
    })
    
    // Get views per day for chart data
    let viewsByDay: { date: string; count: number }[] = []
    
    // Determine how many days to look back based on period
    let daysToLookBack = 7
    if (period === "day") {
      daysToLookBack = 1
    } else if (period === "month") {
      daysToLookBack = 30
    } else if (period === "all") {
      daysToLookBack = 90 // Cap at 90 days for "all" to keep data manageable
    }
    
    // Generate the daily view counts
    for (let i = daysToLookBack - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const dailyCountResult = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM "truck_views"
        WHERE "timestamp" >= ${date} AND "timestamp" < ${nextDate}
      `
      const count = Number((dailyCountResult as any)[0]?.count || 0)
      
      const dateStr = date.toISOString().split('T')[0]
      viewsByDay.push({ date: dateStr, count })
    }
    
    return NextResponse.json({
      totalViews,
      topViewedTrucks: Array.isArray(trucksWithViews) 
        ? trucksWithViews.map((truck: any) => ({
            id: truck.id,
            title: truck.title,
            year: truck.year,
            make: truck.make,
            model: truck.model,
            views: Number(truck.views)
          }))
        : [],
      soldTrucks: soldTrucks.map(truck => ({
        id: truck.id,
        title: truck.title,
        year: truck.year,
        make: truck.make,
        model: truck.model,
        price: truck.listingType === "LEASE" ? (truck.monthlyPrice || truck.price) : truck.price,
        soldDate: truck.updatedAt,
        listingType: truck.listingType
      })),
      viewsByDay
    })
    
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
} 