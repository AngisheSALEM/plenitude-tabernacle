import { PrismaClient } from './generated/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.video.count()
  console.log(`Total videos in database: ${count}`)
  const videos = await prisma.video.findMany({
    take: 10,
  })
  console.log('Videos:', JSON.stringify(videos, null, 2))
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
