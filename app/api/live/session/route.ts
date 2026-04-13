import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
      }
    });
    return NextResponse.json({ liveSession });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update live session' }, { status: 500 });
  }
}
