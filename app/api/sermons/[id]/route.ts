import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const sermon = await prisma.sermon.findUnique({
      where: { id: params.id },
      include: {
        slides: {
          orderBy: { order: 'asc' }
        },
        author: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });

    if (!sermon) {
      return NextResponse.json({ error: 'Sermon not found' }, { status: 404 });
    }

    // Access control: ADMIN can see any sermon, PREDICATEUR can see their own
    if (session.user.role !== 'ADMIN' && sermon.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ sermon });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sermon' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'PREDICATEUR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { isShared, title, content, slides } = body;

    const existingSermon = await prisma.sermon.findUnique({
      where: { id: params.id }
    });

    if (!existingSermon) {
      return NextResponse.json({ error: 'Sermon not found' }, { status: 404 });
    }

    // Access control: only the author or an ADMIN can update
    if (session.user.role !== 'ADMIN' && existingSermon.authorId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prepare update data
    const updateData: any = {};
    if (typeof isShared === 'boolean') updateData.isShared = isShared;
    if (title) updateData.title = title;
    if (content) updateData.content = content;

    // Handle slides update if provided
    if (slides && Array.isArray(slides)) {
        // Delete existing slides and recreate them for simplicity
        // In a more complex app, we might want to update individually
        await prisma.slide.deleteMany({
            where: { sermonId: params.id }
        });

        updateData.slides = {
            create: slides.map((s: any, index: number) => ({
                content: s.content,
                type: s.type,
                metadata: s.metadata,
                order: index,
            }))
        };
    }

    const sermon = await prisma.sermon.update({
      where: { id: params.id },
      data: updateData,
      include: { slides: true }
    });

    return NextResponse.json({ sermon });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update sermon' }, { status: 500 });
  }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'PREDICATEUR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const existingSermon = await prisma.sermon.findUnique({
        where: { id: params.id }
      });

      if (!existingSermon) {
        return NextResponse.json({ error: 'Sermon not found' }, { status: 404 });
      }

      if (session.user.role !== 'ADMIN' && existingSermon.authorId !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      await prisma.sermon.delete({
        where: { id: params.id }
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to delete sermon' }, { status: 500 });
    }
  }
