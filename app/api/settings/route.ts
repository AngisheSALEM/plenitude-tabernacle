import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await prisma.setting.findUnique({
      where: { id: "singleton" },
    })

    if (!settings) {
      // Return default settings if none exist yet
      return NextResponse.json({
        churchName: "Plenitude Tabernacle",
        description: "Une eglise vivante au coeur de Kinshasa, engagee dans la proclamation de l'Evangile et le service de la communaute.",
        address: "03 Av. Mafuta, Q. Mfinda, Ngaliema, Kinshasa, RDC",
        phone: "+243 999 123 456",
        email: "contact@plenitude-tabernacle.cd",
        website: "www.plenitude-tabernacle.cd",
        facebook: "https://facebook.com/plenitudetabernacle",
        youtube: "https://youtube.com/@plenitudetabernacle",
        instagram: "",
        twitter: "",
        schedule: [
          { day: "Dimanche", time: "09:00 - 12:00", title: "Culte principal" },
          { day: "Mercredi", time: "18:00 - 20:00", title: "Etude biblique" },
          { day: "Vendredi", time: "18:00 - 21:00", title: "Nuit de priere" },
        ]
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("[SETTINGS_GET]", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
