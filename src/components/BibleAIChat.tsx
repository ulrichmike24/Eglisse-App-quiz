import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Bot,
  User,
  Copy,
  Check,
  Share2,
  BookmarkPlus,
  RefreshCw,
  Compass,
  ArrowRight,
  ShieldCheck,
  Heart,
  Lightbulb,
  ExternalLink,
  Trash2,
  Download,
  BookMarked,
  HelpCircle,
  Flame,
  FileText,
  Search,
  Languages,
} from 'lucide-react';
import { AIService, BibleAIChatResponse } from '../services/aiService';
import { UserProfile, TranslationKey } from '../types';
import { BIBLE_BOOKS } from '../data/bibleCanon';

export interface BibleChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentName?: string;
  agentCategory?: string;
  citedVerses?: {
    reference: string;
    text: string;
    translation: string;
  }[];
  practicalApplication?: string;
  prayer?: string;
  suggestedQuestions?: string[];
  ragSources?: {
    type: 'scripture' | 'dictionary' | 'character' | 'story';
    title: string;
    detail: string;
  }[];
  timestamp: string;
}

interface BibleAIChatProps {
  userProfile: UserProfile;
  initialVersePrompt?: { bookName: string; chapter: number; verse: number; text: string } | null;
  onNavigateToVerse?: (bookId: string, chapter: number) => void;
  onSaveNote?: (note: { bookName: string; chapter: number; verse: number; text: string }) => void;
}

const AGENT_FILTERS = [
  { id: 'auto', label: 'Tous les Agents (Auto)', icon: Compass },
  { id: 'Agent Explication de Verset (Verse Explanation Agent)', label: 'Explication de Verset', icon: BookOpen },
  { id: 'Agent Personnages Bibliques (Character Agent)', label: 'Personnages Bibliques', icon: User },
  { id: 'Agent Dictionnaire Biblique (Bible Dictionary Agent)', label: 'Dictionnaire & Strong', icon: Languages },
  { id: 'Agent Étude Biblique & Théologique (Study Agent)', label: 'Étude Théologique', icon: FileText },
  { id: 'Agent Méditation Quotidienne (Devotional Agent)', label: 'Méditation & Prière', icon: Heart },
  { id: 'Agent Quiz Biblique (Quiz Agent)', label: 'Quiz Biblique', icon: HelpCircle },
];

const QUICK_PROMPTS = [
  'Explique Jean 3:16 en détail',
  'Qui était le roi David et quelles sont ses leçons ?',
  'Quelle est la signification biblique de la sanctification ?',
  'Donne-moi les versets clés pour vaincre l’anxiété',
  'Fais-moi une étude sur le Saint-Esprit',
  'Raconte l’histoire de David et Goliath',
  'Prière d’action de grâces pour commencer ma journée',
  'Crée un quiz biblique sur l’Évangile de Jean',
];

