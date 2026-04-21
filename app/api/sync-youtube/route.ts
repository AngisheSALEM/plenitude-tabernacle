export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const DEFAULT_PLAYLIST_ID = "PLPNLjERB0V6CQLtDMHkck2JhHCG9JXusa";
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const playlistIdParam = searchParams.get("playlistId");
    const PLAYLIST_ID = playlistIdParam || process.env.PLAYLIST_ID || DEFAULT_PLAYLIST_ID;

    // Vérification de sécurité : Vercel Cron Job (Bearer Token) OU Session ADMIN
    const authHeader = req.headers.get('authorization');
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === "ADMIN";

    const isCronAuthorized = CRON_SECRET && authHeader === `Bearer ${CRON_SECRET}`;

    if (!isCronAuthorized && !isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: "Configuration YouTube manquante (API Key)" }, { status: 500 });
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
        console.error("[SYNC-YOUTUBE] Erreur API YouTube (playlistItems)", errorData);
        return NextResponse.json({ error: "Erreur lors de la récupération des vidéos YouTube" }, { status: 502 });
      }

      const data = await response.json();
      const items = data.items || [];

      if (items.length === 0) break;

      // Récupérer les détails supplémentaires (durée) pour toutes les vidéos de cette page
      const videoIds = items.map((item: any) => item.snippet.resourceId?.videoId).filter(Boolean).join(',');

      let videoDetailsMap = new Map();
      if (videoIds) {
        const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
        detailsUrl.searchParams.append("part", "contentDetails");
        detailsUrl.searchParams.append("id", videoIds);
        detailsUrl.searchParams.append("key", YOUTUBE_API_KEY);

        const detailsResponse = await fetch(detailsUrl.toString());
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          detailsData.items?.forEach((v: any) => {
            videoDetailsMap.set(v.id, v.contentDetails?.duration);
          });
        }
      }

      for (const item of items) {
        const { snippet } = item;
        const videoId = snippet.resourceId?.videoId;
        if (!videoId) continue;

        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const title = snippet.title;
        const description = snippet.description;
        const thumbnail = snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url;
        const publishedAt = snippet.publishedAt;

        // Convertir la durée ISO 8601 (ex: PT1H2M10S) en format lisible (ex: 1:02:10)
        const isoDuration = videoDetailsMap.get(videoId);
        let duration = "0:00";
        if (isoDuration) {
          const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          if (match) {
            const h = match[1] ? parseInt(match[1]) : 0;
            const m = match[2] ? parseInt(match[2]) : 0;
            const s = match[3] ? parseInt(match[3]) : 0;

            if (h > 0) {
              duration = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            } else {
              duration = `${m}:${s.toString().padStart(2, '0')}`;
            }
          }
        }

        // On utilise prisma.video.upsert car youtubeUrl est maintenant @unique
        console.log(`[SYNC-YOUTUBE] Traitement de la vidéo: ${title} (${videoId})`);

        // Tentative d'extraction du prédicateur depuis le titre ou la description
        let speaker = "Pasteur";
        const speakerMatch = title.match(/Pasteur\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i) ||
                           description.match(/Prédicateur\s*:\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
        if (speakerMatch) {
          speaker = speakerMatch[1];
        }

        await prisma.video.upsert({
          where: { youtubeUrl },
          update: {
            title,
            description,
            thumbnail,
            duration,
          },
          create: {
            title,
            description,
            youtubeUrl,
            thumbnail,
            duration,
            date: new Date(publishedAt),
            speaker: speaker,
            category: "Predication",
            isFeatured: false,
          }
        });

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
