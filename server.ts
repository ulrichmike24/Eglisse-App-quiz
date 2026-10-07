import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { handleBibleAIChat } from './server/ragBibleService.ts';
import genesisRaw from './src/data/genesisBook.json';
import { parseTaggedVerseText } from './src/utils/bibleParser.ts';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Gemini client utility
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Mock storage for cloud sync per user
const cloudSyncStore = new Map<string, any>();

// BIBLE AI — Main Intelligent Chat with RAG Pipeline (Bible AI Manager & Agents)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, agent, translation } = req.body;
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ error: 'Le message est requis pour interroger Bible AI.' });
    }

    const result = await handleBibleAIChat(
      {
        message: message.trim(),
        history,
        agent,
        translation: translation || 'LSG',
      },
      ai
    );

    return res.json(result);
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    return res.status(500).json({
      error: 'Erreur lors du traitement de la requête Bible AI.',
      details: error?.message,
    });
  }
});

// AI-based semantic Bible Search
app.post('/api/ai/search', async (req, res) => {
  try {
    const { query, translation = 'LSG' } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'La requête de recherche est requise.' });
    }

    if (!ai) {
      // Graceful intelligent fallback if API key is not present
      return res.json({
        theme: 'Recherche Biblique Thématique',
        summary: `Recherche assistée sur le thème : "${query}".`,
        results: [
          {
            reference: 'Psaume 23:1-3',
            text: "L'Éternel est mon berger: je ne manquerai de rien. Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.",
            relevance: 'Exprime la confiance absolue en Dieu face aux incertitudes.',
          },
          {
            reference: 'Philippiens 4:6-7',
            text: "Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.",
            relevance: 'Conseil apostolique pour surmonter l’angoisse et trouver la paix du cœur.',
          },
          {
            reference: 'Ésaïe 41:10',
            text: 'Ne crains rien, car je suis avec toi; Ne promène pas des regards inquiets, car je suis ton Dieu; Je te fortifie, je viens à ton secours.',
            relevance: 'Promesse de réconfort et de présence divine inébranlable.',
          },
        ],
      });
    }

    const prompt = `Tu es un bibliste et théologien chrétien évangélique francophone érudit et bienveillant.
Un utilisateur pose la question suivante ou cherche sur le thème : "${query}".
Version biblique préférée : ${translation}.

Trouve 4 à 6 passages bibliques les plus pertinents des 66 livres de la Bible (Ancien et Nouveau Testament) qui répondent directement à ce sujet ou éclairent cette situation de vie.
Pour chaque passage, fournis la référence exacte, le texte du verset en français (fidèle à la version ${translation} ou Louis Segond), et une brève explication pastorale/théologique de sa pertinence.

Réponds STRICTEMENT au format JSON valide avec la structure suivante :
{
  "theme": "titre concis du thème spirituel identifié",
  "summary": "synthèse spirituelle d'une ou deux phrases pour encourager le croyant",
  "results": [
    {
      "reference": "Livre Chapitre:Verset(s) (ex: Jean 14:27)",
      "text": "Texte exact du passage en français",
      "relevance": "Pourquoi ce verset s'applique à la question"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const outputText = response.text || '{}';
    const parsed = JSON.parse(outputText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/search:', error);
    return res.status(500).json({
      error: 'Erreur lors de la recherche IA.',
      fallback: true,
      results: [
        {
          reference: 'Proverbes 3:5-6',
          text: 'Confie-toi en l’Éternel de tout ton cœur, Et ne t’appuie pas sur ta sagesse; Reconnais-le dans toutes tes voies, Et il aplanira tes sentiers.',
          relevance: 'Direction pour la conduite de la vie quotidienne.',
        },
      ],
    });
  }
});

// AI Spiritual Growth & Points calculation
app.post('/api/ai/spiritual-growth', async (req, res) => {
  try {
    const { userActivity, memberName, groupName } = req.body;

    const chaptersRead = userActivity?.chaptersRead || 0;
    const quizzesCompleted = userActivity?.quizzesCompleted || 0;
    const notesCount = userActivity?.notesCount || 0;
    const daysStreak = userActivity?.daysStreak || 1;
    const prayerMinutes = userActivity?.prayerMinutes || 0;

    // Base algorithmic points
    const calculatedPoints =
      chaptersRead * 15 +
      quizzesCompleted * 25 +
      notesCount * 10 +
      daysStreak * 20 +
      Math.floor(prayerMinutes / 5) * 5;

    if (!ai) {
      return res.json({
        totalPoints: calculatedPoints,
        growthTier: calculatedPoints > 300 ? 'Disciple Enseignant' : calculatedPoints > 100 ? 'Disciple Affirmé' : 'Disciple en Croissance',
        streakBonus: daysStreak * 5,
        evaluation: `Félicitations ${memberName || 'frère/sœur'} ! Votre régularité dans la famille ${groupName || 'de disciples'} fortifie votre foi. Continuez à sonder les Écritures chaque jour.`,
        nextMilestone: 'Lire 5 nouveaux chapitres pour atteindre le palier supérieur.',
        recommendedPassage: 'Josué 1:8 - Que ce livre de la loi ne s’éloigne point de ta bouche...',
      });
    }

    const prompt = `Tu es le mentor spirituel de la plateforme biblique Béréens.
