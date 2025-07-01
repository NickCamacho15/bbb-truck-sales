import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { z } from "zod"

const updateInquirySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]).optional(),
})

// GET /api/inquiries/[id] - Get a single inquiry (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: { id: params.id },
      include: {
        truck: {
          select: {
            id: true,
            title: true,
            year: true,
            make: true,
            model: true,
          },
        },
      },
    })

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error("Error fetching inquiry:", error)
    return NextResponse.json({ error: "Failed to fetch inquiry" }, { status: 500 })
  }
}

// PATCH /api/inquiries/[id] - Update an inquiry (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = updateInquirySchema.parse(body)

    const inquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data,
      include: {
        truck: {
          select: {
            id: true,
            title: true,
            year: true,
            make: true,
            model: true,
          },
        },
      },
    })

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error("Error updating inquiry:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}

// DELETE /api/inquiries/[id] - Delete an inquiry (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure params is properly handled
    const id = params.id
    
    const inquiry = await prisma.inquiry.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Inquiry deleted successfully" })
  } catch (error) {
    console.error("Error deleting inquiry:", error)
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 })
  }
} 