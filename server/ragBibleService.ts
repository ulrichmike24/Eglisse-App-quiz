import { GoogleGenAI } from '@google/genai';
import { BIBLE_DICTIONARY_TERMS, BibleDictionaryTerm } from '../src/data/bibleDictionary.ts';
import { BIBLICAL_CHARACTERS, BiblicalCharacter } from '../src/data/bibleCharacters.ts';
import { BIBLE_STORIES } from '../src/data/bibleStories.ts';
import genesisRaw from '../src/data/genesisBook.json';
import { parseTaggedVerseText } from '../src/utils/bibleParser.ts';

export interface BibleChatRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; text: string }[];
  agent?: string;
  translation?: string;
}

export interface CitedVerse {
  reference: string;
  text: string;
  translation: string;
}

export interface BibleChatResponse {
  agentName: string;
  agentCategory: string;
  answer: string;
  citedVerses: CitedVerse[];
  practicalApplication?: string;
  prayer?: string;
  suggestedQuestions: string[];
  ragSources: {
    type: 'scripture' | 'dictionary' | 'character' | 'story';
    title: string;
    detail: string;
  }[];
}

// Canonical 66 Books list with French aliases and GetBible book numbers
export const CANONICAL_BOOKS = [
  { name: 'Genèse', id: 'GEN', nr: 1, aliases: ['genese', 'genèse', 'gen', 'gn'] },
  { name: 'Exode', id: 'EXO', nr: 2, aliases: ['exode', 'exo', 'ex'] },
  { name: 'Lévitique', id: 'LEV', nr: 3, aliases: ['levitique', 'lévitique', 'lev', 'lév', 'lv'] },
  { name: 'Nombres', id: 'NUM', nr: 4, aliases: ['nombres', 'nom', 'nb'] },
  { name: 'Deutéronome', id: 'DEU', nr: 5, aliases: ['deuteronome', 'deutéronome', 'deu', 'dt'] },
  { name: 'Josué', id: 'JOS', nr: 6, aliases: ['josue', 'josué', 'jos'] },
  { name: 'Juges', id: 'JDG', nr: 7, aliases: ['juges', 'jug', 'jg'] },
  { name: 'Ruth', id: 'RUT', nr: 8, aliases: ['ruth', 'rut', 'rt'] },
  { name: '1 Samuel', id: '1SA', nr: 9, aliases: ['1 samuel', '1samuel', '1 sa', '1sa', '1 s', '1s'] },
  { name: '2 Samuel', id: '2SA', nr: 10, aliases: ['2 samuel', '2samuel', '2 sa', '2sa', '2 s', '2s'] },
  { name: '1 Rois', id: '1KI', nr: 11, aliases: ['1 rois', '1rois', '1 ro', '1ro', '1 r', '1r'] },
  { name: '2 Rois', id: '2KI', nr: 12, aliases: ['2 rois', '2rois', '2 ro', '2ro', '2 r', '2r'] },
  { name: '1 Chroniques', id: '1CH', nr: 13, aliases: ['1 chroniques', '1chroniques', '1 ch', '1ch'] },
  { name: '2 Chroniques', id: '2CH', nr: 14, aliases: ['2 chroniques', '2chroniques', '2 ch', '2ch'] },
  { name: 'Esdras', id: 'EZR', nr: 15, aliases: ['esdras', 'esd'] },
  { name: 'Néhémie', id: 'NEH', nr: 16, aliases: ['nehemie', 'néhémie', 'neh', 'néh'] },
  { name: 'Esther', id: 'EST', nr: 17, aliases: ['esther', 'est'] },
  { name: 'Job', id: 'JOB', nr: 18, aliases: ['job', 'jb'] },
  { name: 'Psaumes', id: 'PSA', nr: 19, aliases: ['psaumes', 'psaume', 'ps', 'pss'] },
  { name: 'Proverbes', id: 'PRO', nr: 20, aliases: ['proverbes', 'proverbe', 'pro', 'pr'] },
  { name: 'Ecclésiaste', id: 'ECC', nr: 21, aliases: ['ecclesiaste', 'ecclésiaste', 'ecc', 'ec'] },
  { name: 'Cantique des Cantiques', id: 'SNG', nr: 22, aliases: ['cantique des cantiques', 'cantique', 'cantiques', 'ct'] },
  { name: 'Ésaïe', id: 'ISA', nr: 23, aliases: ['esaie', 'ésaïe', 'esa', 'ésa', 'is'] },
  { name: 'Jérémie', id: 'JER', nr: 24, aliases: ['jeremie', 'jérémie', 'jer', 'jér'] },
  { name: 'Lamentations', id: 'LAM', nr: 25, aliases: ['lamentations', 'lamentation', 'lam'] },
  { name: 'Ézéchiel', id: 'EZK', nr: 26, aliases: ['ezechiel', 'ézéchiel', 'ezk', 'éz'] },
  { name: 'Daniel', id: 'DAN', nr: 27, aliases: ['daniel', 'dan', 'da'] },
  { name: 'Osée', id: 'HOS', nr: 28, aliases: ['osee', 'osée', 'os'] },
  { name: 'Joël', id: 'JOL', nr: 29, aliases: ['joel', 'joël', 'jol', 'jl'] },
  { name: 'Amos', id: 'AMO', nr: 30, aliases: ['amos', 'am'] },
  { name: 'Abdias', id: 'OBA', nr: 31, aliases: ['abdias', 'abd', 'ab'] },
  { name: 'Jonas', id: 'JON', nr: 32, aliases: ['jonas', 'jon'] },
  { name: 'Michée', id: 'MIC', nr: 33, aliases: ['michee', 'michée', 'mic', 'mi'] },
  { name: 'Nahum', id: 'NAM', nr: 34, aliases: ['nahum', 'nah', 'na'] },
  { name: 'Habacuc', id: 'HAB', nr: 35, aliases: ['habacuc', 'hab'] },
  { name: 'Sophonie', id: 'ZEP', nr: 36, aliases: ['sophonie', 'sop', 'so'] },
  { name: 'Aggée', id: 'HAG', nr: 37, aliases: ['aggee', 'aggée', 'agg', 'ag'] },
  { name: 'Zacharie', id: 'ZEC', nr: 38, aliases: ['zacharie', 'zac', 'za'] },
  { name: 'Malachie', id: 'MAL', nr: 39, aliases: ['malachie', 'mal', 'ml'] },
  { name: 'Matthieu', id: 'MAT', nr: 40, aliases: ['matthieu', 'mat', 'mt'] },
  { name: 'Marc', id: 'MRK', nr: 41, aliases: ['marc', 'mc'] },
  { name: 'Luc', id: 'LUK', nr: 42, aliases: ['luc', 'lc'] },
  { name: 'Jean', id: 'JHN', nr: 43, aliases: ['jean', 'jn', 'jhn'] },
  { name: 'Actes', id: 'ACT', nr: 44, aliases: ['actes', 'act', 'ac'] },
  { name: 'Romains', id: 'ROM', nr: 45, aliases: ['romains', 'rom', 'rm'] },
  { name: '1 Corinthiens', id: '1CO', nr: 46, aliases: ['1 corinthiens', '1corinthiens', '1 co', '1co', '1 cor', '1cor'] },
  { name: '2 Corinthiens', id: '2CO', nr: 47, aliases: ['2 corinthiens', '2corinthiens', '2 co', '2co', '2 cor', '2cor'] },
  { name: 'Galates', id: 'GAL', nr: 48, aliases: ['galates', 'gal', 'ga'] },
  { name: 'Éphésiens', id: 'EPH', nr: 49, aliases: ['ephesiens', 'éphésiens', 'eph', 'éph'] },
  { name: 'Philippiens', id: 'PHP', nr: 50, aliases: ['philippiens', 'phil', 'php', 'ph'] },
  { name: 'Colossiens', id: 'COL', nr: 51, aliases: ['colossiens', 'col'] },
  { name: '1 Thessaloniciens', id: '1TH', nr: 52, aliases: ['1 thessaloniciens', '1thessaloniciens', '1 th', '1th'] },
  { name: '2 Thessaloniciens', id: '2TH', nr: 53, aliases: ['2 thessaloniciens', '2thessaloniciens', '2 th', '2th'] },
  { name: '1 Timothée', id: '1TI', nr: 54, aliases: ['1 timothee', '1timothee', '1 timothée', '1timothée', '1 ti', '1ti'] },
  { name: '2 Timothée', id: '2TI', nr: 55, aliases: ['2 timothee', '2timothee', '2 timothée', '2timothée', '2 ti', '2ti'] },
  { name: 'Tite', id: 'TIT', nr: 56, aliases: ['tite', 'tit'] },
  { name: 'Philémon', id: 'PHM', nr: 57, aliases: ['philemon', 'philémon', 'phm'] },
  { name: 'Hébreux', id: 'HEB', nr: 58, aliases: ['hebreux', 'hébreux', 'heb', 'héb'] },
  { name: 'Jacques', id: 'JAS', nr: 59, aliases: ['jacques', 'jac', 'jc'] },
  { name: '1 Pierre', id: '1PE', nr: 60, aliases: ['1 pierre', '1pierre', '1 pi', '1pe', '1p'] },
  { name: '2 Pierre', id: '2PE', nr: 61, aliases: ['2 pierre', '2pierre', '2 pi', '2pe', '2p'] },
  { name: '1 Jean', id: '1JN', nr: 62, aliases: ['1 jean', '1jean', '1 jn', '1jn'] },
  { name: '2 Jean', id: '2JN', nr: 63, aliases: ['2 jean', '2jean', '2 jn', '2jn'] },
  { name: '3 Jean', id: '3JN', nr: 64, aliases: ['3 jean', '3jean', '3 jn', '3jn'] },
  { name: 'Jude', id: 'JUD', nr: 65, aliases: ['jude', 'jud'] },
  { name: 'Apocalypse', id: 'REV', nr: 66, aliases: ['apocalypse', 'apo', 'apoc', 'rev'] },
];