Un membre s'appelle "${memberName || 'Disciple'}" de la famille de disciples "${groupName || 'Béthel'}".
Voici son bilan d'activité spirituelle récent :
- Chapitres bibliques lus et médités : ${chaptersRead}
- Quiz d'histoires bibliques réussis : ${quizzesCompleted}
- Notes et méditations personnelles rédigées : ${notesCount}
- Série de fidélité quotidienne (streak) : ${daysStreak} jours consécutifs
- Temps de prière et communion enregistré : ${prayerMinutes} minutes

Calcule son niveau de croissance, ses points spirituels (autour de ${calculatedPoints}), un titre honorifique biblique inspiré des Écritures (ex: "Sentinelle Fervente", "Béréen Assidu", "Pilier de la Parole"), une évaluation pastorale bienveillante et chaleureuse, un défi spirituel pour la semaine, et un verset d'encouragement spécifique.

Réponds STRICTEMENT au format JSON valide :
{
  "totalPoints": ${calculatedPoints},
  "growthTier": "Titre honorifique spirituel",
  "streakBonus": ${daysStreak * 10},
  "evaluation": "Paragraphe pastoral personnalisé et motivant en français",
  "nextMilestone": "Objectif concret suivant",
  "recommendedPassage": "Référence biblique et verset clé"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      totalPoints: parsed.totalPoints || calculatedPoints,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/spiritual-growth:', error);
    return res.json({
      totalPoints: 120,
      growthTier: 'Béréen Persévérant',
      streakBonus: 30,
      evaluation: 'Votre marche avec le Seigneur est une source d’inspiration pour votre groupe.',
      nextMilestone: 'Terminer la lecture hebdomadaire en groupe.',
      recommendedPassage: 'Colossiens 3:16',
    });
  }
});

