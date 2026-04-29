import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import * as fs from 'fs'
import * as path from 'path'

const { Pool } = pg

async function main() {
  const filePath = path.join(process.cwd(), 'cantiques.json')
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log(`Starting to seed ${data.length} cantiques...`)

  let connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
     console.error("CRITICAL: DATABASE_URL is missing.");
     process.exit(1);
  }

  if (!connectionString.includes("sslmode=")) {
    connectionString += connectionString.includes("?") ? "&sslmode=verify-full" : "?sslmode=verify-full"
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  let count = 0;
  for (const hymn of data) {
    const category = hymn.category || "Collection"
    const id = hymn.id.toString()

    try {
      await prisma.cantique.upsert({
        where: { id: id },
        update: {
          title: hymn.title.toUpperCase(),
          reference: hymn.reference,
          category: category,
          lyrics: hymn.lyrics,
          chorus: hymn.chorus,
        },
        create: {
          id: id,
          title: hymn.title.toUpperCase(),
          reference: hymn.reference,
          category: category,
          lyrics: hymn.lyrics,
          chorus: hymn.chorus,
        },
      })
      count++;
    } catch (e) {
      console.error(`Failed to upsert cantique ${id}:`, e.message)
      if (e.code === 'ECONNREFUSED') {
        console.error("Database connection error. Stopping.");
        break
      }
    }
  }

  console.log(`Seeding process finished. ${count} cantiques processed.`);
  await prisma.$disconnect()
  await pool.end()
}

main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e)
    process.exit(1)
  })
