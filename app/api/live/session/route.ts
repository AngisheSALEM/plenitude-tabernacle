import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'PREDICATEUR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sermonId } = await req.json();
    const liveSession = await prisma.liveSession.create({
      data: {
        sermonId,
        isActive: true,
      }
    });

    // Trigger Pusher event for live session start
    // We can still trigger on a global channel for session-status (to alert users that a session started)
    // but slide changes should be scoped.
    try {
      await pusherServer.trigger('live-sessions-global', 'session-status', {
        isActive: true,
        sessionId: liveSession.id,
        sermonId: liveSession.sermonId
      });
    } catch (pusherError) {
      console.error('Pusher trigger failed:', pusherError);
    }

    return NextResponse.json({ liveSession });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to start live session' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'PREDICATEUR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sessionId, activeSlideId, isActive } = await req.json();
    const liveSession = await prisma.liveSession.update({
      where: { id: sessionId },
      data: {
        activeSlideId,
        isActive,
      },
      include: {
        sermon: {
          include: {
            slides: true
          }
        }
      }
    });

    // Trigger Pusher events
    try {
      if (activeSlideId) {
        const activeSlide = liveSession.sermon.slides.find(s => s.id === activeSlideId);
        // Scope slide changes to the specific session
        await pusherServer.trigger(`live-session-${liveSession.id}`, 'slide-changed', {
          activeSlideId,
          activeSlide,
          sermonTitle: liveSession.sermon.title
        });
      }

      if (isActive === false) {
        // Trigger both global and scoped for session end
        await pusherServer.trigger('live-sessions-global', 'session-status', {
          isActive: false,
          sessionId: liveSession.id
        });
        await pusherServer.trigger(`live-session-${liveSession.id}`, 'session-status', {
          isActive: false,
          sessionId: liveSession.id
        });
      }
    } catch (pusherError) {
      console.error('Pusher trigger failed:', pusherError);
    }

    return NextResponse.json({ liveSession });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update live session' }, { status: 500 });
  }
}
