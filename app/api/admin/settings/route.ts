import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 'singleton' }
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 'singleton',
          worshipTime: 'Mardi & Vendredi: 17h30 - 19h30, Dimanche: 09h00 - 11h30',
          address: '03 Av. Mafuta, Q. Mfinda, Commune de Ngaliema, Kinshasa',
          googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3978.472856525944!2d15.232468211029272!3d-4.352512146958869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3130fa579c95%3A0x87a7ed5ea0d45413!2s-4.352517%2C%2015.234657!5e0!3m2!1sfr!2scd!4v1710000000000!5m2!1sfr!2scd',
          featuredVideoId: 'PLPNLjERB0V6CQLtDMHkck2JhHCG9JXusa',
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

const getEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes('pb=')) return url;
  // Simple heuristic for common Google Maps sharing links
  if (url.includes('goo.gl') || url.includes('google.com/maps')) {
     return `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_API_KEY || ''}&q=${encodeURIComponent(url)}`;
  }
  return url;
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const googleMapsUrl = getEmbedUrl(data.googleMapsUrl);

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {
        worshipTime: data.worshipTime,
        address: data.address,
        googleMapsUrl: googleMapsUrl,
        featuredVideoId: data.featuredVideoId,
        lastUpdated: new Date(),
      },
      create: {
        id: 'singleton',
        worshipTime: data.worshipTime || '',
        address: data.address || '',
        googleMapsUrl: googleMapsUrl || '',
        featuredVideoId: data.featuredVideoId || '',
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
