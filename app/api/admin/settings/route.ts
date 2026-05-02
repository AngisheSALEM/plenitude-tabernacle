import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
    }

    const body = await req.json()
    const {
      churchName,
      description,
      address,
      phone,
      email,
      website,
      facebook,
      youtube,
      instagram,
      twitter,
      schedule
    } = body

    const settings = await prisma.setting.upsert({
      where: { id: "singleton" },
      update: {
        churchName,
        description,
        address,
        phone,
        email,
        website,
        facebook,
        youtube,
        instagram,
        twitter,
        schedule,
      },
      create: {
        id: "singleton",
        churchName,
        description,
        address,
        phone,
        email,
        website,
        facebook,
        youtube,
        instagram,
        twitter,
        schedule,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("[ADMIN_SETTINGS_POST]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
