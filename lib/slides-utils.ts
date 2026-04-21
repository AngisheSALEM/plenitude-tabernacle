export interface SlideMetadata {
  book?: string;
  chapter?: number;
  verse?: string;
  name?: string;
  paragraph?: string;
  location?: string;
  date?: string;
  image?: string;
}

export interface GeneratedSlide {
  content: string;
  type: 'TEXT' | 'VERSE' | 'CITATION';
  metadata: SlideMetadata;
  order: number;
}

export function generateSlidesFromText(text: string): GeneratedSlide[] {
  // Simple splitting by double newline for now as a base
  // and heuristic detection for bible verses and citations.
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);

  return paragraphs.map((p, index) => {
    const trimmed = p.trim();
    let type: 'TEXT' | 'VERSE' | 'CITATION' = 'TEXT';
    let metadata: SlideMetadata = {};

    // Heuristic for Bible Verses: starts with a number or known book name followed by chapter:verse
    // Example: "Jean 3:16" or "1 Jean 2:1"
    const verseRegex = /^([\d\s]*[A-Za-zÀ-ÿ]+)\s+(\d+):(\d+([-]\d+)?)/;
    const verseMatch = trimmed.match(verseRegex);

    if (verseMatch) {
      type = 'VERSE';
      metadata = {
        book: verseMatch[1].trim(),
        chapter: parseInt(verseMatch[2]),
        verse: verseMatch[3]
      };
    } else if (trimmed.includes(' - ') || (trimmed.match(/\n/) && trimmed.length < 500)) {
        // Heuristic for Citations: if it's relatively short and contains a separator or multiple lines
        // For now, let's just mark it as TEXT unless it's clearly a verse.
        // In a real implementation, we would look for patterns like "Name, Location, Date"
        type = 'CITATION';
    }

    return {
      content: trimmed,
      type,
      metadata,
      order: index
    };
  });
}