// In-memory cache for chapters retrieved via GetBible
const chapterCache = new Map<string, { verses: { verse: number; text: string }[] }>();

/**
 * Extract biblical references (Book, Chapter, Verses) from query text
 */
function extractBiblicalReference(text: string): { book: typeof CANONICAL_BOOKS[0]; chapter: number; startVerse?: number; endVerse?: number } | null {
  const normalized = text.toLowerCase();

  for (const book of CANONICAL_BOOKS) {
    for (const alias of book.aliases) {
      // Regex looking for e.g. "jean 3:16", "jean 3 v 16", "jean 3, 16", "jean 3:16-18", "jean 3"
      const pattern = new RegExp(`\\b${alias}\\s*(\\d+)(?:[\\s:v,]\\s*(\\d+)(?:\\s*[-–]\\s*(\\d+))?)?`, 'i');
      const match = normalized.match(pattern);
      if (match) {
        const chapter = parseInt(match[1], 10);
        const startVerse = match[2] ? parseInt(match[2], 10) : undefined;
        const endVerse = match[3] ? parseInt(match[3], 10) : startVerse;
        if (!isNaN(chapter) && chapter > 0) {
          return { book, chapter, startVerse, endVerse };
        }
      }
    }
  }

  return null;
}

/**
 * Fetch authentic canonical chapter from GetBible API
 */
