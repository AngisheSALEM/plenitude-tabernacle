import { PrismaClient } from "../generated/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const { Pool } = pg

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: pg.Pool | undefined
}

function createPrismaClient() {
  const pool = globalForPrisma.pool ?? new Pool({ connectionString: process.env.DATABASE_URL })
  if (process.env.NODE_ENV !== "production") globalForPrisma.pool = pool

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
