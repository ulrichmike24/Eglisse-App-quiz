import genesisRaw from './genesisBook.json';
import { BibleVerse, TranslationKey } from '../types';
import { parseTaggedVerseText } from '../utils/bibleParser';

interface RawVerse {
  verse: number;
  text: string;
}

interface RawChapter {
  chapter: number;
  verses: RawVerse[];
}

interface RawBook {
  id: string;
  name: string;
  chapters: RawChapter[];
}

const typedGenesis = genesisRaw as unknown as RawBook;

// In-memory cache for parsed Genesis chapters
const parsedChaptersCache = new Map<number, BibleVerse[]>();

/**
 * Returns all parsed verses for any Genesis chapter (1 to 50)
 */
export function getGenesisChapterVerses(
  chapterNum: number,
  translation: TranslationKey = 'LSG'
): BibleVerse[] {
  if (parsedChaptersCache.has(chapterNum)) {
    const cached = parsedChaptersCache.get(chapterNum)!;
    // Map with current translation key if needed
    return cached.map((v) => ({ ...v, translation }));
  }

  const foundChapter = typedGenesis.chapters.find((c) => c.chapter === chapterNum);
  if (!foundChapter) {
    return [];
  }

  const parsedVerses: BibleVerse[] = foundChapter.verses.map((rawVerse) => {
    const parsed = parseTaggedVerseText(rawVerse.text);

    return {
      bookId: 'GEN',
      bookName: 'Genèse',
      chapter: chapterNum,
      verse: rawVerse.verse,
      text: parsed.cleanText || rawVerse.text,
      translation,
      strongCode: parsed.primaryStrongCode,
      tokens: parsed.tokens,
      crossReferences: parsed.crossReferences,
    };
  });

  parsedChaptersCache.set(chapterNum, parsedVerses);
  return parsedVerses;
}

/**
 * Check if a chapter exists in the local Genesis data
 */
export function hasGenesisChapter(chapterNum: number): boolean {
  return typedGenesis.chapters.some((c) => c.chapter === chapterNum);
}

/**
 * Get total Genesis chapters available
 */
export function getGenesisChaptersCount(): number {
  return typedGenesis.chapters.length;
}