async function fetchCanonicalChapter(bookNr: number, chapter: number): Promise<{ verse: number; text: string }[]> {
  const cacheKey = `${bookNr}_${chapter}`;
  if (chapterCache.has(cacheKey)) {
    return chapterCache.get(cacheKey)!.verses;
  }

  // 1. If Genesis (Book nr 1), load immediately from authentic JSON
  if (bookNr === 1) {
    const rawBook = genesisRaw as any;
    const foundChapter = rawBook.chapters?.find((c: any) => c.chapter === chapter);
    if (foundChapter && Array.isArray(foundChapter.verses)) {
      const verses = foundChapter.verses.map((v: any) => {
        const parsed = parseTaggedVerseText(v.text);
        return {
          verse: Number(v.verse),
          text: parsed.cleanText || v.text,
        };
      });
      chapterCache.set(cacheKey, { verses });
      return verses;
    }
  }

  try {
    const res = await fetch(`https://api.getbible.net/v2/ls1910/${bookNr}/${chapter}.json`);
    if (res.ok) {
      const data = await res.json() as any;
      if (data && Array.isArray(data.verses) && data.verses.length > 0) {
        const verses = data.verses.map((v: any) => ({
          verse: Number(v.verse),
          text: String(v.text).trim(),
        }));
        chapterCache.set(cacheKey, { verses });
        return verses;
      }
    }
  } catch (err) {
    console.warn(`[RAG] Failed to fetch chapter from GetBible:`, err);
  }

  return [];
}

/**
 * RAG Knowledge Retrieval Pipeline
 */
