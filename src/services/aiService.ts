import { KidsStory, TranslationKey } from '../types';

export interface AISearchResult {
  theme: string;
  summary: string;
  results: {
    reference: string;
    text: string;
    relevance: string;
  }[];
}

export interface AISpiritualGrowthResult {
  totalPoints: number;
  growthTier: string;
  streakBonus: number;
  evaluation: string;
  nextMilestone: string;
  recommendedPassage: string;
}

export interface AIVerseInsightResult {
  context: string;
  spiritualMeaning: string;
  practicalApplication: string;
  prayer: string;
}

export interface BibleAIChatResponse {
  agentName: string;
  agentCategory: string;
  answer: string;
  citedVerses: {
    reference: string;
    text: string;
    translation: string;
  }[];
  practicalApplication?: string;
  prayer?: string;
  suggestedQuestions: string[];
  ragSources?: {
    type: 'scripture' | 'dictionary' | 'character' | 'story';
    title: string;
    detail: string;
  }[];
}

export interface BibleAIChatRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; text: string }[];
  agent?: string;
  translation?: TranslationKey;
}

export const AIService = {
  /**
   * Main Bible AI Chat: RAG-grounded exegesis, theological analysis, and pastoral answers
   */
  async sendBibleAIChat(payload: BibleAIChatRequest): Promise<BibleAIChatResponse> {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Erreur API Bible AI: ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn('Fallback locally in AIService.sendBibleAIChat:', err);
      return {
        agentName: 'Bible AI Manager',
        agentCategory: 'Conseil & Exégèse',
        answer: `### Éclairage Biblique\n\n« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. » (Psaume 119:105)\n\nFace à votre question : *« ${payload.message} »*, l'Écriture nous encourage à sonder la vérité divine et à nous confier en Christ de tout notre cœur.`,
        citedVerses: [
          {
            reference: 'Psaume 119:105',
            text: 'Ta parole est une lampe à mes pieds, Et une lumière sur mon sentier.',
            translation: payload.translation || 'LSG',
          },
        ],
        practicalApplication: 'Prenez 5 minutes de calme dans la présence de Dieu pour prier et méditer les Écritures.',
        prayer: 'Seigneur, éclaire mes pas par Ta vérité et remplis mon cœur de Ta paix. Amen.',
        suggestedQuestions: [
          'Quels sont les versets fondamentaux sur ce sujet ?',
          'Comment appliquer ce principe dans ma vie quotidienne ?',
          'Peux-tu me faire une étude biblique complète ?',
        ],
      };
    }
  },
  async searchThematic(query: string, translation: TranslationKey = 'LSG'): Promise<AISearchResult> {
    try {
      const res = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, translation }),
      });

      if (!res.ok) {
        throw new Error('Erreur réseau');
      }

      return await res.json();
    } catch {
      // Fallback
      return {
        theme: `Thème Biblique : ${query}`,
        summary: `Passages fondamentaux sur le thème « ${query} » pour fortifier votre marche spirituelle.`,
        results: [
          {
            reference: 'Psaume 23:1-3',
            text: "L'Éternel est mon berger: je ne manquerai de rien. Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles.",
            relevance: 'La confiance en la souveraineté et la sollicitude divine.',
          },
          {
            reference: 'Philippiens 4:6-7',
            text: 'Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.',
            relevance: 'L’antidote apostolique contre l’inquiétude et le trouble du cœur.',
          },
          {
            reference: 'Romains 8:28',
            text: 'Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.',
            relevance: 'L’assurance absolue de la victoire en Christ à travers chaque circonstance.',
          },
        ],
      };
    }
  },

  async evaluateSpiritualGrowth(
    activity: {
      chaptersRead: number;
      quizzesCompleted: number;
      notesCount: number;
      daysStreak: number;
      prayerMinutes: number;
    },
    memberName: string,
    groupName: string
  ): Promise<AISpiritualGrowthResult> {
    try {
      const res = await fetch('/api/ai/spiritual-growth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userActivity: activity, memberName, groupName }),
      });

      if (!res.ok) throw new Error('Erreur API');
      return await res.json();
    } catch {
      const totalPoints =
        activity.chaptersRead * 15 +
        activity.quizzesCompleted * 25 +
        activity.notesCount * 10 +
        activity.daysStreak * 20;

      return {
        totalPoints,
        growthTier: totalPoints > 300 ? 'Béréen Enseignant' : 'Béréen Zélé',
        streakBonus: activity.daysStreak * 10,
        evaluation: `Félicitations ${memberName} ! Votre régularité au sein de la ${groupName} porte du fruit. Votre persévérance dans la Parole honore le Seigneur.`,
        nextMilestone: 'Méditer 3 chapitres et valider le quiz de la semaine.',
        recommendedPassage: 'Josué 1:8 - Que ce livre de la loi ne s’éloigne point de ta bouche.',
      };
    }
  },

  async getVerseInsight(reference: string, text: string, question?: string): Promise<AIVerseInsightResult> {
    try {
      const res = await fetch('/api/ai/verse-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, text, question }),
      });

      if (!res.ok) throw new Error('Erreur API');
      return await res.json();
    } catch {
      return {
        context: `Contexte canonique et théologique de ${reference}.`,
        spiritualMeaning:
          'Ce passage met en lumière la souveraineté de Dieu, Sa miséricorde inépuisable et Son alliance éternelle scellée en Jésus-Christ.',
        practicalApplication:
          'Prenez un temps de silence pour remercier Dieu de Sa fidélité et appliquez cette vérité dans vos choix du jour.',
        prayer:
          'Seigneur Jésus, merci pour Ta Parole vivante. Remplis-moi de Ton Saint-Esprit pour vivre selon cette vérité chaque jour. Amen.',
      };
    }
  },

  async generateStoryWithAI(
    userPrompt: string,
    target: 'kids' | 'general' = 'kids'
  ): Promise<KidsStory> {
    try {
      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, target }),
      });

      if (!res.ok) throw new Error('Erreur API Story');
      const data = await res.json();
      return data;
    } catch {
      return {
        id: `story-ai-${Date.now()}`,
        title: `L'Aventure biblique : ${userPrompt}`,
        passage: 'Récit des Saintes Écritures',
        heroName: 'Héros de la Foi',
        moral: 'Dieu est toujours avec ceux qui marchent dans l’obéissance et la foi.',
        coverImage: '/src/assets/images/kids_noahs_ark_1791221022432.jpg',
        scenes: [
          {
            dialogue: `« Voici le grand récit inspiré de ${userPrompt} ! »`,
            caption: 'Dans les temps bibliques, Dieu manifestait Sa puissance et Son amour pour Son peuple.',
            soundEffect: 'Mélodie lumineuse et carillons célestes',
          },
          {
            dialogue: '« Même quand les obstacles semblaient immenses, la foi a permis de déplacer les montagnes ! »',
            caption: 'Le courage divin a rempli le cœur des croyants.',
            soundEffect: 'Bruits de victoire et applaudissements joyeux',
          },
          {
            dialogue: '« Rendons grâces à Dieu car Sa bonté dure pour toujours ! »',
            caption: 'Le peuple chante des louanges joyeuses au Seigneur.',
            soundEffect: 'Cantique de fête et trompettes',
          },
        ],
        quiz: [
          {
            question: `Quelle vertu fondamentale nous rappelle l'histoire de ${userPrompt} ?`,
            choices: [
              'La confiance totale en Dieu',
              'Le découragement rapide',
              'La paresse et la rancune',
              'La vantardise',
            ],
            correctIndex: 0,
            funFact: 'La Bible nous enseigne que tout est possible à celui qui croit !',
          },
        ],
      };
    }
  },
};
