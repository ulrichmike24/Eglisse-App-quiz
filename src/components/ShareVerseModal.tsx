import React, { useState, useRef } from 'react';
import { X, Copy, Check, Download, Share2, Printer, Sparkles } from 'lucide-react';
import { BibleVerse } from '../types';

interface ShareVerseModalProps {
  verse: BibleVerse;
  onClose: () => void;
}

export const ShareVerseModal: React.FC<ShareVerseModalProps> = ({ verse, onClose }) => {
  const [selectedTheme, setSelectedTheme] = useState<'midnight' | 'flame' | 'parchment' | 'emerald'>('midnight');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const themes = [
    {
      id: 'midnight' as const,
      name: 'Nuit Céleste',
      bgClass: 'bg-gradient-to-br from-[#0A192F] via-[#0E2442] to-[#1E3A8A]',
      textClass: 'text-slate-100',
      quoteClass: 'text-amber-300',
      badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    },
    {
      id: 'flame' as const,
      name: 'Feu & Gloire',
      bgClass: 'bg-gradient-to-br from-amber-700 via-orange-600 to-red-800',
      textClass: 'text-white',
      quoteClass: 'text-amber-100',
      badgeClass: 'bg-white/20 text-white border-white/40',
    },
    {
      id: 'parchment' as const,
      name: 'Parchemin Ancien',
      bgClass: 'bg-[#FBF8F1] text-stone-900 border border-stone-300',
      textClass: 'text-stone-900',
      quoteClass: 'text-amber-900',
      badgeClass: 'bg-stone-200 text-stone-800 border-stone-300',
    },
    {
      id: 'emerald' as const,
      name: 'Alliance & Vie',
      bgClass: 'bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900',
      textClass: 'text-emerald-100',
      quoteClass: 'text-emerald-300',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    },
  ];

  const currentTheme = themes.find((t) => t.id === selectedTheme) || themes[0];

  const formattedShareText = `« ${verse.text} »\n\n— ${verse.bookName} ${verse.chapter}:${verse.verse} (${verse.translation})\nPartagé via Béréens - Plateforme Biblique & Discipulat`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedShareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${verse.bookName} ${verse.chapter}:${verse.verse}`,
          text: formattedShareText,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-sky-500" />
            <h3 className="font-cinzel text-base font-bold text-slate-900">
              Diffuser la Parole de Dieu
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Theme Selector */}
        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">Style visuel :</span>
          <div className="flex items-center gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTheme(t.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedTheme === t.id
                    ? 'bg-sky-500 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Card Preview */}
        <div className="p-6 bg-slate-50 flex items-center justify-center">
          <div
            ref={cardRef}
            className={`w-full rounded-2xl p-7 shadow-xl relative overflow-hidden transition-all duration-300 ${currentTheme.bgClass}`}
          >
            {/* Ambient ornament watermark */}
            <div className="absolute top-2 right-4 text-7xl font-serif opacity-10 select-none pointer-events-none">
              ✞
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`text-[11px] font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${currentTheme.badgeClass}`}>
                BÉRÉENS
              </span>
              <span className="text-[11px] font-mono opacity-75">
                {verse.translation}
              </span>
            </div>

            <div className="my-4">
              <span className="text-3xl font-serif leading-none opacity-40">“</span>
              <p
                className={`font-cormorant text-2xl leading-relaxed italic ${currentTheme.quoteClass}`}
              >
                {verse.text}
              </p>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/15">
              <div>
                <span className="font-cinzel text-sm font-bold tracking-wide">
                  {verse.bookName} {verse.chapter}:{verse.verse}
                </span>
                <p className="text-[10px] opacity-75">La Parole Vivante & Éternelle</p>
              </div>

              <div className="text-[10px] opacity-60 font-mono">
                bereens.org
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="p-6 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-sky-500" />}
              <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
              title="Imprimer ou exporter en PDF"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Imprimer / PDF</span>
            </button>
          </div>

          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            <span>Partager sur Réseaux</span>
          </button>
        </div>
      </div>
    </div>
  );
};
