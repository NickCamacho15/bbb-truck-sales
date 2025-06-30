import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

const updateTruckSchema = z.object({
  title: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  make: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  trim: z.string().min(1).optional(),
  mileage: z.number().min(0).optional(),
  fuelType: z.string().min(1).optional(),
  transmission: z.string().min(1).optional(),
  drivetrain: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
  vin: z.string().min(1).optional(),
  stockNumber: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["AVAILABLE", "PENDING_SALE", "SOLD"]).optional(),
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
})

// GET /api/trucks/[id] - Get a specific truck
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const truck = await prisma.truck.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
        features: true,
      },
    })

    if (!truck) {
      return NextResponse.json({ error: "Truck not found" }, { status: 404 })
    }

    return NextResponse.json(truck)
  } catch (error) {
    console.error("Error fetching truck:", error)
    return NextResponse.json({ error: "Failed to fetch truck" }, { status: 500 })
  }
}

// PUT /api/trucks/[id] - Update a truck (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = updateTruckSchema.parse(body)

    const { images, features, ...truckData } = data

    // Start a transaction to update truck and related data
    const truck = await prisma.$transaction(async (tx) => {
      // Update the truck
      const updatedTruck = await tx.truck.update({
        where: { id: params.id },
        data: truckData,
      })

      // Update images if provided
      if (images !== undefined) {
        // Delete existing images
        await tx.truckImage.deleteMany({
          where: { truckId: params.id },
        })

        // Create new images
        if (images.length > 0) {
          await tx.truckImage.createMany({
            data: images.map((url, index) => ({
              truckId: params.id,
              imageUrl: url,
              isPrimary: index === 0,
              sortOrder: index,
            })),
          })
        }
      }

      // Update features if provided
      if (features !== undefined) {
        // Delete existing features
        await tx.truckFeature.deleteMany({
          where: { truckId: params.id },
        })

        // Create new features
        if (features.length > 0) {
          await tx.truckFeature.createMany({
            data: features.map((name) => ({
              truckId: params.id,
              featureName: name,
            })),
          })
        }
      }

      // Return the updated truck with relations
      return tx.truck.findUnique({
        where: { id: params.id },
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
          },
          features: true,
        },
      })
    })

    return NextResponse.json(truck)
  } catch (error) {
    console.error("Error updating truck:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update truck" }, { status: 500 })
  }
}

// DELETE /api/trucks/[id] - Delete a truck (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.truck.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Truck deleted successfully" })
  } catch (error) {
    console.error("Error deleting truck:", error)
    return NextResponse.json({ error: "Failed to delete truck" }, { status: 500 })
  }
}
