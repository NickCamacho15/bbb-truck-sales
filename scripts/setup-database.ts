import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Setting up database...")

  try {
    // Test connection
    await prisma.$connect()
    console.log("✅ Database connected successfully")

    // Create admin user
    console.log("👤 Creating admin user...")
    const hashedPassword = await bcrypt.hash("admin123", 10)

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
    console.log("✅ Admin user created:", adminUser.username)

    // Create sample trucks
    console.log("🚛 Creating sample trucks...")

    const truck1 = await prisma.truck.upsert({
      where: { stockNumber: "F22-0123" },
      update: {},
      create: {
        make: "Ford",
        model: "F-150",
        year: 2022,
        trim: "XLT",
        price: 42999,
        mileage: 15000,
        stockNumber: "F22-0123",
        vin: "1FTFW1ET5NFC12345",
        exteriorColor: "Oxford White",
        interiorColor: "Black",
        transmission: "Automatic",
        drivetrain: "4WD",
        fuelType: "Gasoline",
        engine: "3.5L V6 EcoBoost",
        bodyStyle: "SuperCrew Cab",
        status: "AVAILABLE",
        description:
          "This 2022 Ford F-150 XLT is in excellent condition with low miles. Features include 4WD, EcoBoost engine, and crew cab configuration.",
        features: {
          create: [
            { name: "4-Wheel Drive" },
            { name: "EcoBoost Engine" },
            { name: "Crew Cab" },
            { name: "Automatic Transmission" },
            { name: "Power Windows" },
            { name: "Power Locks" },
            { name: "Air Conditioning" },
            { name: "Cruise Control" },
          ],
        },
        images: {
          create: [
            { url: "/placeholder.jpg", altText: "2022 Ford F-150 XLT - Front View", isPrimary: true },
            { url: "/placeholder.jpg", altText: "2022 Ford F-150 XLT - Side View", isPrimary: false },
            { url: "/placeholder.jpg", altText: "2022 Ford F-150 XLT - Interior", isPrimary: false },
          ],
        },
      },
    })

    const truck2 = await prisma.truck.upsert({
      where: { stockNumber: "F21-0456" },
      update: {},
      create: {
        make: "Ford",
        model: "F-250 Super Duty",
        year: 2021,
        trim: "Lariat",
        price: 56799,
        mileage: 28000,
        stockNumber: "F21-0456",
        vin: "1FT7W2BT5MED67890",
        exteriorColor: "Magnetic Metallic",
        interiorColor: "Camel",
        transmission: "Automatic",
        drivetrain: "4WD",
        fuelType: "Diesel",
        engine: "6.7L V8 Power Stroke Diesel",
        bodyStyle: "Crew Cab",
        status: "AVAILABLE",
        description:
          "Powerful 2021 Ford F-250 Super Duty Lariat with diesel engine. Perfect for heavy-duty work and towing.",
        features: {
          create: [
            { name: "4-Wheel Drive" },
            { name: "Power Stroke Diesel" },
            { name: "Crew Cab" },
            { name: "Leather Seats" },
            { name: "Navigation System" },
            { name: "Heated Seats" },
            { name: "Tow Package" },
            { name: "Backup Camera" },
          ],
        },
        images: {
          create: [
            { url: "/placeholder.jpg", altText: "2021 Ford F-250 Super Duty Lariat - Front View", isPrimary: true },
            { url: "/placeholder.jpg", altText: "2021 Ford F-250 Super Duty Lariat - Side View", isPrimary: false },
          ],
        },
      },
    })

    const truck3 = await prisma.truck.upsert({
      where: { stockNumber: "R23-0789" },
      update: {},
      create: {
        make: "Ford",
        model: "Ranger",
        year: 2023,
        trim: "XLT",
        price: 36500,
        mileage: 8500,
        stockNumber: "R23-0789",
        vin: "1FTER4FH5PLA11111",
        exteriorColor: "Velocity Blue Metallic",
        interiorColor: "Ebony",
        transmission: "Automatic",
        drivetrain: "4WD",
        fuelType: "Gasoline",
        engine: "2.3L I4 EcoBoost",
        bodyStyle: "SuperCrew",
        status: "AVAILABLE",
        description:
          "Nearly new 2023 Ford Ranger XLT with low miles. Great mid-size truck with excellent fuel economy.",
        features: {
          create: [
            { name: "4-Wheel Drive" },
            { name: "EcoBoost Engine" },
            { name: "SuperCrew Cab" },
            { name: "SYNC 3" },
            { name: "Apple CarPlay" },
            { name: "Android Auto" },
            { name: "Rear View Camera" },
            { name: "Terrain Management System" },
          ],
        },
        images: {
          create: [
            { url: "/placeholder.jpg", altText: "2023 Ford Ranger XLT - Front View", isPrimary: true },
            { url: "/placeholder.jpg", altText: "2023 Ford Ranger XLT - Interior", isPrimary: false },
          ],
        },
      },
    })

    console.log("✅ Sample trucks created")

    // Create sample inquiries
    console.log("📧 Creating sample inquiries...")

    await prisma.inquiry.createMany({
      data: [
        {
          firstName: "John",
          lastName: "Smith",
          email: "john.smith@email.com",
          phone: "555-0123",
          message:
            "I am interested in the 2022 Ford F-150 XLT. Can you provide more information about financing options?",
          truckId: truck1.id,
          status: "NEW",
        },
        {
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.j@email.com",
          phone: "555-0456",
          message: "Is the 2021 F-250 Super Duty still available? I would like to schedule a test drive.",
          truckId: truck2.id,
          status: "CONTACTED",
        },
      ],
    })

    console.log("✅ Sample inquiries created")

    // Create sample financing application
    console.log("💰 Creating sample financing application...")

    await prisma.financingApplication.create({
      data: {
        firstName: "Mike",
        lastName: "Wilson",
        email: "mike.wilson@email.com",
        phone: "555-0789",
        ssn: "123-45-6789",
        dateOfBirth: new Date("1985-06-15"),
        annualIncome: 75000,
        employmentStatus: "EMPLOYED",
        employer: "ABC Construction",
        yearsAtJob: 5,
        monthlyRent: 1200,
        creditScore: 720,
        downPayment: 5000,
        loanAmount: 37500,
        loanTerm: 60,
        truckId: truck3.id,
        status: "PENDING",
      },
    })

    console.log("✅ Sample financing application created")
    console.log("🎉 Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
