import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@bbbtrucksales.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  })

  console.log("✅ Created admin user:", adminUser.username)

  // Create sample trucks
  const truck1 = await prisma.truck.upsert({
    where: { vin: "1FTEW1EP5NKD12345" },
    update: {},
    create: {
      title: "2022 Ford F-150 XLT",
      price: 42999,
      year: 2022,
      make: "Ford",
      model: "F-150",
      trim: "XLT",
      mileage: 15420,
      fuelType: "Gasoline",
      transmission: "Automatic",
      drivetrain: "4WD",
      color: "Oxford White",
      vin: "1FTEW1EP5NKD12345",
      stockNumber: "F22-0123",
      description:
        "This 2022 Ford F-150 XLT is in excellent condition with low mileage. It features the powerful 3.5L EcoBoost V6 engine, 4x4 drivetrain, and comes loaded with features including SYNC 4 infotainment system, 360-degree camera, and advanced safety features.",
      status: "AVAILABLE",
      featured: true,
      images: {
        create: [
          {
            imageUrl: "/placeholder.svg?height=600&width=800",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            imageUrl: "/placeholder.svg?height=600&width=800",
            isPrimary: false,
            sortOrder: 1,
          },
          {
            imageUrl: "/placeholder.svg?height=600&width=800",
            isPrimary: false,
            sortOrder: 2,
          },
        ],
      },
      features: {
        create: [
          { featureName: "SYNC 4 with 12-inch Touchscreen" },
          { featureName: "360-Degree Camera" },
          { featureName: "Pro Power Onboard Generator" },
          { featureName: "Lane-Keeping System" },
          { featureName: "Pre-Collision Assist with Automatic Emergency Braking" },
          { featureName: "Blind Spot Information System" },
          { featureName: "LED Headlamps and Taillamps" },
          { featureName: "Remote Start System" },
          { featureName: "Power-Adjustable Pedals" },
          { featureName: "Class IV Trailer Hitch" },
        ],
      },
    },
  })

  const truck2 = await prisma.truck.upsert({
    where: { vin: "1FT7W2BT5MED12345" },
    update: {},
    create: {
      title: "2021 Ford F-250 Super Duty Lariat",
      price: 56799,
      year: 2021,
      make: "Ford",
      model: "F-250",
      trim: "Lariat",
      mileage: 22150,
      fuelType: "Diesel",
      transmission: "Automatic",
      drivetrain: "4WD",
      color: "Agate Black",
      vin: "1FT7W2BT5MED12345",
      stockNumber: "F21-0456",
      description:
        "This 2021 Ford F-250 Super Duty Lariat is a powerful work truck with the legendary Power Stroke diesel engine. Perfect for heavy-duty towing and hauling with luxury appointments.",
      status: "AVAILABLE",
      featured: true,
      images: {
        create: [
          {
            imageUrl: "/placeholder.svg?height=600&width=800",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            imageUrl: "/placeholder.svg?height=600&width=800",
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      features: {
        create: [
          { featureName: "Power Stroke 6.7L V8 Turbo Diesel" },
          { featureName: "SYNC 4 with 12-inch Touchscreen" },
          { featureName: "Leather-Appointed Seating" },
          { featureName: "Heated and Ventilated Front Seats" },
          { featureName: "Trailer Tow Package" },
          { featureName: "FX4 Off-Road Package" },
          { featureName: "Adaptive Cruise Control" },
          { featureName: "360-Degree Camera System" },
        ],
      },
    },
  })

  const truck3 = await prisma.truck.upsert({
    where: { vin: "1FTER4EH5NLD12345" },
    update: {},
    create: {
      title: "2023 Ford Ranger XLT",
      price: 36500,
      year: 2023,
      make: "Ford",
      model: "Ranger",
      trim: "XLT",
      mileage: 8750,
      fuelType: "Gasoline",
      transmission: "Automatic",
      drivetrain: "4WD",
      color: "Velocity Blue",
      vin: "1FTER4EH5NLD12345",
      stockNumber: "R23-0789",
      description:
        "This 2023 Ford Ranger XLT is perfect for both work and adventure. Compact yet capable, with modern technology and rugged durability. Low mileage and excellent condition.",
      status: "AVAILABLE",
      featured: true,
      images: {
        create: [
          {
            imageUrl: "/placeholder.svg?height=600&width=800",
            isPrimary: true,
            sortOrder: 0,
          },
          {
            imageUrl: "/placeholder.svg?height=600&width=800",
            isPrimary: false,
            sortOrder: 1,
          },
        ],
      },
      features: {
        create: [
          { featureName: "2.3L EcoBoost Engine" },
          { featureName: "SYNC 3 with 8-inch Touchscreen" },
          { featureName: "Terrain Management System" },
          { featureName: "Trail Control" },
          { featureName: "FordPass Connect" },
          { featureName: "Pre-Collision Assist" },
          { featureName: "Blind Spot Information System" },
          { featureName: "Rear View Camera" },
        ],
      },
    },
  })

  // Create sample inquiries
  const inquiry1 = await prisma.inquiry.create({
    data: {
      truckId: truck1.id,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      message:
        "I'm interested in this F-150. Can we schedule a test drive? I'd also like to know about financing options.",
      inquiryType: "TEST_DRIVE",
      status: "NEW",
    },
  })

  const inquiry2 = await prisma.inquiry.create({
    data: {
      truckId: truck2.id,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 987-6543",
      message: "Looking for a heavy-duty truck for my construction business. What's the towing capacity on this F-250?",
      inquiryType: "SALES",
      status: "NEW",
    },
  })

  // Create a financing application
  const financingApp = await prisma.financingApplication.create({
    data: {
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike.wilson@example.com",
      phone: "(555) 456-7890",
      annualIncome: 75000,
      downPayment: 10000,
      financingType: "traditional",
      truckInterest: "pickup",
      additionalInfo: "Looking for a reliable work truck for my landscaping business.",
      status: "PENDING",
    },
  })

  console.log("✅ Created sample trucks:")
  console.log(`  - ${truck1.title} (${truck1.stockNumber})`)
  console.log(`  - ${truck2.title} (${truck2.stockNumber})`)
  console.log(`  - ${truck3.title} (${truck3.stockNumber})`)

  console.log("✅ Created sample inquiries:")
  console.log(`  - ${inquiry1.name} - ${inquiry1.inquiryType}`)
  console.log(`  - ${inquiry2.name} - ${inquiry2.inquiryType}`)

  console.log("✅ Created financing application for:", financingApp.firstName, financingApp.lastName)

  console.log("🎉 Database seeding completed successfully!")
  console.log("")
  console.log("🔑 Admin Login Credentials:")
  console.log("   Username: admin")
  console.log("   Password: admin123")
  console.log("   URL: http://localhost:3000/admin")
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
