import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Volume2,
  Copy,
  Check,
  Languages,
  Sparkles,
  Scroll,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { getStrongEntry, getAllStrongEntries, getStrongLexiconStats } from '../data/strongLexicon';
import { StrongLexiconEntry } from '../types';
import { AudioReaderService } from '../services/storage';

interface StrongLexiconModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  onSelectVerseJump?: (passage: string) => void;
}

type LanguageFilter = 'ALL' | 'Hébreu' | 'Araméen' | 'Grec';

export const StrongLexiconModal: React.FC<StrongLexiconModalProps> = ({
  isOpen,
  onClose,
  initialCode = 'H7706',
  onSelectVerseJump,
}) => {
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedCode, setCopiedCode] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(36);

  const stats = useMemo(() => getStrongLexiconStats(), []);
  const allEntries = useMemo(() => getAllStrongEntries(), []);

  // Available categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allEntries.forEach((e) => {
      if (e.category) set.add(e.category);
    });
    return Array.from(set).sort();
  }, [allEntries]);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allEntries.filter((e) => {
      // Language filter
      if (languageFilter !== 'ALL' && e.language !== languageFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && e.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (q) {
        const matchCode = e.code.toLowerCase().includes(q);
        const matchOrig = e.originalWord.includes(q);
        const matchTrans = e.transliteration.toLowerCase().includes(q);
        const matchDef = e.definition.toLowerCase().includes(q);
        const matchContext = e.theologicalContext.toLowerCase().includes(q);
        const matchSection = e.tanakhSection?.toLowerCase().includes(q) || false;
        const matchCategory = e.category?.toLowerCase().includes(q) || false;
        return (
          matchCode ||
          matchOrig ||
          matchTrans ||
          matchDef ||
          matchContext ||
          matchSection ||
          matchCategory
        );
      }
      return true;
    });
  }, [allEntries, languageFilter, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const currentEntry: StrongLexiconEntry = getStrongEntry(selectedCode);

  const handleSpeakPronunciation = () => {
    AudioReaderService.speak(`${currentEntry.transliteration}. ${currentEntry.definition}`);
  };

  const handleCopyWord = () => {
    navigator.clipboard.writeText(
      `${currentEntry.originalWord} (${currentEntry.transliteration} - ${currentEntry.code}) : ${currentEntry.definition}`
    );
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleVerseClick = (passage: string) => {
    if (onSelectVerseJump) {
      onSelectVerseJump(passage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-3 sm:p-5 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border-b border-slate-800 text-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300 shrink-0">
              <Scroll className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-cinzel text-xs sm:text-lg font-bold tracking-tight truncate">
                  Concordance Strong & Dictionnaire
                </h3>
                <span className="font-mono text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-500/30 border border-sky-400/40 text-sky-200 font-bold shrink-0">
                  {stats.total}+ Termes
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 truncate hidden sm:block">
                Texte original du Tanakh (Première Bible hébraïque), passages araméens et Nouveau Testament grec
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Fermer la concordance"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stats & Language Filter Bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setLanguageFilter('ALL');
                setDisplayLimit(36);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                languageFilter === 'ALL'
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tous ({stats.total})
            </button>
            <button
              onClick={() => {
                setLanguageFilter('Hébreu');
                setDisplayLimit(36);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                languageFilter === 'Hébreu'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Hébreu · Tanakh ({stats.hebrew})
            </button>
            <button
              onClick={() => {
                setLanguageFilter('Araméen');
                setDisplayLimit(36);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                languageFilter === 'Araméen'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Araméen Biblique ({stats.aramaic})
            </button>
            <button
              onClick={() => {
                setLanguageFilter('Grec');
                setDisplayLimit(36);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                languageFilter === 'Grec'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Grec · Nouveau Testament ({stats.greek})
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            {filteredEntries.length} résultat{filteredEntries.length > 1 ? 's' : ''} trouvé{filteredEntries.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* Quick Search & Category Filter */}
        <div className="p-3 bg-white border-b border-slate-200 space-y-2">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500">
            <Search className="h-4 w-4 text-sky-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par code (H7706, G3056, H426), mot original (שַׁדַּי, אֱלָהּ), phonétique (Shadday, Abba, Logos) ou définition..."
              className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Effacer la recherche"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Categories Pill Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-0.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Toutes catégories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-0.5 rounded-md whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* Main Selected Entry Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-sm font-bold text-white px-3 py-1 rounded-xl shadow-xs ${
                    currentEntry.language === 'Hébreu'
                      ? 'bg-amber-600'
                      : currentEntry.language === 'Araméen'
                      ? 'bg-emerald-600'
                      : 'bg-indigo-600'
                  }`}
                >
                  {currentEntry.code}
                </span>

                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      dir={currentEntry.language === 'Grec' ? 'ltr' : 'rtl'}
                      className="text-2xl sm:text-3xl font-serif text-slate-950 font-extrabold tracking-wider"
                    >
                      {currentEntry.originalWord}
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {currentEntry.transliteration}
                    </span>
                    <span className="text-xs text-amber-800 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      [{currentEntry.pronunciation}]
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-300">
                  {currentEntry.language} · {currentEntry.partOfSpeech}
                </span>

                <button
                  onClick={handleSpeakPronunciation}
                  className="p-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-lg transition-colors cursor-pointer border border-sky-300"
                  title="Écouter la prononciation"
                >
                  <Volume2 className="h-4 w-4" />
                </button>

                <button
                  onClick={handleCopyWord}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-300"
                  title="Copier le terme"
                >
                  {copiedCode ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Badges Info Section */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {currentEntry.tanakhSection && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-semibold flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-amber-700" />
                  <span>Canon : {currentEntry.tanakhSection}</span>
                </span>
              )}
              {currentEntry.category && (
                <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-900 border border-sky-300 font-semibold">
                  Thème : {currentEntry.category}
                </span>
              )}
              {currentEntry.rootOrigin && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-300 font-semibold">
                  Racine : {currentEntry.rootOrigin}
                </span>
              )}
            </div>

            {/* Section Translittération & Prononciation pour faciliter la lecture du texte original */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 text-xs">
              {/* Translittération */}
              <div className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                  <Languages className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Translittération
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Alphabet latin
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 mt-0.5 tracking-wide">
                    {currentEntry.transliteration}
                  </p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Transcription phonologique du mot {currentEntry.language.toLowerCase()} en caractères romains.
                  </p>
                </div>
              </div>

              {/* Prononciation */}
              <div className="flex items-start gap-2.5 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="p-2 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 shrink-0">
                  <Volume2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Prononciation
                    </span>
                    <button
                      onClick={handleSpeakPronunciation}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer hover:underline"
                      title="Écouter la prononciation audio"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      Écouter
                    </button>
                  </div>
                  <p className="text-sm font-extrabold font-mono text-sky-950 mt-0.5">
                    [{currentEntry.pronunciation}]
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Guide phonétique articulatoire pour réciter le terme original.
                  </p>
                </div>
              </div>
            </div>

            {/* Definition */}
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Définition selon le Dictionnaire Strong
              </span>
              <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                {currentEntry.definition}
              </p>
            </div>

            {/* Theological Depth */}
            <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 text-xs sm:text-sm">
              <span className="font-semibold text-sky-900 block mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <span>Portée Théologique & Utilisation dans la Première Bible :</span>
              </span>
              <p className="text-slate-700 leading-relaxed">
                {currentEntry.theologicalContext}
              </p>
            </div>

            {/* Frequencies & Sample Verses */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-600">
                Fréquence dans les Écritures :{' '}
                <strong className="text-sky-600 font-mono font-bold text-sm">
                  {currentEntry.occurrencesCount} fois
                </strong>
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-500 font-medium">Passages de référence :</span>
                {currentEntry.sampleVerses.map((sv, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleVerseClick(sv)}
                    className="font-mono text-[11px] bg-slate-100 hover:bg-sky-100 hover:text-sky-700 px-2 py-0.5 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer border border-slate-200 hover:border-sky-300"
                    title={`Lire ${sv} dans la Bible`}
                  >
                    {sv}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick list of other Strong words */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Index exhaustif des termes ({filteredEntries.length} mots disponibles)
              </span>
              <span className="text-xs text-slate-400">
                Affichage de {Math.min(displayLimit, filteredEntries.length)} sur {filteredEntries.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredEntries.slice(0, displayLimit).map((entry) => (
                <button
                  key={entry.code}
                  onClick={() => setSelectedCode(entry.code)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedCode === entry.code
                      ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-500/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                        entry.language === 'Hébreu'
                          ? 'bg-amber-100 text-amber-800'
                          : entry.language === 'Araméen'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {entry.code}
                    </span>
                    <span
                      dir={entry.language === 'Grec' ? 'ltr' : 'rtl'}
                      className="font-serif text-base text-slate-900 font-bold"
                    >
                      {entry.originalWord}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-1">
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {entry.transliteration} <span className="text-[10px] text-slate-400 font-mono">[{entry.pronunciation}]</span>
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {entry.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                    {entry.definition}
                  </p>
                </button>
              ))}
            </div>

            {filteredEntries.length > displayLimit && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 48)}
                  className="px-5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Afficher 48 termes supplémentaires</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
