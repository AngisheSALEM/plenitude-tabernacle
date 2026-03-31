import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cantique = await prisma.cantique.findUnique({ where: { id: params.id } })
    if (!cantique) {
      return NextResponse.json({ error: "Cantique introuvable" }, { status: 404 })
    }
    return NextResponse.json(cantique)
  } catch (error) {
    console.error("[CANTIQUE GET]", error)
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
    const { title, reference, category, lyrics, chorus } = body

    const cantique = await prisma.cantique.update({
      where: { id: params.id },
      data: {
        ...(title && { title: title.toUpperCase() }),
        ...(reference && { reference }),
        ...(category && { category }),
        ...(lyrics && { lyrics }),
        ...(chorus !== undefined && { chorus }),
      },
    })

    return NextResponse.json(cantique)
  } catch (error) {
    console.error("[CANTIQUE PATCH]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await prisma.cantique.delete({ where: { id: params.id } })
    return NextResponse.json({ message: "Cantique supprimé" })
  } catch (error) {
    console.error("[CANTIQUE DELETE]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