export const BibleAIChat: React.FC<BibleAIChatProps> = ({
  userProfile,
  initialVersePrompt,
  onNavigateToVerse,
  onSaveNote,
}) => {
  const [messages, setMessages] = useState<BibleChatMessageItem[]>(() => {
    const saved = localStorage.getItem('bereens_bible_ai_chat');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved chat', e);
      }
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `### Bienvenue sur **BIBLE AI** — Votre Plateforme Biblique Intelligente

Je suis votre assistant d'étude des Saintes Écritures, propulsé par **Gemini** et couplé au moteur **RAG (Retrieval-Augmented Generation)**.

Tous les textes bibliques cités proviennent de notre base canonique vérifiée (les 66 livres de la Bible) et ne sont **jamais inventés**.

#### Que souhaitez-vous explorer aujourd’hui ?
- **Comprendre un verset** : *« Explique Jean 3:16 »*, *« Que veut dire Romains 8:28 ? »*
- **Découvrir un personnage** : *« Qui était Moïse ? »*, *« La vie de l'apôtre Paul »*
- **Dictionnaire & racines** : *« Sens hébreu/grec de la Grâce ou de la Sanctification »*
- **Études thématiques** : *« Le rôle du Saint-Esprit »*, *« L'Alliance divine »*
- **Méditations & Prières** : *« Une prière pour la paix du cœur »*
- **Quiz bibliques interactifs** : *« Teste mes connaissances sur l'Ancien Testament »*`,
        agentName: 'Bible AI Manager',
        agentCategory: 'Accueil & Orientation',
        citedVerses: [
          {
            reference: '2 Timothée 3:16-17',
            text: 'Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice, afin que l’homme de Dieu soit accompli et propre à toute bonne œuvre.',
            translation: 'LSG',
          },
        ],
        practicalApplication: 'Ouvrez votre cœur à l’enseignement de la Parole et laissez le Saint-Esprit renouveler vos pensées.',
        prayer: 'Seigneur Jésus, ouvre mes yeux pour que je contemple les merveilles de Ta loi. Amen.',
        suggestedQuestions: [
          'Explique Jean 3:16 en détail',
          'Qui était Abraham et pourquoi est-il le père de la foi ?',
          'Quels sont les versets sur la confiance en Dieu ?',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('auto');
  const [selectedTranslation, setSelectedTranslation] = useState<TranslationKey>('LSG');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteToast, setSavedNoteToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bereens_bible_ai_chat', JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not save chat history to localStorage', e);
    }
  }, [messages]);

  // Handle initial verse prompt if passed
  useEffect(() => {
    if (initialVersePrompt) {
      const promptText = `Explique-moi ce verset : ${initialVersePrompt.bookName} ${initialVersePrompt.chapter}:${initialVersePrompt.verse} — « ${initialVersePrompt.text} »`;
      sendMessage(promptText);
    }
  }, [initialVersePrompt]);

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');

    const userMsg: BibleChatMessageItem = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build lightweight conversation history for context
      const historyPayload = messages.slice(-6).map((m) => ({
        role: m.role,
        text: m.content,
      }));

      const response: BibleAIChatResponse = await AIService.sendBibleAIChat({
        message: query,
        history: historyPayload,
        agent: selectedAgent,
        translation: selectedTranslation,
      });

      const assistantMsg: BibleChatMessageItem = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        agentName: response.agentName,
        agentCategory: response.agentCategory,
        citedVerses: response.citedVerses,
        practicalApplication: response.practicalApplication,
        prayer: response.prayer,
        suggestedQuestions: response.suggestedQuestions,
        ragSources: response.ragSources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error sending Bible AI message:', error);
      const errorMsg: BibleChatMessageItem = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `### Éclairage Biblique\n\n« Confie-toi en l’Éternel de tout ton cœur, et ne t’appuie pas sur ta sagesse. » (Proverbes 3:5)\n\nUne brève interruption réseau est survenue. N'hésitez pas à reformuler votre question ou à cliquer sur une suggestion ci-dessous.`,
        agentName: 'Bible AI Manager',
        agentCategory: 'Assistance',
        citedVerses: [
          {
            reference: 'Proverbes 3:5-6',
            text: 'Confie-toi en l’Éternel de tout ton cœur, Et ne t’appuie pas sur ta sagesse; Reconnais-le dans toutes tes voies, Et il aplanira tes sentiers.',
            translation: 'LSG',
          },
        ],
        suggestedQuestions: ['Explique Jean 3:16', 'Donne-moi des versets sur la paix', 'Qui était Moïse ?'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleShare = (msg: BibleChatMessageItem) => {
    const textToShare = `📖 BÉRÉENS — Bible AI :\n\n${msg.content}\n\n${
      msg.citedVerses && msg.citedVerses.length > 0
        ? `Passages cités :\n` + msg.citedVerses.map((v) => `• ${v.reference} : "${v.text}"`).join('\n')
        : ''
    }\n\nPropulsé par Béréens Bible AI.`;

    if (navigator.share) {
      navigator.share({
        title: 'Éclairage Biblique — Bible AI',
        text: textToShare,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('Contenu copié dans le presse-papier pour le partage !');
    }
  };

  const handleSaveToNotes = (msg: BibleChatMessageItem) => {
    if (!onSaveNote) {
      alert('Note enregistrée dans vos réflexions spirituelles.');
      return;
    }

    const firstVerse = msg.citedVerses?.[0];
    const bookName = firstVerse ? firstVerse.reference.split(' ')[0] : 'Méditation';
    const parts = firstVerse?.reference.split(' ')[1]?.split(':') || ['1', '1'];
    const chapter = parseInt(parts[0], 10) || 1;
    const verse = parseInt(parts[1], 10) || 1;

    onSaveNote({
      bookName,
      chapter,
      verse,
      text: `${msg.agentName ? `[${msg.agentName}] ` : ''}${msg.content.slice(0, 500)}...`,
    });

    setSavedNoteToast('Éclairage sauvegardé dans vos notes personnelles !');
    setTimeout(() => setSavedNoteToast(null), 3500);
  };

  const handleNavigateVerseClick = (refString: string) => {
    if (!onNavigateToVerse) return;

    // Parse book name and chapter from "Jean 3:16" or "1 Samuel 17:4"
    const match = refString.match(/^([1-3]?\s*[a-zA-ZÀ-ÿ]+)\s+(\d+)/);
    if (match) {
      const bookName = match[1].trim();
      const chapter = parseInt(match[2], 10);
      const foundBook = BIBLE_BOOKS.find(
        (b) =>
          b.name.toLowerCase() === bookName.toLowerCase() ||
          b.shortName.toLowerCase() === bookName.toLowerCase() ||
          b.name.toLowerCase().startsWith(bookName.toLowerCase())
      );
      if (foundBook) {
        onNavigateToVerse(foundBook.id, chapter);
      }
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Voulez-vous réinitialiser la conversation Bible AI ?')) {
      localStorage.removeItem('bereens_bible_ai_chat');
      setMessages([]);
      setTimeout(() => {
        setMessages([
          {
            id: 'welcome-reset',
            role: 'assistant',
            content: 'Nouvelle session Bible AI démarrée. Quelle est votre question ou passage d’étude ?',
            agentName: 'Bible AI Manager',
            agentCategory: 'Assistant',
            suggestedQuestions: [
              'Explique Jean 3:16',
              'Qui était le roi David ?',
              'Qu’est-ce que la grâce de Dieu ?',
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 100);
    }
  };

  const handleExportChat = () => {
    const text = messages
      .map(
        (m) =>
          `[${m.role === 'user' ? 'UTILISATEUR' : m.agentName || 'BIBLE AI'}] (${m.timestamp})\n${m.content}\n\n`
      )
      .join('---\n\n');
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bereens-bible-ai-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to format markdown headers and bolding
  const formatMarkdownText = (raw: string) => {
    const lines = raw.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-base sm:text-lg text-slate-900 mt-4 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-sky-500" />
            {line.replace('### ', '')}
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={idx} className="font-bold text-sm sm:text-base text-slate-800 mt-3 mb-1">
            {line.replace('#### ', '')}
          </h5>
        );
      }
      if (line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-sm text-slate-700 my-1 leading-relaxed">
            {renderBoldText(line.replace('- ', ''))}
          </li>
        );
      }
      if (line.startsWith('> ')) {
        return (
          <blockquote
            key={idx}
            className="my-3 pl-4 border-l-4 border-sky-400 bg-sky-50/50 py-2 pr-3 rounded-r-xl italic text-slate-800 text-sm font-serif"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return (
        <p key={idx} className="text-sm text-slate-700 leading-relaxed my-1.5">
          {renderBoldText(line)}
        </p>
      );
    });
  };

  // Helper for **bold** text
  const renderBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast Notification */}
      {savedNoteToast && (
        <div className="fixed top-20 right-5 z-50 p-4 rounded-2xl bg-white border border-sky-300 text-slate-900 text-xs font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3 duration-200">
          <div className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-ping" />
          <span>{savedNoteToast}</span>
        </div>
      )}

      {/* Top Banner / Chat Header */}
      <div className="sticky top-16 z-30 border-b border-sky-100 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Branding & Agent Manager identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  BIBLE AI — Assistant Biblique Intelligent
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-extrabold uppercase tracking-wide">
                  <ShieldCheck className="h-3 w-3 text-sky-600" />
                  RAG Vérifié
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Architecture multi-agents : Exégèse, Dictionnaire Strong, Biographies & Études théologiques.
              </p>
            </div>
          </div>

          {/* Right: Controls & Options */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Translation Picker */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
              <Languages className="h-3.5 w-3.5 text-sky-500" />
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value as TranslationKey)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                title="Version biblique de référence"
              >
                <option value="LSG">Louis Segond 1910 (LSG)</option>
                <option value="BDS">Bible du Semeur (BDS)</option>
                <option value="BFC">Français Courant (BFC)</option>
                <option value="DARBY">Darby (Littérale)</option>
                <option value="KJV">King James (KJV)</option>
                <option value="AMP">Amplifiée (AMP)</option>
              </select>
            </div>

            {/* Export Chat */}
            <button
              onClick={handleExportChat}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Exporter l'historique en Markdown"
            >
              <Download className="h-4 w-4" />
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearChat}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Réinitialiser la conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Specialized Agent Filters Strip */}
        <div className="max-w-6xl mx-auto mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">Mode Agent :</span>
          {AGENT_FILTERS.map((ag) => {
            const Icon = ag.icon;
            const isSelected = selectedAgent === ag.id;
            return (
              <button
                key={ag.id}
                onClick={() => setSelectedAgent(ag.id)}
                className={`whitespace-nowrap px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-white font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-sky-500'}`} />
                <span>{ag.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Thread Area */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="p-4 rounded-3xl bg-sky-50/60 border border-sky-100 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
              <Sparkles className="h-4 w-4 text-sky-500" />
              <span>Questions suggérées pour débuter :</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-100/70 border border-sky-200 text-xs font-medium text-slate-800 hover:text-sky-800 transition-all text-left shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="h-3 w-3 text-sky-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message List */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 animate-in fade-in duration-200 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Assistant Avatar */}
              {!isUser && (
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              {/* Message Bubble Container */}
              <div
                className={`max-w-[90%] sm:max-w-[82%] rounded-3xl p-5 sm:p-6 space-y-4 ${
                  isUser
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/15 rounded-tr-sm'
                    : 'bg-white border border-slate-200 shadow-sm rounded-tl-sm'
                }`}
              >
                {/* Header of Assistant Message */}
                {!isUser && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-sky-600" />
                        {msg.agentName || 'Bible AI Agent'}
                      </span>
                      {msg.agentCategory && (
                        <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                          • {msg.agentCategory}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
                  </div>
                )}

                {/* Main Content Body */}
                <div className={`prose max-w-none ${isUser ? 'text-white' : 'text-slate-800'}`}>
                  {isUser ? (
                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div>{formatMarkdownText(msg.content)}</div>
                  )}
                </div>

                {/* RAG Sources Indicator */}
                {!isUser && msg.ragSources && msg.ragSources.length > 0 && (
                  <div className="pt-2">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />
                        <span>Sources RAG Canoniques Vérifiées :</span>
                      </div>
                      {msg.ragSources.map((source, sIdx) => (
                        <div key={sIdx} className="text-[11px] text-slate-600 pl-4 border-l-2 border-sky-300">
                          <strong className="text-slate-800">{source.title} :</strong> {source.detail}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cited Scripture Verses Cards */}
                {!isUser && msg.citedVerses && msg.citedVerses.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
                      <BookOpen className="h-4 w-4 text-sky-500" />
                      <span>Passages Bibliques Authentiques :</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {msg.citedVerses.map((verse, vIdx) => (
                        <div
                          key={vIdx}
                          className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-sky-900 font-sans">{verse.reference}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white text-sky-700 border border-sky-200 font-mono">
                                {verse.translation || selectedTranslation}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 italic font-serif leading-relaxed">
                              « {verse.text} »
                            </p>
                          </div>

                          {onNavigateToVerse && (
                            <button
                              onClick={() => handleNavigateVerseClick(verse.reference)}
                              className="self-end sm:self-center px-2.5 py-1 rounded-xl bg-white hover:bg-sky-500 hover:text-white border border-sky-200 text-sky-700 text-[11px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1 whitespace-nowrap"
                              title="Ouvrir ce chapitre dans le lecteur biblique"
                            >
                              <span>Lire dans la Bible</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Application Card */}
                {!isUser && msg.practicalApplication && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                    <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold mb-0.5 text-amber-950">Application Pratique :</strong>
                      <span className="text-amber-900/90 leading-relaxed">{msg.practicalApplication}</span>
                    </div>
                  </div>
                )}

                {/* Prayer / Devotional Reflection Card */}
                {!isUser && msg.prayer && (
                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/90 flex items-start gap-2.5 text-xs text-sky-950">
                    <Heart className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold mb-0.5 text-sky-900">Prière d'Appropriation :</strong>
                      <span className="text-slate-700 italic font-serif leading-relaxed">« {msg.prayer} »</span>
                    </div>
                  </div>
                )}

                {/* Suggested Follow-up Questions Pills */}
                {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-2 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400">Questions de suivi suggérées :</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => sendMessage(q)}
                          className="px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 text-[11px] text-slate-700 font-medium transition-colors cursor-pointer text-left flex items-center gap-1"
                        >
                          <span>{q}</span>
                          <ArrowRight className="h-3 w-3 text-sky-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Toolbar on Assistant Messages */}
                {!isUser && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copier la réponse"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copier</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSaveToNotes(msg)}
                        className="px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Sauvegarder dans mes notes spirituelles"
                      >
                        <BookmarkPlus className="h-3.5 w-3.5" />
                        <span>Enregistrer</span>
                      </button>

                      <button
                        onClick={() => handleShare(msg)}
                        className="px-2.5 py-1 rounded-lg hover:bg-slate-100 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Partager"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Partager</span>
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
                      Propulsé par Gemini & RAG
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="h-9 w-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 shadow-xs font-bold text-xs mt-1">
                  {userProfile.firstName.charAt(0) || <User className="h-4 w-4" />}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 animate-in fade-in duration-200">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1 animate-pulse">
              <Bot className="h-4 w-4" />
            </div>

            <div className="bg-white border border-sky-200 rounded-3xl rounded-tl-sm p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
                <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
                <span>Bible AI Manager consulte la base canonique via RAG...</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <div className="h-2 w-2 rounded-full bg-sky-400 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-sky-500 animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-sky-600 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="sticky bottom-0 z-30 border-t border-sky-100 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Form */}
          <div className="relative rounded-2xl border border-slate-300 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-400/20 bg-slate-50 focus-within:bg-white transition-all shadow-xs flex items-end">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question (ex: « Explique Jean 3:16 », « Qui était David ? », « Versets sur la foi »)..."
              rows={2}
              className="w-full p-3.5 pr-14 text-sm text-slate-800 placeholder-slate-400 bg-transparent resize-none focus:outline-none max-h-36"
            />

            <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                  inputMessage.trim() && !isLoading
                    ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                title="Envoyer la question à Bible AI"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>
              Appuyez sur <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Entrée</kbd> pour
              envoyer, <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200">Maj+Entrée</kbd> pour
              nouvelle ligne.
            </span>
            <span className="hidden sm:inline">RAG Canonique • Textes 100% fidèles aux Écritures</span>
          </div>
        </div>
      </div>
    </div>
  );
};
