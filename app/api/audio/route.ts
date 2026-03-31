import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (category && category !== "all") where.category = category
    if (featured === "true") where.isFeatured = true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { speaker: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const [audios, total] = await Promise.all([
      prisma.audio.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.audio.count({ where }),
    ])

    return NextResponse.json({
      audios,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("[AUDIO GET]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, speaker, date, duration, fileUrl, category, isFeatured } = body

    if (!title || !speaker || !category) {
      return NextResponse.json(
        { error: "Titre, prédicateur et catégorie sont obligatoires" },
        { status: 400 }
      )
    }

    const audio = await prisma.audio.create({
      data: {
        title,
        description,
        speaker,
        date: date ? new Date(date) : new Date(),
        duration,
        fileUrl,
        category,
        isFeatured: isFeatured ?? false,
      },
    })

    return NextResponse.json(audio, { status: 201 })
  } catch (error) {
    console.error("[AUDIO POST]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
