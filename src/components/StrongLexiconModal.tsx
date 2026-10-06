import React, { useState } from 'react';
import { X, Search, BookOpen, Volume2, Bookmark, ExternalLink } from 'lucide-react';
import { getStrongEntry, STRONG_LEXICON } from '../data/strongLexicon';
import { StrongLexiconEntry } from '../types';
import { AudioReaderService } from '../services/storage';

interface StrongLexiconModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  onSelectVerseJump?: (passage: string) => void;
}

export const StrongLexiconModal: React.FC<StrongLexiconModalProps> = ({
  isOpen,
  onClose,
  initialCode = 'H7706',
  onSelectVerseJump,
}) => {
  const [selectedCode, setSelectedCode] = useState(initialCode);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentEntry: StrongLexiconEntry = getStrongEntry(selectedCode);

  const handleSpeakPronunciation = () => {
    AudioReaderService.speak(`${currentEntry.transliteration}. ${currentEntry.definition}`);
  };

  const sampleEntries = Object.values(STRONG_LEXICON).filter(
    (e) =>
      e.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.definition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-sky-100 border border-sky-200 text-sky-700 font-bold">
              Lexique EMCI TV
            </span>
            <h3 className="font-cinzel text-base font-bold text-slate-900">
              Concordance Strong & Dictionnaire Hébreu / Grec
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Search */}
        <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200 flex items-center gap-2">
          <Search className="h-4 w-4 text-sky-500 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par code (ex: H7706, G3056) ou terme (ex: Shaddai, Logos, Agapé)..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Modal Main Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Main Selected Entry Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold bg-sky-500 text-white px-2.5 py-1 rounded-lg">
                  {currentEntry.code}
                </span>
                <div>
                  <span className="text-2xl font-serif text-slate-900 font-bold tracking-wider">
                    {currentEntry.originalWord}
                  </span>
                  <span className="text-xs text-slate-500 font-mono ml-2">
                    ({currentEntry.transliteration})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {currentEntry.language} · {currentEntry.partOfSpeech}
                </span>
                <button
                  onClick={handleSpeakPronunciation}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-sky-600 rounded-lg cursor-pointer"
                  title="Écouter la prononciation"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Définition selon le Dictionnaire Strong
              </span>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {currentEntry.definition}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs">
              <span className="font-semibold text-sky-800 block mb-1">
                Portée Théologique & Utilisation Biblique :
              </span>
              <p className="text-slate-700 leading-relaxed">
                {currentEntry.theologicalContext}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2">
              <span className="text-slate-500">
                Fréquence : <strong className="text-sky-600 font-mono font-bold">{currentEntry.occurrencesCount} fois</strong> dans la Bible
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Passages exemples :</span>
                {currentEntry.sampleVerses.map((sv, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-lg text-slate-700 font-medium"
                  >
                    {sv}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick list of other Strong words */}
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
              Mots-clés Strong les plus consultés (EMCI TV)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {sampleEntries.map((entry) => (
                <button
                  key={entry.code}
                  onClick={() => setSelectedCode(entry.code)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedCode === entry.code
                      ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-500'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-sky-600">
                      {entry.code}
                    </span>
                    <span className="font-serif text-sm text-slate-900 font-semibold">
                      {entry.originalWord}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-800 block truncate">
                    {entry.transliteration}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                    {entry.definition}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
