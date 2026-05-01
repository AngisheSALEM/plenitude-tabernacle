import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sharedOnly = searchParams.get('shared') === 'true';

  try {
    let whereClause: any = {};

    if (session.user.role === 'ADMIN') {
      if (sharedOnly) {
        whereClause.isShared = true;
      }
    } else {
      whereClause.authorId = session.user.id;
    }

    const sermons = await prisma.sermon.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: {
        slides: {
          orderBy: { order: 'asc' }
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });
    return NextResponse.json({ sermons });
  } catch (error) {
    console.error("[SERMONS GET]", error);
    return NextResponse.json({ error: 'Failed to fetch sermons' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'PREDICATEUR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, slides } = await req.json();

    if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const sermon = await prisma.sermon.create({
      data: {
        title,
        content: content || "",
        authorId: session.user.id,
        slides: {
          create: (slides || []).map((s: any, index: number) => ({
            content: s.content,
            type: s.type || "TEXT",
            metadata: s.metadata || {},
            order: index,
          }))
        }
      },
      include: { slides: true }
    });

    return NextResponse.json({ sermon });
  } catch (error) {
    console.error("[SERMONS POST]", error);
    return NextResponse.json({ error: 'Failed to save sermon' }, { status: 500 });
  }
}
