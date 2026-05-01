export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const active = searchParams.get("active")
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "20")
    const skip = (page - 1) * limit

    const where: any = {}
    if (active === "true") where.isActive = true
    if (active === "false") where.isActive = false

    const [evenements, total] = await Promise.all([
      prisma.evenement.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.evenement.count({ where }),
    ])

    return NextResponse.json({
      evenements,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("[EVENEMENTS GET]", error)
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
    const { title, content, imageUrl, isActive, date, location } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "Titre et contenu sont obligatoires" },
        { status: 400 }
      )
    }

    const evenement = await prisma.evenement.create({
      data: {
        title,
        content,
        imageUrl,
        isActive: isActive ?? true,
        date: date ? new Date(date) : null,
        location,
      },
    })

    return NextResponse.json(evenement, { status: 201 })
  } catch (error) {
    console.error("[EVENEMENTS POST]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