export async function retrieveRAGContext(query: string) {
  const queryLower = query.toLowerCase();
  const ragSources: BibleChatResponse['ragSources'] = [];
  const retrievedVerses: CitedVerse[] = [];
  let detectedReference: string | null = null;
  let matchingDictionaryTerm: BibleDictionaryTerm | null = null;
  let matchingCharacter: BiblicalCharacter | null = null;
  let matchingStory: (typeof BIBLE_STORIES)[0] | null = null;

  // 1. Check for specific scripture reference (RAG Step 1)
  const parsedRef = extractBiblicalReference(query);
  if (parsedRef) {
    const { book, chapter, startVerse, endVerse } = parsedRef;
    const allChapterVerses = await fetchCanonicalChapter(book.nr, chapter);

    if (allChapterVerses.length > 0) {
      if (startVerse) {
        const minV = startVerse;
        const maxV = endVerse || startVerse;
        const filtered = allChapterVerses.filter(v => v.verse >= minV && v.verse <= maxV);
        if (filtered.length > 0) {
          const refString = minV === maxV ? `${book.name} ${chapter}:${minV}` : `${book.name} ${chapter}:${minV}-${maxV}`;
          detectedReference = refString;
          filtered.forEach(v => {
            retrievedVerses.push({
              reference: `${book.name} ${chapter}:${v.verse}`,
              text: v.text,
              translation: 'LSG',
            });
          });
          ragSources.push({
            type: 'scripture',
            title: refString,
            detail: `Passage extrait mot pour mot de la version canonique Louis Segond 1910 (${filtered.length} verset${filtered.length > 1 ? 's' : ''}).`,
          });
        }
      } else {
        // First few verses of the chapter
        const sample = allChapterVerses.slice(0, 5);
        detectedReference = `${book.name} ${chapter}`;
        sample.forEach(v => {
          retrievedVerses.push({
            reference: `${book.name} ${chapter}:${v.verse}`,
            text: v.text,
            translation: 'LSG',
          });
        });
        ragSources.push({
          type: 'scripture',
          title: `${book.name} ${chapter}`,
          detail: `Chapitre extrait de la base canonique Louis Segond 1910 (${allChapterVerses.length} versets au total).`,
        });
      }
    }
  }

  // 2. Check for theological terms in Bible Dictionary (RAG Step 2)
  for (const item of BIBLE_DICTIONARY_TERMS) {
    if (queryLower.includes(item.term.toLowerCase())) {
      matchingDictionaryTerm = item;
      ragSources.push({
        type: 'dictionary',
        title: `Dictionnaire Biblique : ${item.term}`,
        detail: `Racine : ${item.originalWord || ''} (${item.originalLanguage || ''} - Strong ${item.strongCode || 'N/A'}), ${item.occurrences}.`,
      });
      break;
    }
  }

  // 3. Check for biblical characters (RAG Step 3)
  for (const char of BIBLICAL_CHARACTERS) {
    const charName = char.name.toLowerCase();
    if (queryLower.includes(charName) || (char.id && queryLower.includes(char.id))) {
      matchingCharacter = char;
      ragSources.push({
        type: 'character',
        title: `Personnage Biblique : ${char.name}`,
        detail: `${char.role} (${char.era}). Signification : ${char.meaning}.`,
      });
      break;
    }
  }

  // 4. Check for biblical stories (RAG Step 4)
  for (const story of BIBLE_STORIES) {
    const titleLower = story.title.toLowerCase();
    if (
      queryLower.includes('goliath') ||
      queryLower.includes('arche') ||
      queryLower.includes('david') ||
      queryLower.includes(story.id)
    ) {
      if (titleLower.includes('david') && (queryLower.includes('goliath') || queryLower.includes('fronde'))) {
        matchingStory = story;
        ragSources.push({
          type: 'story',
          title: story.title,
          detail: `Référence biblique : ${story.reference}. Thème : ${story.subtitle}`,
        });
        break;
      }
    }
  }

  return {
    detectedReference,
    retrievedVerses,
    matchingDictionaryTerm,
    matchingCharacter,
    matchingStory,
    ragSources,
  };
}

/**
 * Bible AI Manager: Classify User Intent & select specialized sub-agent
 */
