import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const activeSession = await prisma.liveSession.findFirst({
      where: { isActive: true },
      include: {
        sermon: {
          include: {
            slides: true
          }
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    if (!activeSession) {
      return NextResponse.json({ activeSession: null });
    }

    const activeSlide = activeSession.sermon.slides.find(s => s.id === activeSession.activeSlideId);

    return NextResponse.json({
      activeSession: {
        id: activeSession.id,
        sermonTitle: activeSession.sermon.title,
        activeSlide
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch active session' }, { status: 500 });
  }
}
