export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const video = await prisma.video.findUnique({ where: { id } })
    if (!video) {
      return NextResponse.json({ error: "Vidéo introuvable" }, { status: 404 })
    }

    await prisma.video.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error("[VIDEO GET]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, speaker, date, duration, thumbnail, youtubeUrl, isFeatured, category } = body

    const video = await prisma.video.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(speaker && { speaker }),
        ...(date && { date: new Date(date) }),
        ...(duration !== undefined && { duration }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(youtubeUrl !== undefined && { youtubeUrl }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(category && { category }),
      },
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error("[VIDEO PATCH]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await prisma.video.delete({ where: { id } })
    return NextResponse.json({ message: "Vidéo supprimée" })
  } catch (error) {
    console.error("[VIDEO DELETE]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
