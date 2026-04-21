export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        birthDate: true,
        bio: true,
        avatar: true,
        role: true,
        joinDate: true,
        favoriteVideos: {
          include: { video: { select: { id: true, title: true, speaker: true, date: true } } },
        },
        favoriteAudios: {
          include: { audio: { select: { id: true, title: true, speaker: true, date: true } } },
        },
        favoriteCantiques: {
          include: { cantique: { select: { id: true, title: true, reference: true } } },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("[PROFIL GET]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, phone, address, birthDate, bio, avatar } = body

    if (body.email && body.email !== session.user.email) {
      return NextResponse.json(
        { error: "La modification de l'email n'est pas autorisée ici" },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(birthDate !== undefined && { birthDate: birthDate ? new Date(birthDate) : null }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        birthDate: true,
        bio: true,
        avatar: true,
        role: true,
        joinDate: true,
      },
    })

    return NextResponse.json({ message: "Profil mis à jour", user })
  } catch (error) {
    console.error("[PROFIL PATCH]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
