export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const audio = await prisma.audio.findUnique({ where: { id: params.id } })
    if (!audio) {
      return NextResponse.json({ error: "Audio introuvable" }, { status: 404 })
    }

    await prisma.audio.update({
      where: { id: params.id },
      data: { plays: { increment: 1 } },
    })

    return NextResponse.json(audio)
  } catch (error) {
    console.error("[AUDIO GET]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, speaker, date, duration, fileUrl, category, isFeatured } = body

    const audio = await prisma.audio.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(speaker && { speaker }),
        ...(date && { date: new Date(date) }),
        ...(duration !== undefined && { duration }),
        ...(fileUrl !== undefined && { fileUrl }),
        ...(category && { category }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
    })

    return NextResponse.json(audio)
  } catch (error) {
    console.error("[AUDIO PATCH]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await prisma.audio.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Audio supprimé" })
  } catch (error) {
    console.error("[AUDIO DELETE]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
