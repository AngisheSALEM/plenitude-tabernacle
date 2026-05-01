import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), "public", "uploads")

    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }
    } catch (mkdirError: any) {
      console.error("[UPLOAD MKDIR ERROR]", mkdirError)
      return NextResponse.json(
        {
          error: "Impossible de créer le répertoire d'upload. Le système de fichiers peut être en lecture seule.",
          details: mkdirError.message,
          path: uploadDir
        },
        { status: 500 }
      )
    }

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    const path = join(uploadDir, uniqueName)

    try {
      await writeFile(path, buffer)
    } catch (writeError: any) {
      console.error("[UPLOAD WRITE ERROR]", writeError)
      return NextResponse.json(
        {
          error: "Impossible d'écrire le fichier. Le système de fichiers peut être en lecture seule.",
          details: writeError.message,
          path: path
        },
        { status: 500 }
      )
    }

    const imageUrl = `/uploads/${uniqueName}`

    return NextResponse.json({ url: imageUrl })
  } catch (error) {
    console.error("[UPLOAD POST]", error)
    return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 })
  }
}
