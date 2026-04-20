const { prisma } = require('./lib/prisma.ts')

async function main() {
  try {
    const count = await prisma.video.count()
    console.log(`Total videos in database: ${count}`)
  } catch (err) {
    console.error('Error:', err)
  }
}

main()
