import { execSync } from "child_process"

console.log("🚀 Starting BBB Truck Sales database setup...")

try {
  console.log("📦 Installing dependencies...")
  execSync("npm install", { stdio: "inherit" })

  console.log("🔧 Generating Prisma client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  console.log("📊 Pushing database schema...")
  execSync("npx prisma db push", { stdio: "inherit" })

  console.log("🌱 Setting up database with sample data...")
  execSync("npm run db:setup", { stdio: "inherit" })

  console.log("✅ Checking database setup...")
  execSync("npm run db:check", { stdio: "inherit" })

  console.log("🎉 Setup completed successfully!")
  console.log("\n🚀 You can now run: npm run dev")
  console.log("🔐 Admin login: username=admin, password=admin123")
} catch (error) {
  console.error("❌ Setup failed:", error)
  process.exit(1)
}
