import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return NextResponse.json({ announcements });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, type } = await req.json();

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        type: type || 'INFO',
      }
    });

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
