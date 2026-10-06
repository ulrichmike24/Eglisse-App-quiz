import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, X, ArrowRight, Loader2 } from 'lucide-react';
import { TranslationKey } from '../types';
import { BIBLE_BOOKS, CURATED_BIBLE_CHAPTERS } from '../data/bibleCanon';
import { AISearchResult, AIService } from '../services/aiService';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVerse: (bookId: string, chapter: number, verse: number) => void;
  currentTranslation: TranslationKey;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectVerse,
  currentTranslation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'keyword' | 'ai'>('keyword');
  const [filterTestament, setFilterTestament] = useState<'ALL' | 'AT' | 'NT'>('ALL');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiResponse, setAiResponse] = useState<AISearchResult | null>(null);

  if (!isOpen) return null;

  const quickThemes = [
    'Anxiété et paix',
    'Amour de Dieu',
    'Pardon et réconciliation',
    'Prospérité et travail',
    'Victoire sur la tentation',
    'Espérance éternelle',
  ];

  // Client-side instant keyword search across curated verses and book titles
  const keywordResults = searchQuery.trim().length >= 2 ? searchLocalScriptures(searchQuery, filterTestament) : [];

  function searchLocalScriptures(query: string, testament: 'ALL' | 'AT' | 'NT') {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const matches: Array<{
      bookId: string;
      bookName: string;
      chapter: number;
      verse: number;
      text: string;
    }> = [];

    // Search through curated database
    Object.keys(CURATED_BIBLE_CHAPTERS).forEach((bId) => {
      const book = BIBLE_BOOKS.find((b) => b.id === bId);
      if (!book) return;
      if (testament !== 'ALL' && book.testament !== testament) return;

      const chaptersObj = CURATED_BIBLE_CHAPTERS[bId];
      Object.keys(chaptersObj).forEach((cNumStr) => {
        const cNum = Number(cNumStr);
        const versesObj = chaptersObj[cNum];
        Object.keys(versesObj).forEach((vNumStr) => {
          const vNum = Number(vNumStr);
          const vData = versesObj[vNum];
          const text = vData[currentTranslation] || vData['LSG'] || '';
          const normText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

          if (normText.includes(q) || book.name.toLowerCase().includes(q)) {
            matches.push({
              bookId: bId,
              bookName: book.name,
              chapter: cNum,
              verse: vNum,
              text,
            });
          }
        });
      });
    });

    return matches.slice(0, 15);
  }

  const handleRunAISearch = async (themeQuery?: string) => {
    const textToSearch = themeQuery || searchQuery;
    if (!textToSearch.trim()) return;

    setSearchMode('ai');
    setIsLoadingAI(true);
    const result = await AIService.searchThematic(textToSearch, currentTranslation);
    setAiResponse(result);
    setIsLoadingAI(false);
  };

  const parseReferenceAndJump = (refString: string) => {
    // e.g. "Jean 3:16" or "Psaume 23:1"
    const match = refString.match(/^([A-Za-zÀ-ÿ0-9\s]+?)\s+(\d+):?(\d+)?/);
    if (match) {
      const bName = match[1].trim();
      const chapter = parseInt(match[2], 10);
      const verse = match[3] ? parseInt(match[3], 10) : 1;

      const foundBook = BIBLE_BOOKS.find(
        (b) =>
          b.name.toLowerCase().includes(bName.toLowerCase()) ||
          bName.toLowerCase().includes(b.name.toLowerCase())
      );

      if (foundBook) {
        onSelectVerse(foundBook.id, chapter, verse);
        onClose();
        return;
      }
    }

    // Default fallback to first book
    onSelectVerse('PSA', 23, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <Search className="h-5 w-5 text-sky-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunAISearch()}
            placeholder="Rechercher par mot-clé (ex: berger, foi, amour) ou poser une question spirituelle..."
            className="w-full bg-transparent text-base text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter & Mode Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 mr-1">Mode :</span>
            <button
              onClick={() => setSearchMode('keyword')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                searchMode === 'keyword'
                  ? 'bg-sky-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Mots-clés textuels
            </button>
            <button
              onClick={() => handleRunAISearch()}
              className={`px-3 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
                searchMode === 'ai'
                  ? 'bg-sky-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-200" />
              <span>Assistance IA Sémantique</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 mr-1">Canon :</span>
            {(['ALL', 'AT', 'NT'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterTestament(t)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                  filterTestament === t
                    ? 'bg-sky-100 text-sky-800 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {t === 'ALL' ? 'Tous (66)' : t === 'AT' ? 'Ancien T. (39)' : 'Nouveau T. (27)'}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 bg-slate-50/80 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-500 whitespace-nowrap">Thèmes rapides :</span>
          {quickThemes.map((qt) => (
            <button
              key={qt}
              onClick={() => {
                setSearchQuery(qt);
                handleRunAISearch(qt);
              }}
              className="text-[11px] whitespace-nowrap text-slate-700 hover:text-sky-600 bg-white hover:bg-sky-50 px-2.5 py-0.5 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              {qt}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {searchMode === 'ai' && isLoadingAI && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
              <p className="text-sm font-medium text-slate-800">
                L’IA sonde les 66 livres de la Bible pour votre recherche...
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Analyse exégétique et regroupement des versets les plus pertinents selon votre contexte.
              </p>
            </div>
          )}

          {searchMode === 'ai' && aiResponse && !isLoadingAI && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200">
                <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider">
                  Synthèse Pastorale & Théologique
                </span>
                <h4 className="font-cinzel text-lg font-bold text-slate-900 mt-1">
                  {aiResponse.theme}
                </h4>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {aiResponse.summary}
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Passages Clés Recommandés
                </span>
                {aiResponse.results.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-cinzel text-sm font-bold text-slate-900">
                        {r.reference}
                      </span>
                      <button
                        onClick={() => parseReferenceAndJump(r.reference)}
                        className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-medium group-hover:translate-x-0.5 transition-all cursor-pointer"
                      >
                        <span>Lire le chapitre</span>
                        <ArrowRight className="h-3.5 w-3.5 text-sky-500" />
                      </button>
                    </div>

                    <p className="font-cormorant text-base text-slate-700 italic mb-2 leading-relaxed">
                      « {r.text} »
                    </p>

                    <p className="text-xs text-slate-500 border-t border-slate-100 pt-2">
                      <strong className="text-slate-700">Portée :</strong> {r.relevance}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchMode === 'keyword' && (
            <div className="space-y-3">
              {searchQuery.trim().length < 2 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  Entrez au moins 2 caractères pour rechercher dans l’ensemble des Écritures.
                </div>
              ) : keywordResults.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-sm text-slate-700">Aucun résultat textuel direct trouvé pour « {searchQuery} ».</p>
                  <button
                    onClick={() => handleRunAISearch()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-sky-100" />
                    <span>Lancer la recherche sémantique par IA</span>
                  </button>
                </div>
              ) : (
                keywordResults.map((r, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onSelectVerse(r.bookId, r.chapter, r.verse);
                      onClose();
                    }}
                    className="w-full text-left p-3.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 transition-all flex flex-col group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-cinzel text-xs font-bold text-slate-900">
                        {r.bookName} {r.chapter}:{r.verse}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono group-hover:text-sky-600 flex items-center gap-1">
                        <span>Ouvrir</span>
                        <ArrowRight className="h-3 w-3 text-sky-500" />
                      </span>
                    </div>
                    <p className="font-cormorant text-sm text-slate-700 italic line-clamp-2">
                      « {r.text} »
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