function determineAgent(
  query: string,
  ragContext: Awaited<ReturnType<typeof retrieveRAGContext>>,
  forcedAgent?: string
): { agentName: string; agentCategory: string } {
  if (forcedAgent && forcedAgent !== 'auto') {
    return {
      agentName: forcedAgent,
      agentCategory: 'Spécialisé',
    };
  }

  const q = query.toLowerCase();

  if (ragContext.detectedReference || q.includes('explique') || q.includes('verset') || q.includes('signifie ce passage')) {
    return {
      agentName: 'Agent Explication de Verset (Verse Explanation Agent)',
      agentCategory: 'Exégèse & Étude',
    };
  }

  if (ragContext.matchingDictionaryTerm || q.includes('signification du mot') || q.includes('définition') || q.includes('terme') || q.includes('étymologie')) {
    return {
      agentName: 'Agent Dictionnaire Biblique (Bible Dictionary Agent)',
      agentCategory: 'Lexique & Concordance',
    };
  }

  if (ragContext.matchingCharacter || q.includes('qui était') || q.includes('qui est') || q.includes('personnage') || q.includes('vie de')) {
    return {
      agentName: 'Agent Personnages Bibliques (Character Agent)',
      agentCategory: 'Biographies Bibliques',
    };
  }

  if (ragContext.matchingStory || q.includes('histoire') || q.includes('raconte') || q.includes('récit')) {
    return {
      agentName: 'Agent Récits & Histoires Bibliques (Story Agent)',
      agentCategory: 'Narration & Leçons',
    };
  }

  if (q.includes('étude') || q.includes('doctrine') || q.includes('théologie') || q.includes('saint-esprit') || q.includes('alliance')) {
    return {
      agentName: 'Agent Étude Biblique & Théologique (Study Agent)',
      agentCategory: 'Formation & Discipulat',
    };
  }

  if (q.includes('méditation') || q.includes('dévotion') || q.includes('matin') || q.includes('pensée du jour')) {
    return {
      agentName: 'Agent Méditation Quotidienne (Devotional Agent)',
      agentCategory: 'Dévotion Personnelle',
    };
  }

  if (q.includes('prière') || q.includes('prie') || q.includes('intercession')) {
    return {
      agentName: 'Agent Prière & Intercession (Prayer Agent)',
      agentCategory: 'Vie Spirituelle',
    };
  }

  if (q.includes('quiz') || q.includes('question') || q.includes('qcm') || q.includes('test')) {
    return {
      agentName: 'Agent Quiz Biblique (Quiz Agent)',
      agentCategory: 'Connaissances & Évaluation',
    };
  }

  if (q.includes('versets sur') || q.includes('passage sur') || q.includes('où est écrit') || q.includes('trouve-moi')) {
    return {
      agentName: 'Agent Recherche Biblique (Bible Search Agent)',
      agentCategory: 'Recherche Thématique',
    };
  }

  return {
    agentName: 'Bible AI Manager (Conseiller Biblique Intégral)',
    agentCategory: 'Accompagnement Spirituel',
  };
}

/**
 * Main Controller: Handle Bible AI Chat via RAG pipeline and Gemini
 */
