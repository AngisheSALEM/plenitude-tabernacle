import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    let whereClause: any = {};
    if (session.user.role === 'ADMIN') {
        if (status) whereClause.status = status;
        else whereClause.status = { in: ['Envoyé', 'Live'] };
    } else {
        whereClause.authorId = session.user.id;
    }

    const predications = await prisma.predication.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          }
        }
      }
    });
    return NextResponse.json({ predications });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch predications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'PREDICATEUR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, content, slides, status } = await req.json();

    const predication = await prisma.predication.create({
      data: {
        title,
        content,
        slides,
        status: status || 'Brouillon',
        authorId: session.user.id,
      }
    });

    return NextResponse.json({ predication });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save predication' }, { status: 500 });
  }
}