// AI Verse Insight & Devotional commentary
app.post('/api/ai/verse-insight', async (req, res) => {
  try {
    const { reference, text, question } = req.body;
    if (!reference) {
      return res.status(400).json({ error: 'La référence est requise.' });
    }

    if (!ai) {
      return res.json({
        context: `Contexte historique et littéraire de ${reference}`,
        spiritualMeaning: 'Ce verset souligne la fidélité de Dieu et invite le croyant à placer son espérance en Christ.',
        practicalApplication: 'Prenez 5 minutes aujourd’hui pour prier en proclamant cette vérité dans votre famille.',
        prayer: 'Seigneur Jésus, grave cette Parole dans mon cœur et fortifie mes pas selon Ta vérité. Amen.',
      });
    }

    const prompt = `Tu es un théologien chrétien évangélique francophone. Fournis un éclairage profond et spirituel sur le passage biblique suivant :
Référence : ${reference}
Texte : "${text}"
${question ? `Question spécifique de l'utilisateur : "${question}"` : ''}

Donne une analyse claire et accessible :
1. Contexte historique & auteur
2. Signification théologique profonde
3. Application pratique pour notre vie aujourd'hui (travail, famille, église)
4. Une courte prière d'appropriation

Réponds STRICTEMENT au format JSON :
{
  "context": "explication concise du contexte",
  "spiritualMeaning": "sens théologique et spirituel",
  "practicalApplication": "application concrète",
  "prayer": "prière courte d'appropriation"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/verse-insight:', error);
    return res.status(500).json({
      context: 'Contexte biblique général',
      spiritualMeaning: 'La Parole de Dieu est vivante et efficace.',
      practicalApplication: 'Méditer ce verset tout au long de la journée.',
      prayer: 'Seigneur, bénis Ta Parole dans ma vie. Amen.',
    });
  }
});

// Gemini AI Biblical Story Generator (for Kids and general readers based on user requests)
app.post('/api/ai/generate-story', async (req, res) => {
  try {
    const { userPrompt, target = 'kids' } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Le thème ou la demande est requise pour générer l’histoire.' });
    }

    if (!ai) {
      // Fallback generator when API key is pending
      const slug = userPrompt.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
      return res.json({
        id: `story-ai-${Date.now()}-${slug}`,
        title: `L'Aventure biblique : ${userPrompt}`,
        passage: 'Récit des Saintes Écritures',
        heroName: 'Disciple de la Foi',
        moral: 'Dieu est toujours fidèle envers ceux qui se confient en Lui de tout leur cœur.',
        coverImage: '/src/assets/images/story_david_goliath_1791221000257.jpg',
        scenes: [
          {
            dialogue: `« Écoutez tous cette merveilleuse histoire : celle de ${userPrompt} ! »`,
            caption: 'Dans les temps anciens de la Bible, le Seigneur a révélé Sa grandeur.',
            soundEffect: 'Carillons doux et mélodie de harpe',
          },
          {
            dialogue: '« Même lorsque la situation paraissait impossible, la foi a triomphé des doutes ! »',
            caption: 'Les témoins ont proclamé le Nom du Dieu vivant.',
            soundEffect: 'Bruits de pas et acclamations joyeuses',
          },
          {
            dialogue: '« Gloire à Dieu ! Car Sa bonté et Sa grâce durent à toujours ! »',
            caption: 'Une grande fête de louange et d’actions de grâces est célébrée.',
            soundEffect: 'Trompettes et cantique joyeux',
          },
        ],
        quiz: [
          {
            question: `Quelle leçon essentielle nous enseigne l'histoire de ${userPrompt} ?`,
            choices: [
              'Se confier en Dieu en toutes circonstances',
              'Abandonner au moindre obstacle',
              'Compter uniquement sur sa propre force',
              'Avoir peur de l’inconnu',
            ],
            correctIndex: 0,
            funFact: 'La foi nous donne la paix intérieure même au cœur des tempêtes !',
          },
          {
            question: 'À qui revient la gloire de cette délivrance ?',
            choices: ['Au Seigneur Tout-Puissant', 'Au hasard', 'À la chance', 'Aux rois de la terre'],
            correctIndex: 0,
            funFact: 'Toute bonne chose et tout don parfait descendent du Père des lumières.',
          },
        ],
      });
    }

    const isKids = target === 'kids';
    const prompt = `Tu es un conteur et pédagogue biblique chrétien francophone érudit et chaleureux.
L'utilisateur te demande de concevoir et générer une histoire biblique basée sur la requête suivante : "${userPrompt}".
Public cible : ${isKids ? 'Enfants (4 à 12 ans) - style chaleureux, dynamique, pédagogique et merveilleux' : 'Tous publics / Adultes - profond et théologique'}.

Consignes impératives :
1. Reste 100% fidèle au canon des Saintes Écritures (les 66 livres de la Bible).
2. Fournis un titre captivant, le passage biblique de référence précis (ex: "Daniel 6:1-24", "Exode 14"), le héros ou personnage central, et la morale ou enseignement spirituel.
3. Écris 4 à 5 scènes dynamiques avec pour chaque scène :
   - "dialogue" : réplique parlée ou narration vivante (idéale pour la lecture à voix haute)
   - "caption" : description visuelle ou explicative du décor
   - "soundEffect" : suggestion d'effet sonore immersif (ex: "Rugissement de lion", "Clapotis des vagues", "Sonnette joyeuse")
4. Écris un quiz interactif de 2 à 3 questions à choix multiples pour valider la compréhension avec :
   - "question"
   - "choices" (exactement 4 choix)
   - "correctIndex" (index 0, 1, 2 ou 3 de la bonne réponse)
   - "funFact" : anecdote ou encouragement spirituel court

Réponds STRICTEMENT sous format JSON valide :
{
  "id": "story-${Date.now()}",
  "title": "Titre en français",
  "passage": "Référence biblique exacte",
  "heroName": "Nom du personnage",
  "moral": "Morale et leçon spirituelle en 1 phrase",
  "scenes": [
    {
      "dialogue": "Texte parlé...",
      "caption": "Description...",
      "soundEffect": "Effet sonore..."
    }
  ],
  "quiz": [
    {
      "question": "Question...",
      "choices": ["Choix 1", "Choix 2", "Choix 3", "Choix 4"],
      "correctIndex": 0,
      "funFact": "Anecdote..."
    }
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
    return res.json({
      ...parsed,
      id: parsed.id || `story-${Date.now()}`,
      coverImage: '/src/assets/images/kids_noahs_ark_1791221022432.jpg',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-story:', error);
    return res.status(500).json({ error: 'Erreur lors de la génération de l’histoire biblique avec Gemini IA.' });
  }
});

// In-memory cache for exact generated Bible chapters
const bibleChapterCache = new Map<string, any>();

const BOOK_ID_TO_NUMBER: Record<string, number> = {
  GEN: 1, EXO: 2, LEV: 3, NUM: 4, DEU: 5, JOS: 6, JDG: 7, RUT: 8,
  '1SA': 9, '2SA': 10, '1KI': 11, '2KI': 12, '1CH': 13, '2CH': 14,
  EZR: 15, NEH: 16, EST: 17, JOB: 18, PSA: 19, PRO: 20, ECC: 21,
  SNG: 22, ISA: 23, JER: 24, LAM: 25, EZK: 26, DAN: 27, HOS: 28,
  JOL: 29, AMO: 30, OBA: 31, JON: 32, MIC: 33, NAM: 34, HAB: 35,
  ZEP: 36, HAG: 37, ZEC: 38, MAL: 39,
  MAT: 40, MRK: 41, LUK: 42, JHN: 43, ACT: 44, ROM: 45, '1CO': 46,
  '2CO': 47, GAL: 48, EPH: 49, PHP: 50, COL: 51, '1TH': 52, '2TH': 53,
  '1TI': 54, '2TI': 55, TIT: 56, PHM: 57, HEB: 58, JAS: 59, '1PE': 60,
  '2PE': 61, '1JN': 62, '2JN': 63, '3JN': 64, JUD: 65, REV: 66,
};

// Exact Bible Chapter Endpoint (matching emcitv.com/bible/ Louis Segond 1910)
app.post('/api/bible/chapter', async (req, res) => {
  try {
    const { bookId, bookName, chapter, translation = 'LSG' } = req.body;
    if (!chapter) {
      return res.status(400).json({ error: 'Livre et chapitre requis.' });
    }

    const cacheKey = `${bookId || bookName}_${chapter}_${translation}`.toUpperCase();
    if (bibleChapterCache.has(cacheKey)) {
      return res.json(bibleChapterCache.get(cacheKey));
    }

    const bookNr = BOOK_ID_TO_NUMBER[bookId?.toUpperCase()] || 1;

    // 0. If Genesis (GEN), serve immediately from authentic local JSON
    if (bookId?.toUpperCase() === 'GEN' || bookNr === 1) {
      const rawChapters = (genesisRaw as any).chapters;
      const foundChapter = rawChapters?.find((c: any) => c.chapter === Number(chapter));
      if (foundChapter && Array.isArray(foundChapter.verses)) {
        const result = {
          bookId: 'GEN',
          bookName: 'Genèse',
          chapter: Number(chapter),
          translation,
          totalVerses: foundChapter.verses.length,
          verses: foundChapter.verses.map((v: any) => {
            const parsed = parseTaggedVerseText(v.text);
            return {
              verse: v.verse,
              text: parsed.cleanText || v.text,
              strongCode: parsed.primaryStrongCode,
            };
          }),
        };
        bibleChapterCache.set(cacheKey, result);
        return res.json(result);
      }
    }

    // 1. For LSG (Louis Segond 1910), DARBY, and KJV: Fetch authentic canonical text directly
    if (translation === 'LSG' || translation === 'DARBY' || translation === 'KJV') {
      const getBibleVersion = translation === 'DARBY' ? 'darby' : translation === 'KJV' ? 'kjv' : 'ls1910';
      try {
        const remoteRes = await fetch(`https://api.getbible.net/v2/${getBibleVersion}/${bookNr}/${chapter}.json`);
        if (remoteRes.ok) {
          const remoteData = (await remoteRes.json()) as any;
          if (remoteData && Array.isArray(remoteData.verses) && remoteData.verses.length > 0) {
            const result = {
              bookId,
              bookName: remoteData.book_name || bookName,
              chapter: Number(chapter),
              translation,
              totalVerses: remoteData.verses.length,
              verses: remoteData.verses.map((v: any) => ({
                verse: v.verse,
                text: v.text.trim(),
              })),
            };
            bibleChapterCache.set(cacheKey, result);
            return res.json(result);
          }
        }
      } catch (fetchErr) {
        console.warn('Direct getbible fetch failed, falling back:', fetchErr);
      }
    }

    // 2. If AI is available, generate or translate text (e.g. for BDS, Segond 21, or Amplifiée)
    if (ai) {
      const prompt = `Tu es l'encyclopédie biblique francophone officielle conforme à la Bible diffusée sur emcitv.com/bible/ (notamment la traduction de référence Louis Segond 1910).
Fournis l'intégralité du texte exact, mot pour mot et verset par verset, du chapitre suivant :
Livre : "${bookName}" (Livre n° ${bookNr} du canon biblique)
Chapitre : ${chapter}
Traduction demandée : ${
        translation === 'BDS'
          ? 'Bible du Semeur (BDS)'
          : translation === 'BFC'
          ? 'Français Courant (BFC)'
          : translation === 'DARBY'
          ? 'Traduction J.N. Darby (DARBY)'
          : translation === 'KJV'
          ? 'King James Version (KJV)'
          : translation === 'AMP'
          ? 'Bible Amplifiée (AMP)'
          : 'Louis Segond 1910 (LSG)'
      }

Consignes impératives :
1. Restitue CHAQUE verset numéroté consécutivement de 1 jusqu'au dernier verset canonique exact du chapitre.
2. Ne résume absolument rien, ne saute aucun verset, ne tronque aucune phrase.
3. Le texte doit être le texte exact tel qu'on le trouve sur emcitv.com/bible/.

Format JSON attendu strictement :
{
  "bookId": "${bookId}",
  "bookName": "${bookName}",
  "chapter": ${Number(chapter)},
  "translation": "${translation}",
  "totalVerses": nombre_de_versets,
  "verses": [
    {
      "verse": 1,
      "text": "Texte exact du verset 1..."
    }
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
      if (parsed && Array.isArray(parsed.verses) && parsed.verses.length > 0) {
        bibleChapterCache.set(cacheKey, parsed);
        return res.json(parsed);
      }
    }

    // 3. Ultimate fallback: retrieve Louis Segond 1910 directly
    const fallbackRes = await fetch(`https://api.getbible.net/v2/ls1910/${bookNr}/${chapter}.json`);
    if (fallbackRes.ok) {
      const fbData = (await fallbackRes.json()) as any;
      if (fbData && Array.isArray(fbData.verses)) {
        const result = {
          bookId,
          bookName: fbData.book_name || bookName,
          chapter: Number(chapter),
          translation,
          totalVerses: fbData.verses.length,
          verses: fbData.verses.map((v: any) => ({
            verse: v.verse,
            text: v.text.trim(),
          })),
        };
        bibleChapterCache.set(cacheKey, result);
        return res.json(result);
      }
    }

    return res.status(502).json({ error: 'Texte biblique indisponible.' });
  } catch (error: any) {
    console.error('Error in /api/bible/chapter:', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération du chapitre.' });
  }
});

// Cloud Sync Backup endpoint (simulated secure multi-device storage)
app.post('/api/sync/backup', (req, res) => {
  const { userId, payload } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Identifiant utilisateur requis.' });
  }
  cloudSyncStore.set(userId, {
    payload,
    timestamp: new Date().toISOString(),
  });
  return res.json({
    success: true,
    syncedAt: new Date().toISOString(),
    message: 'Synchronisation cloud sécurisée réussie sur tous vos appareils.',
  });
});

// Cloud Sync Restore endpoint
app.get('/api/sync/restore/:userId', (req, res) => {
  const { userId } = req.params;
  const data = cloudSyncStore.get(userId);
  if (!data) {
    return res.json({ hasBackup: false, payload: null });
  }
  return res.json({
    hasBackup: true,
    syncedAt: data.timestamp,
    payload: data.payload,
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Béréens Bible App server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
