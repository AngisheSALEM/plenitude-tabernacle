export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const evenement = await prisma.evenement.findUnique({ where: { id: params.id } })
    if (!evenement) {
      return NextResponse.json({ error: "Événement introuvable" }, { status: 404 })
    }
    return NextResponse.json(evenement)
  } catch (error) {
    console.error("[EVENEMENT GET]", error)
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
    const { title, content, imageUrl, isActive, date } = body

    const evenement = await prisma.evenement.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(date !== undefined && { date: date ? new Date(date) : null }),
      },
    })

    return NextResponse.json(evenement)
  } catch (error) {
    console.error("[EVENEMENT PATCH]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await prisma.evenement.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Événement supprimé" })
  } catch (error) {
    console.error("[EVENEMENT DELETE]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
