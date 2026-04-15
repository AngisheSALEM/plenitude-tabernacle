import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const email = "admin@test.com"
  const password = "password123"
  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: "ADMIN",
      password: hashedPassword,
    },
    create: {
      email,
      firstName: "Admin",
      lastName: "User",
      password: hashedPassword,
      role: "ADMIN",
    },
  })
  console.log("Admin user created/updated:", user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
