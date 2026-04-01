import Dexie, { type EntityTable } from "dexie"

export interface VideoRecord {
  id: string
  title: string
  speaker: string
  date: string
  duration: string | null
  category: string
  description: string | null
  views: number
  isFeatured: boolean
  youtubeUrl: string | null
  syncedAt: number
}

export interface AudioRecord {
  id: string
  title: string
  speaker: string
  date: string
  duration: string | null
  category: string
  description: string | null
  plays: number
  isFeatured: boolean
  syncedAt: number
}

export interface CantiqueRecord {
  id: string
  title: string
  reference: string
  category: string
  lyrics: string[]
  chorus: string[] | null
  syncedAt: number
}

export interface EvenementRecord {
  id: string
  title: string
  content: string
  isActive: boolean
  createdAt: string
  syncedAt: number
}

class PlenitudeDatabase extends Dexie {
  videos!: EntityTable<VideoRecord, "id">
  audios!: EntityTable<AudioRecord, "id">
  cantiques!: EntityTable<CantiqueRecord, "id">
  evenements!: EntityTable<EvenementRecord, "id">

  constructor() {
    super("plenitude-db")
    this.version(1).stores({
      videos:    "id, title, speaker, category, isFeatured, syncedAt",
      audios:    "id, title, speaker, category, isFeatured, syncedAt",
      cantiques: "id, title, reference, category, syncedAt",
      evenements:"id, title, isActive, createdAt, syncedAt",
    })
  }
}

export const db = new PlenitudeDatabase()

export async function syncToLocalDb(): Promise<void> {
  if (typeof window === "undefined" || !navigator.onLine) return

  try {
    const [videosRes, audiosRes, cantiquesRes, evenementsRes] = await Promise.all([
      fetch("/api/videos?limit=200"),
      fetch("/api/audio?limit=200"),
      fetch("/api/cantiques?limit=500"),
      fetch("/api/evenements?limit=100"),
    ])

    const [videosData, audiosData, cantiquesData, evenementsData] = await Promise.all([
      videosRes.json(),
      audiosRes.json(),
      cantiquesRes.json(),
      evenementsRes.json(),
    ])

    const now = Date.now()

    await db.transaction("rw", [db.videos, db.audios, db.cantiques, db.evenements], async () => {
      if (videosData.videos?.length) {
        await db.videos.bulkPut(
          videosData.videos.map((v: VideoRecord) => ({ ...v, syncedAt: now }))
        )
      }
      if (audiosData.audios?.length) {
        await db.audios.bulkPut(
          audiosData.audios.map((a: AudioRecord) => ({ ...a, syncedAt: now }))
        )
      }
      if (cantiquesData.cantiques?.length) {
        await db.cantiques.bulkPut(
          cantiquesData.cantiques.map((c: CantiqueRecord) => ({ ...c, syncedAt: now }))
        )
      }
      if (evenementsData.evenements?.length) {
        await db.evenements.bulkPut(
          evenementsData.evenements.map((e: EvenementRecord) => ({ ...e, syncedAt: now }))
        )
      }
    })

    console.log("[Dexie] Sync complete at", new Date().toLocaleTimeString())
  } catch (err) {
    console.warn("[Dexie] Sync failed:", err)
  }
}

export async function getOfflineVideos(): Promise<VideoRecord[]> {
  return db.videos.orderBy("syncedAt").reverse().toArray()
}

export async function getOfflineAudios(): Promise<AudioRecord[]> {
  return db.audios.orderBy("syncedAt").reverse().toArray()
}

export async function getOfflineCantiques(): Promise<CantiqueRecord[]> {
  return db.cantiques.orderBy("title").toArray()
}

export async function getOfflineEvenements(): Promise<EvenementRecord[]> {
  return db.evenements.orderBy("createdAt").reverse().toArray()
}

export async function searchOfflineCantiques(query: string): Promise<CantiqueRecord[]> {
  if (!query.trim()) return getOfflineCantiques()
  const q = query.toLowerCase()
  return db.cantiques
    .filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.reference.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
    .toArray()
}

export async function searchOfflineVideos(query: string): Promise<VideoRecord[]> {
  if (!query.trim()) return getOfflineVideos()
  const q = query.toLowerCase()
  return db.videos
    .filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.speaker.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q)
    )
    .toArray()
}

export async function searchOfflineAudios(query: string): Promise<AudioRecord[]> {
  if (!query.trim()) return getOfflineAudios()
  const q = query.toLowerCase()
  return db.audios
    .filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.speaker.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    )
    .toArray()
}
