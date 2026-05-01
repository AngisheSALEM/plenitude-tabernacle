import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      userCount,
      userLastMonth,
      userPrevMonth,
      videoCount,
      videoLastMonth,
      videoPrevMonth,
      audioCount,
      audioLastMonth,
      audioPrevMonth,
      videoViews,
      evenementsCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),

      prisma.video.count(),
      prisma.video.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.video.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),

      prisma.audio.count(),
      prisma.audio.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.audio.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),

      prisma.video.aggregate({ _sum: { views: true } }),
      prisma.evenement.count()
    ]);

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? \`+\${current}\` : "0";
      const diff = ((current - previous) / previous) * 100;
      return diff >= 0 ? \`+\${diff.toFixed(1)}%\` : \`\${diff.toFixed(1)}%\`;
    };

    const calculateAbsoluteGrowth = (current: number, previous: number) => {
      const diff = current - previous;
      return diff >= 0 ? \`+\${diff}\` : \`\${diff}\`;
    };

    const recentContent = await prisma.video.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        title: true,
        speaker: true,
        date: true,
        views: true,
        category: true,
      }
    });

    const upcomingEvents = await prisma.evenement.findMany({
        take: 3,
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      stats: {
        users: userCount,
        usersGrowth: calculateAbsoluteGrowth(userLastMonth, userPrevMonth),
        videos: videoCount,
        videosGrowth: calculateAbsoluteGrowth(videoLastMonth, videoPrevMonth),
        audio: audioCount,
        audioGrowth: calculateAbsoluteGrowth(audioLastMonth, audioPrevMonth),
        views: videoViews._sum.views || 0,
        viewsGrowth: "+0%", // Still no historical data for views, but improved other growth calcs
        announcements: evenementsCount,
      },
      recentContent: recentContent.map(v => ({ ...v, type: 'VIDEO' })),
      upcomingEvents: upcomingEvents.map(a => ({
          title: a.title,
          date: a.createdAt.toLocaleDateString('fr-FR'),
          time: 'N/A',
          type: 'Annonce'
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
