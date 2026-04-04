export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = process.env.PLAYLIST_ID;
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  try {
    // Vérification de sécurité pour Vercel Cron Job
    // Si CRON_SECRET n'est pas configuré ou ne correspond pas au header, on refuse l'accès
    const authHeader = req.headers.get('authorization');
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!YOUTUBE_API_KEY || !PLAYLIST_ID) {
      return NextResponse.json({ error: "Configuration YouTube manquante (API Key ou Playlist ID)" }, { status: 500 });
    }

    let syncedCount = 0;
    let updatedCount = 0;
    let nextPageToken = "";
    let totalProcessed = 0;

    do {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.append("part", "snippet");
      url.searchParams.append("maxResults", "50");
      url.searchParams.append("playlistId", PLAYLIST_ID);
      url.searchParams.append("key", YOUTUBE_API_KEY);
      if (nextPageToken) {
        url.searchParams.append("pageToken", nextPageToken);
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        const errorData = await response.json();
        console.error("[SYNC-YOUTUBE] Erreur API YouTube", errorData);
        return NextResponse.json({ error: "Erreur lors de la récupération des vidéos YouTube" }, { status: 502 });
      }

      const data = await response.json();
      const items = data.items || [];

      for (const item of items) {
        const { snippet } = item;
        const videoId = snippet.resourceId?.videoId;
        if (!videoId) continue;

        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const title = snippet.title;
        const description = snippet.description;
        const thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
        const publishedAt = snippet.publishedAt;

        // On utilise prisma.video.upsert car youtubeUrl est maintenant @unique
        console.log(`[SYNC-YOUTUBE] Traitement de la vidéo: ${title} (${videoId})`);
        const video = await prisma.video.upsert({
          where: { youtubeUrl },
          update: {
            title,
            description,
            thumbnail,
          },
          create: {
            title,
            description,
            youtubeUrl,
            thumbnail,
            date: new Date(publishedAt),
            speaker: "Pasteur", // Valeur par défaut
            category: "Predication", // Valeur par défaut (sans accent pour match UI)
            isFeatured: false,
          }
        });

        // Prisma upsert retourne l'objet créé ou mis à jour.
        // Pour compter séparément, il faudrait vérifier la date de création vs mise à jour
        // mais ici on va juste incrémenter le total pour simplifier l'API.
        totalProcessed++;
      }

      nextPageToken = data.nextPageToken || "";
    } while (nextPageToken);

    return NextResponse.json({
      success: true,
      message: "Synchronisation terminée",
      stats: {
        total: totalProcessed
      }
    });
  } catch (error: any) {
    console.error("[SYNC-YOUTUBE ERROR]", error);
    return NextResponse.json({ error: "Une erreur interne est survenue lors de la synchronisation" }, { status: 500 });
  }
}
