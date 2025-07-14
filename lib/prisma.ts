import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

console.log('Prisma: Loaded DATABASE_URL:', process.env.DATABASE_URL);
console.log('Prisma: Loaded DIRECT_DATABASE_URL:', process.env.DIRECT_DATABASE_URL);

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
