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
    const [userCount, predicationCount, announcementCount, videoViews] = await Promise.all([
      prisma.user.count(),
      prisma.predication.count(),
      prisma.announcement.count(),
      prisma.video.aggregate({
        _sum: {
          views: true
        }
      })
    ]);

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

    const upcomingEvents = await prisma.announcement.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      stats: {
        users: userCount,
        predications: predicationCount,
        announcements: announcementCount,
        views: videoViews._sum.views || 0,
      },
      recentContent: recentContent.map(v => ({ ...v, type: 'VIDEO' })),
      upcomingEvents: upcomingEvents.map(a => ({
          title: a.title,
          date: a.createdAt.toLocaleDateString('fr-FR'),
          time: 'N/A',
          type: a.type
      }))
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
