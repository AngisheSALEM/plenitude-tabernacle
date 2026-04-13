import { NextResponse } from 'next/server';
import { generateSlidesFromText } from '@/lib/slides-utils';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    const slides = generateSlidesFromText(text);
    return NextResponse.json({ slides });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate slides' }, { status: 500 });
  }
}
