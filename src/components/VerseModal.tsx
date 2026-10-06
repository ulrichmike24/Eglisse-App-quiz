import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Share2,
  Volume2,
  Sparkles,
  Save,
  Trash2,
  Copy,
  Check,
  Languages,
  BookOpen,
  Bot,
} from 'lucide-react';
import { BibleVerse, TranslationKey, UserHighlight, UserNote } from '../types';
import { BIBLE_TRANSLATIONS, CURATED_BIBLE_CHAPTERS } from '../data/bibleCanon';
import { AudioReaderService } from '../services/storage';
import { AIService, AIVerseInsightResult } from '../services/aiService';

interface VerseModalProps {
  verse: BibleVerse;
  onClose: () => void;
  userNote?: UserNote;
  userHighlight?: UserHighlight;
  isBookmarked: boolean;
  onSaveNote: (text: string, tags: string[]) => void;
  onDeleteNote?: () => void;
  onToggleHighlight: (color: 'yellow' | 'orange' | 'blue' | 'green' | 'purple') => void;
  onToggleBookmark: () => void;
  onOpenShareModal: () => void;
  onOpenStrongLexicon?: (code: string) => void;
  onOpenInBibleAI?: (verse: BibleVerse) => void;
}

export const VerseModal: React.FC<VerseModalProps> = ({
  verse,
  onClose,
  userNote,
  userHighlight,
  isBookmarked,
  onSaveNote,
  onDeleteNote,
  onToggleHighlight,
  onToggleBookmark,
  onOpenShareModal,
  onOpenStrongLexicon,
  onOpenInBibleAI,
}) => {
  const [activeTab, setActiveTab] = useState<'note' | 'translations' | 'ai'>('note');
  const [noteContent, setNoteContent] = useState(userNote?.text || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(userNote?.tags || ['Méditation', 'Discipulat']);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // AI insight state
  const [aiInsight, setAiInsight] = useState<AIVerseInsightResult | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');

  const colors: Array<{ id: 'orange' | 'yellow' | 'green' | 'blue' | 'purple'; label: string; bg: string }> = [
    { id: 'orange', label: 'Feu & Sainteté', bg: 'bg-orange-500' },
    { id: 'yellow', label: 'Révélation & Gloire', bg: 'bg-amber-400' },
    { id: 'green', label: 'Croissance & Foi', bg: 'bg-emerald-500' },
    { id: 'blue', label: 'Paix & Alliance', bg: 'bg-sky-500' },
    { id: 'purple', label: 'Autorité & Royauté', bg: 'bg-purple-500' },
  ];

  const handleCopyText = () => {
    const textToCopy = `« ${verse.text} » — ${verse.bookName} ${verse.chapter}:${verse.verse} (${verse.translation})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      AudioReaderService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      AudioReaderService.speak(`${verse.bookName} chapitre ${verse.chapter}, verset ${verse.verse} : ${verse.text}`, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleFetchAiInsight = async () => {
    setIsLoadingAI(true);
    const result = await AIService.getVerseInsight(
      `${verse.bookName} ${verse.chapter}:${verse.verse}`,
      verse.text,
      aiQuestion
    );
    setAiInsight(result);
    setIsLoadingAI(false);
  };

  // Get multi-translation comparison for this specific verse
  const getTranslationText = (transKey: TranslationKey): string => {
    const curated = CURATED_BIBLE_CHAPTERS[verse.bookId]?.[verse.chapter]?.[verse.verse];
    if (curated && curated[transKey]) {
      return curated[transKey]!;
    }
    if (curated && curated['LSG']) {
      return curated['LSG']!;
    }
    return verse.text;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="font-cinzel text-lg font-bold text-slate-900">
              {verse.bookName} {verse.chapter}:{verse.verse}
            </span>
            <span className="text-xs text-sky-600 font-mono font-bold">({verse.translation})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleAudio}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isPlayingAudio ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-100'
              }`}
              title="Écouter le verset"
            >
              <Volume2 className="h-4 w-4" />
            </button>

            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isBookmarked ? 'bg-amber-100 text-amber-600' : 'text-slate-500 hover:text-amber-500 hover:bg-slate-100'
              }`}
              title="Ajouter aux favoris"
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={onOpenShareModal}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Partager en image stylée"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              onClick={handleCopyText}
              className="p-2 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Copier le texte"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Verse Highlight Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50/70 border-b border-slate-200 text-xs text-slate-500">
          <span>Couleur de surlignage :</span>
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => onToggleHighlight(c.id)}
                className={`h-5 w-5 rounded-full ${c.bg} transition-transform cursor-pointer ${
                  userHighlight?.color === c.id ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Selected Verse Quote Display */}
        <div className="px-6 py-4 bg-sky-50/50 border-b border-slate-200">
          <blockquote className="font-cormorant text-xl text-slate-800 leading-relaxed italic border-l-2 border-sky-500 pl-4">
            « {verse.text} »
          </blockquote>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('note')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'note'
                ? 'border-sky-500 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>Ma Réflexion & Note</span>
          </button>

          <button
            onClick={() => setActiveTab('translations')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'translations'
                ? 'border-sky-500 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Languages className="h-4 w-4" />
            <span>Comparaison Traductions</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ai'
                ? 'border-sky-500 text-sky-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="h-4 w-4 text-sky-500" />
            <span>Éclairage IA & Prière</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-slate-700">
          {activeTab === 'note' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Réflexion Personnelle / Révélation Reçue
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Écrivez ce que Dieu vous inspire à travers ce verset, une résolution pratique, un sujet de prière..."
                  rows={4}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Thèmes & Tags
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200"
                    >
                      #{tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Ajouter un thème (ex: Guérison, Sanctification, Famille)..."
                    className="flex-1 rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-medium rounded-lg text-slate-700 cursor-pointer"
                  >
                    Ajouter
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                {userNote && onDeleteNote ? (
                  <button
                    onClick={onDeleteNote}
                    className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Supprimer la note</span>
                  </button>
                ) : (
                  <div />
                )}

                <button
                  onClick={() => {
                    onSaveNote(noteContent, tags);
                    onClose();
                  }}
                  disabled={!noteContent.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Enregistrer la réflexion</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'translations' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Comparez les nuances textuelles pour sonder le sens original hébreu et grec du passage :
              </p>
              <div className="space-y-3">
                {BIBLE_TRANSLATIONS.map((tr) => (
                  <div
                    key={tr.key}
                    className={`p-3.5 rounded-xl border ${
                      verse.translation === tr.key
                        ? 'border-sky-400 bg-sky-50/60'
                        : 'border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-sky-700">{tr.name}</span>
                      <span className="text-[11px] text-slate-500">{tr.fullName}</span>
                    </div>
                    <p className="font-cormorant text-base text-slate-800 italic leading-relaxed">
                      « {getTranslationText(tr.key)} »
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              {!aiInsight ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl bg-sky-100 border border-sky-200 text-sky-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h4 className="font-cinzel text-base font-semibold text-slate-900">
                    Éclairage Pastoral & Théologique
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Obtenez une explication exégétique détaillée, le contexte historique, les applications pratiques pour
                    le travail et la famille, et une prière guidée.
                  </p>

                  <div className="max-w-md mx-auto pt-2">
                    <input
                      type="text"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder="Question précise (optionnel, ex: comment l'appliquer face au doute ?)..."
                      className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none mb-3"
                    />

                    <button
                      onClick={handleFetchAiInsight}
                      disabled={isLoadingAI}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-md transition-all cursor-pointer"
                    >
                      {isLoadingAI ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Analyse des Écritures en cours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Générer l’éclairage biblique</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <h5 className="font-semibold text-sky-700 uppercase tracking-wider mb-1">
                      Contexte Historique & Canonique
                    </h5>
                    <p className="text-slate-700 leading-relaxed">{aiInsight.context}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <h5 className="font-semibold text-sky-700 uppercase tracking-wider mb-1">
                      Signification Spirituelle Profonde
                    </h5>
                    <p className="text-slate-700 leading-relaxed">{aiInsight.spiritualMeaning}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <h5 className="font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                      Application Pratique Quotidienne
                    </h5>
                    <p className="text-slate-700 leading-relaxed">{aiInsight.practicalApplication}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200">
                    <h5 className="font-semibold text-sky-800 uppercase tracking-wider mb-1">
                      Prière d'Appropriation
                    </h5>
                    <p className="font-cormorant text-sm italic text-slate-800 leading-relaxed">
                      {aiInsight.prayer}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
                    <button
                      onClick={() => setAiInsight(null)}
                      className="text-xs text-sky-600 hover:text-sky-700 underline cursor-pointer"
                    >
                      Poser une autre question sur ce verset
                    </button>

                    {onOpenInBibleAI && (
                      <button
                        onClick={() => {
                          onOpenInBibleAI(verse);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>Explorer dans Bible AI (Chat & RAG)</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
