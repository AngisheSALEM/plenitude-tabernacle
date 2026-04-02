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

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        favoriteVideos: type === "videos" || !type ? {
          include: { video: true },
        } : false,
        favoriteAudios: type === "audios" || !type ? {
          include: { audio: true },
        } : false,
        favoriteCantiques: type === "cantiques" || !type ? {
          include: { cantique: true },
        } : false,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[FAVORIS GET]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const { type, itemId } = body

    if (!type || !itemId) {
      return NextResponse.json({ error: "Type et ID sont obligatoires" }, { status: 400 })
    }

    let result
    if (type === "video") {
      result = await prisma.favoriteVideo.upsert({
        where: { userId_videoId: { userId: session.user.id, videoId: itemId } },
        update: {},
        create: { userId: session.user.id, videoId: itemId },
      })
    } else if (type === "audio") {
      result = await prisma.favoriteAudio.upsert({
        where: { userId_audioId: { userId: session.user.id, audioId: itemId } },
        update: {},
        create: { userId: session.user.id, audioId: itemId },
      })
    } else if (type === "cantique") {
      result = await prisma.favoriteCantique.upsert({
        where: { userId_cantiqueId: { userId: session.user.id, cantiqueId: itemId } },
        update: {},
        create: { userId: session.user.id, cantiqueId: itemId },
      })
    } else {
      return NextResponse.json({ error: "Type invalide (video | audio | cantique)" }, { status: 400 })
    }

    return NextResponse.json({ message: "Ajouté aux favoris", result }, { status: 201 })
  } catch (error) {
    console.error("[FAVORIS POST]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const body = await req.json()
    const { type, itemId } = body

    if (type === "video") {
      await prisma.favoriteVideo.deleteMany({
        where: { userId: session.user.id, videoId: itemId },
      })
    } else if (type === "audio") {
      await prisma.favoriteAudio.deleteMany({
        where: { userId: session.user.id, audioId: itemId },
      })
    } else if (type === "cantique") {
      await prisma.favoriteCantique.deleteMany({
        where: { userId: session.user.id, cantiqueId: itemId },
      })
    } else {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 })
    }

    return NextResponse.json({ message: "Retiré des favoris" })
  } catch (error) {
    console.error("[FAVORIS DELETE]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
