import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🔍 Checking database connection and data...")

  try {
    // Test connection
    await prisma.$connect()
    console.log("✅ Database connected successfully")

    // Check users
    const userCount = await prisma.user.count()
    console.log(`👤 Users in database: ${userCount}`)

    // Check trucks
    const truckCount = await prisma.truck.count()
    console.log(`🚛 Trucks in database: ${truckCount}`)

    // Check inquiries
    const inquiryCount = await prisma.inquiry.count()
    console.log(`📧 Inquiries in database: ${inquiryCount}`)

    // Check financing applications
    const financingCount = await prisma.financingApplication.count()
    console.log(`💰 Financing applications in database: ${financingCount}`)

    // List all trucks
    const trucks = await prisma.truck.findMany({
      select: {
        stockNumber: true,
        year: true,
        make: true,
        model: true,
        trim: true,
        price: true,
        status: true,
      },
    })

    console.log("\n🚛 Available trucks:")
    trucks.forEach((truck) => {
      console.log(
        `  • ${truck.year} ${truck.make} ${truck.model} ${truck.trim} - $${truck.price.toLocaleString()} (${truck.stockNumber}) - ${truck.status}`,
      )
    })

    console.log("\n🎉 Database check completed!")
  } catch (error) {
    console.error("❌ Error checking database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
