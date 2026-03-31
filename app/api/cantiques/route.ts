import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "50")
    const skip = (page - 1) * limit

    const where: any = {}
    if (category && category !== "Toutes") where.category = category
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { reference: { contains: search, mode: "insensitive" } },
      ]
    }

    const [cantiques, total] = await Promise.all([
      prisma.cantique.findMany({
        where,
        orderBy: { title: "asc" },
        skip,
        take: limit,
      }),
      prisma.cantique.count({ where }),
    ])

    return NextResponse.json({
      cantiques,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("[CANTIQUES GET]", error)
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
    const { title, reference, category, lyrics, chorus } = body

    if (!title || !reference || !category || !lyrics) {
      return NextResponse.json(
        { error: "Titre, référence, catégorie et paroles sont obligatoires" },
        { status: 400 }
      )
    }

    const cantique = await prisma.cantique.create({
      data: {
        title: title.toUpperCase(),
        reference,
        category,
        lyrics,
        chorus: chorus ?? null,
      },
    })

    return NextResponse.json(cantique, { status: 201 })
  } catch (error) {
    console.error("[CANTIQUES POST]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