export async function handleBibleAIChat(
  reqBody: BibleChatRequest,
  ai: GoogleGenAI | null
): Promise<BibleChatResponse> {
  const { message, history = [], agent: forcedAgent, translation = 'LSG' } = reqBody;

  // Step 1: Retrieval (RAG)
  const ragContext = await retrieveRAGContext(message);

  // Step 2: Determine Agent via Bible AI Manager
  const { agentName, agentCategory } = determineAgent(message, ragContext, forcedAgent);

  // Build Context string for Grounding
  let groundingText = '';

  if (ragContext.retrievedVerses.length > 0) {
    groundingText += `\n--- TEXTES BIBLIQUES CANONIQUES VÉRIFIÉS (SOURCE OFFICIELLE) ---\n`;
    ragContext.retrievedVerses.forEach(v => {
      groundingText += `${v.reference} [${v.translation}] : "${v.text}"\n`;
    });
  }

  if (ragContext.matchingDictionaryTerm) {
    const t = ragContext.matchingDictionaryTerm;
    groundingText += `\n--- ENTRÉE DICTIONNAIRE BIBLIQUE VÉRIFIÉE ---\n`;
    groundingText += `Terme : ${t.term}\n`;
    groundingText += `Définition : ${t.definition}\n`;
    groundingText += `Sens biblique : ${t.biblicalMeaning}\n`;
    if (t.originalWord) groundingText += `Langue originale : ${t.originalLanguage || 'Grec/Hébreu'} - Mot : ${t.originalWord} (${t.transliteration || ''}, Strong : ${t.strongCode || 'N/A'})\n`;
    groundingText += `Occurrences : ${t.occurrences}\n`;
    groundingText += `Versets clés : ${t.keyVerses.join(', ')}\n`;
    groundingText += `Explication simple : ${t.simpleExplanation}\n`;
    groundingText += `Application : ${t.practicalApplication}\n`;
  }

  if (ragContext.matchingCharacter) {
    const c = ragContext.matchingCharacter;
    groundingText += `\n--- FICHE PERSONNAGE BIBLIQUE VÉRIFIÉE ---\n`;
    groundingText += `Nom : ${c.name} (${c.era})\n`;
    groundingText += `Signification : ${c.meaning}\n`;
    groundingText += `Rôle : ${c.role}\n`;
    groundingText += `Passages clés : ${c.keyPassages.join(', ')}\n`;
    groundingText += `Résumé : ${c.summary}\n`;
    groundingText += `Événements majeurs : ${c.majorEvents.slice(0, 4).join('; ')}\n`;
    groundingText += `Leçons spirituelles : ${c.spiritualLessons.join('; ')}\n`;
  }

  if (ragContext.matchingStory) {
    const s = ragContext.matchingStory;
    groundingText += `\n--- RÉCIT BIBLIQUE VÉRIFIÉ ---\n`;
    groundingText += `Titre : ${s.title} (${s.reference})\n`;
    groundingText += `Résumé : ${s.summary}\n`;
    groundingText += `Leçon spirituelle : ${s.spiritualLesson}\n`;
  }

  // Step 3: Generation via Gemini with RAG Grounding
  if (ai) {
    try {
      const prompt = `Tu es BIBLE AI, la plateforme biblique intelligente officielle de BÉRÉENS (inspirée de la fidélité doctrinale et de la pédagogie d'EMCI TV).
Tu incarnes le rôle de l'agent spécialisé : "${agentName}".

CONTEXTE VÉRIFIÉ ISSU DU SYSTÈME RAG (RETRIEVAL-AUGMENTED GENERATION) :
${groundingText || 'Aucun document textuel spécifique pré-indexé n\'a été extrait pour cette formulation libre. Réponds en te fondant fidèlement sur les 66 livres de la Bible.'}

QUESTION OU DEMANDE DU CROYANT :
"${message}"

RÈGLES D'OR DE FIABILITÉ ABSOLUE :
1. Tu ne dois JAMAIS inventer un verset biblique ou attribuer une fausse citation à Dieu. Cite les textes réels exacts (notamment ceux fournis dans le contexte vérifié ci-dessus).
2. Si un passage est cité, donne sa référence exacte (Livre Chapitre:Verset).
3. Structure ta réponse avec clarté pastorale :
   - Titre ou introduction éclairante
   - Explication théologique et contexte
   - Enseignement spirituel principal (Christocentrique)
   - Application concrète pour la vie de tous les jours
4. Réponds STRICTEMENT en JSON avec la structure suivante :
{
  "agentName": "${agentName}",
  "agentCategory": "${agentCategory}",
  "answer": "Explication complète en Markdown bien formaté avec sous-titres, gras, et paragraphes aérés.",
  "citedVerses": [
    {
      "reference": "Livre Chapitre:Verset",
      "text": "Texte exact du verset en français",
      "translation": "${translation}"
    }
  ],
  "practicalApplication": "Conseil pratique, édifiant et concret pour le croyant aujourd'hui.",
  "prayer": "Courte prière d'appropriation (1 ou 2 phrases sincères) pour ancrer ce message dans la vie du croyant.",
  "suggestedQuestions": [
    "Question de suite pertinente 1",
    "Question de suite pertinente 2",
    "Question de suite pertinente 3"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      // Guarantee cited verses from RAG if model did not include them
      const finalCitedVerses: CitedVerse[] = Array.isArray(parsed.citedVerses) && parsed.citedVerses.length > 0
        ? parsed.citedVerses
        : ragContext.retrievedVerses;

      return {
        agentName: parsed.agentName || agentName,
        agentCategory: parsed.agentCategory || agentCategory,
        answer: parsed.answer || 'Voici l’éclairage biblique demandé.',
        citedVerses: finalCitedVerses,
        practicalApplication: parsed.practicalApplication || 'Méditez cette parole et mettez-la en pratique aujourd’hui.',
        prayer: parsed.prayer || 'Seigneur Jésus, grave cette vérité dans mon cœur et fortifie ma foi. Amen.',
        suggestedQuestions: Array.isArray(parsed.suggestedQuestions) && parsed.suggestedQuestions.length > 0
          ? parsed.suggestedQuestions
          : [
              'Comment appliquer cela concrètement dans ma famille ?',
              'Quels sont les autres passages bibliques associés ?',
              'Peux-tu me faire une prière guidée sur ce sujet ?',
            ],
        ragSources: ragContext.ragSources,
      };
    } catch (genError) {
      console.error('[RAG] Gemini generation error, using fallback:', genError);
    }
  }

  // Step 4: Intelligent Fallback with real RAG sources (100% reliable)
  let fallbackAnswer = '';
  const fallbackVerses: CitedVerse[] = [...ragContext.retrievedVerses];

  if (ragContext.matchingDictionaryTerm) {
    const t = ragContext.matchingDictionaryTerm;
    fallbackAnswer = `### Définition & Sens Biblique : **${t.term}**\n\n` +
      `**Définition théologique :** ${t.definition}\n\n` +
      `**Sens spirituel profond :** ${t.biblicalMeaning}\n\n` +
      (t.originalWord ? `**Étymologie originale :** En ${t.originalLanguage}, le terme est **${t.originalWord}** (*${t.transliteration || ''}*, code Strong ${t.strongCode || 'N/A'}). ${t.occurrences}.\n\n` : '') +
      `**Illustration simple :** ${t.simpleExplanation}\n\n` +
      `**Personnages associés :** ${t.associatedCharacters.join(', ')}.`;
  } else if (ragContext.matchingCharacter) {
    const c = ragContext.matchingCharacter;
    fallbackAnswer = `### Portrait Biblique : **${c.name}**\n\n` +
      `**Époque & Rôle :** ${c.role} — *${c.era}*\n\n` +
      `**Signification du nom :** ${c.meaning}\n\n` +
      `**Présentation :** ${c.summary}\n\n` +
      `**Événements marquants :**\n` +
      c.majorEvents.slice(0, 4).map(e => `- ${e}`).join('\n') + '\n\n' +
      `**Enseignements spirituels pour nous :**\n` +
      c.spiritualLessons.map(l => `- ${l}`).join('\n');
  } else if (ragContext.retrievedVerses.length > 0) {
    const v = ragContext.retrievedVerses[0];
    fallbackAnswer = `### Explication de **${v.reference}**\n\n` +
      `> « ${v.text} »\n\n` +
      `Ce passage met en lumière la fidélité inébranlable de Dieu et l'assurance de Sa grâce pour chaque croyant qui place sa confiance en Jésus-Christ. ` +
      `Le texte canonique nous rappelle que la Parole de Dieu est une lampe à nos pieds et une lumière sur notre sentier (Psaume 119:105).`;
  } else {
    fallbackAnswer = `### Éclairage Biblique : ${message}\n\n` +
      `La Parole de Dieu déclare que « toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice » (2 Timothée 3:16).\n\n` +
      `Pour approfondir votre marche avec Dieu, prenez un temps de recueillement avec les Écritures, sondez les promesses divines et confiez tous vos besoins au Seigneur Jésus-Christ dans la prière.`;
    fallbackVerses.push({
      reference: '2 Timothée 3:16-17',
      text: 'Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice, afin que l’homme de Dieu soit accompli et propre à toute bonne œuvre.',
      translation: 'LSG',
    });
  }

  return {
    agentName,
    agentCategory,
    answer: fallbackAnswer,
    citedVerses: fallbackVerses,
    practicalApplication: ragContext.matchingDictionaryTerm?.practicalApplication ||
      'Consacrez du temps aujourd’hui à méditer ces versets dans votre cœur et à les partager avec un frère ou une sœur.',
    prayer: 'Seigneur Jésus, grave cette vérité vivante dans mon esprit. Guide chacun de mes pas par Ton Saint-Esprit. Amen.',
    suggestedQuestions: [
      'Quels sont les autres versets clés associés à ce sujet ?',
      'Comment puis-je vivre cette vérité concrètement dans mon quotidien ?',
      'Quelle prière puis-je faire pour grandir dans cette foi ?',
    ],
    ragSources: ragContext.ragSources,
  };
}
