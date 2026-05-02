import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const activeSessions = await prisma.liveSession.findMany({
      where: { isActive: true }
    });

    if (activeSessions.length === 0) {
      return NextResponse.json({ message: 'No active sessions to stop' });
    }

    await prisma.liveSession.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    });

    // Trigger Pusher events for each closed session
    for (const liveSession of activeSessions) {
      try {
        await pusherServer.trigger('live-sessions-global', 'session-status', {
          isActive: false,
          sessionId: liveSession.id
        });
        await pusherServer.trigger(`live-session-${liveSession.id}`, 'session-status', {
          isActive: false,
          sessionId: liveSession.id
        });
      } catch (pusherError) {
        console.error(`Pusher trigger failed for session ${liveSession.id}:`, pusherError);
      }
    }

    return NextResponse.json({ message: `Successfully stopped ${activeSessions.length} live sessions` });
  } catch (error) {
    console.error('Failed to stop all live sessions:', error);
    return NextResponse.json({ error: 'Failed to stop live sessions' }, { status: 500 });
  }
}
