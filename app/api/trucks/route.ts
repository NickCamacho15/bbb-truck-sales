import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

const createTruckSchema = z.object({
  title: z.string().min(1, "Title is required"),
  listingType: z.enum(["SALE", "LEASE"]).default("SALE"),
  price: z.number().nonnegative("Price cannot be negative"),
  monthlyPrice: z.number().positive("Monthly price must be positive").optional().nullable(),
  leaseTermMonths: z.number().positive("Lease term must be positive").optional().nullable(),
  downPayment: z.number().nonnegative("Down payment must be non-negative").optional().nullable(),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  trim: z.string().min(1, "Trim is required"),
  mileage: z.number().min(0, "Mileage must be non-negative"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  drivetrain: z.string().min(1, "Drivetrain is required"),
  color: z.string().min(1, "Color is required"),
  vin: z.string().min(1, "VIN is required"),
  stockNumber: z.string().min(1, "Stock number is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["AVAILABLE", "PENDING_SALE", "SOLD"]).optional(),
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
}).refine((data) => {
  // For SALE listings, price must be positive
  // For LEASE listings, price can be zero but monthlyPrice must be provided
  if (data.listingType === "SALE") {
    return data.price > 0;
  } else {
    return data.monthlyPrice !== undefined && data.monthlyPrice !== null && data.monthlyPrice > 0;
  }
}, {
  message: "Sale listings require a positive price. Lease listings require a positive monthly price.",
  path: ["price"], // This will show the error on the price field
});

// GET /api/trucks - List all trucks with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const model = searchParams.get("model")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const listingType = searchParams.get("listingType")

    const where: any = {}

    if (status && status !== "all") {
      where.status = status.includes(",") 
        ? { in: status.split(",") } 
        : status;
    }

    if (model && model !== "all") {
      where.model = model
    }

    if (listingType && listingType !== "all") {
      where.listingType = listingType
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { make: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ]
    }

    if (featured === "true") {
      where.featured = true
      // Always exclude SOLD trucks from featured results
      where.status = { not: "SOLD" }
    }

    const [trucks, total] = await Promise.all([
      prisma.truck.findMany({
        where,
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
          features: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.truck.count({ where }),
    ])

    return NextResponse.json({
      trucks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching trucks:", error)
    return NextResponse.json({ error: "Failed to fetch trucks" }, { status: 500 })
  }
}

// POST /api/trucks - Create a new truck (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = createTruckSchema.parse(body)

    const { images = [], features = [], ...truckData } = data

    const truck = await prisma.truck.create({
      data: {
        ...truckData,
        images: {
          create: images.map((url, index) => ({
            imageUrl: url,
            isPrimary: index === 0,
            sortOrder: index,
          })),
        },
        features: {
          create: features.map((name) => ({
            featureName: name,
          })),
        },
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        features: true,
      },
    })

    return NextResponse.json(truck, { status: 201 })
  } catch (error) {
    console.error("Error creating truck:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create truck" }, { status: 500 })
  }
}
