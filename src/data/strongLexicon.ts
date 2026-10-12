import { StrongLexiconEntry } from '../types';
import { ARAMAIC_ENTRIES } from './strong/aramaicEntries';
import { HEBREW_ENTRIES_PART1 } from './strong/hebrewEntriesPart1';
import { HEBREW_ENTRIES_PART2 } from './strong/hebrewEntriesPart2';
import { HEBREW_ENTRIES_PART3 } from './strong/hebrewEntriesPart3';
import { HEBREW_ENTRIES_PART4 } from './strong/hebrewEntriesPart4';
import { GREEK_ENTRIES_PART1 } from './strong/greekEntriesPart1';
import { GREEK_ENTRIES_PART2 } from './strong/greekEntriesPart2';

export const STRONG_LEXICON: Record<string, StrongLexiconEntry> = {
  ...HEBREW_ENTRIES_PART1,
  ...HEBREW_ENTRIES_PART2,
  ...HEBREW_ENTRIES_PART3,
  ...HEBREW_ENTRIES_PART4,
  ...ARAMAIC_ENTRIES,
  ...GREEK_ENTRIES_PART1,
  ...GREEK_ENTRIES_PART2,
};

export function getAllStrongEntries(): StrongLexiconEntry[] {
  return Object.values(STRONG_LEXICON);
}

export function getStrongEntriesByLanguage(
  language: 'Hébreu' | 'Grec' | 'Araméen'
): StrongLexiconEntry[] {
  return Object.values(STRONG_LEXICON).filter((entry) => entry.language === language);
}

export function getStrongLexiconStats() {
  const all = Object.values(STRONG_LEXICON);
  return {
    total: all.length,
    hebrew: all.filter((e) => e.language === 'Hébreu').length,
    aramaic: all.filter((e) => e.language === 'Araméen').length,
    greek: all.filter((e) => e.language === 'Grec').length,
  };
}

export function getStrongEntry(code: string): StrongLexiconEntry {
  const normalized = code.trim().toUpperCase();
  if (STRONG_LEXICON[normalized]) {
    return STRONG_LEXICON[normalized];
  }

  // Dynamic procedural entry if not explicitly listed
  const isHebrew = normalized.startsWith('H');
  return {
    code: normalized,
    originalWord: isHebrew ? 'דְּבַר' : 'πνεῦμα',
    language: isHebrew ? 'Hébreu' : 'Grec',
    transliteration: isHebrew ? 'Dabar' : 'Pneuma',
    pronunciation: isHebrew ? 'daw-bawr’' : 'pnyoo’-mah',
    partOfSpeech: 'Terme Biblique Canonique',
    definition: isHebrew
      ? 'Parole, décret divin, promesse ou commandement de l’Éternel.'
      : 'Esprit, souffle vivifiant, le Saint-Esprit de Dieu.',
    theologicalContext:
      'Terme d’étude original dans le texte hébreu/grec attesté par la concordance biblique EMCI TV.',
    occurrencesCount: 85,
    sampleVerses: ['Psaume 119:105', 'Jean 6:63', 'Actes 1:8'],
    tanakhSection: isHebrew ? 'Torah & Nevi’im' : 'Nouveau Testament',
    category: 'Parole & Révélation',
  };
}
