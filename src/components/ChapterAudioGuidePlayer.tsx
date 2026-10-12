import React, { useState, useEffect } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  X,
  BookOpen,
  Sparkles,
  Compass,
  Scroll,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ChapterTheologicalGuide } from '../data/chapterAudioGuides';
import { AudioReaderService } from '../services/storage';

interface ChapterAudioGuidePlayerProps {
  guide: ChapterTheologicalGuide;
  isOpen: boolean;
  onClose: () => void;
  onHighlightVerse?: (verseNum: number) => void;
}

export const ChapterAudioGuidePlayer: React.FC<ChapterAudioGuidePlayerProps> = ({
  guide,
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [audioMode, setAudioMode] = useState<'narration' | 'fullTheology'>('narration');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'intro' | 'theology' | 'christ' | 'practice'>('intro');

  useEffect(() => {
    // When chapter or guide changes, stop existing audio
    AudioReaderService.stop();
    setIsPlaying(false);
  }, [guide.bookId, guide.chapter]);

  if (!isOpen) return null;

  const getAudioScript = (): string => {
    if (audioMode === 'narration') {
      return (
        `${guide.title}. Thème central : ${guide.theme}. ` +
        `${guide.suggestedNarration} ` +
        `Verset clé : ${guide.keyVerse}. ` +
        `Application spirituelle : ${guide.practicalApplication}`
      );
    } else {
      return (
        `Audio-guide théologique approfondi pour ${guide.bookName}, chapitre ${guide.chapter}. ` +
        `Titre : ${guide.title}. ` +
        `Contexte historique et canonique : ${guide.historicalContext}. ` +
        `Méditation théologique : ${guide.theologicalReflection}. ` +
        `Éclairage christologique : ${guide.christologicalForeshadowing}. ` +
        `Exhortation pratique : ${guide.practicalApplication}`
      );
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      AudioReaderService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const text = getAudioScript();
      AudioReaderService.speak(text, speechRate, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isPlaying) {
      AudioReaderService.stop();
      const text = getAudioScript();
      AudioReaderService.speak(text, newRate, () => {
        setIsPlaying(false);
      });
    }
  };

  const handleStop = () => {
    AudioReaderService.stop();
    setIsPlaying(false);
  };

  return (
    <div className="fixed bottom-16 md:bottom-4 left-2 right-2 sm:left-auto sm:right-6 sm:w-[480px] z-40 transition-all duration-300">
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0B1E3B] text-slate-100 rounded-2xl shadow-2xl border border-sky-500/30 overflow-hidden backdrop-blur-md">
        {/* Header Bar */}
        <div className="p-2.5 sm:p-3.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 rounded-xl text-sky-300 ${isPlaying ? 'bg-sky-500/20 ring-2 ring-sky-400/40 animate-pulse' : 'bg-slate-700'}`}>
              <Headphones className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  Audio-Guide Théologique
                </span>
                {isPlaying && (
                  <span className="text-[10px] text-sky-400 font-mono animate-pulse flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                    En lecture
                  </span>
                )}
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate mt-0.5 font-cinzel">
                {guide.bookName} {guide.chapter} : {guide.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
              title={isExpanded ? 'Réduire' : 'Agrandir le guide'}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                handleStop();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition-colors cursor-pointer"
              title="Fermer l'audio-guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="p-3 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
          {/* Play/Pause Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-2 ring-amber-300/40'
                  : 'bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30'
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Écouter'}</span>
            </button>

            <button
              onClick={handleStop}
              disabled={!isPlaying}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Réinitialiser"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60 text-[11px]">
            <button
              onClick={() => {
                if (audioMode !== 'narration') {
                  setAudioMode('narration');
                  if (isPlaying) {
                    AudioReaderService.stop();
                    setIsPlaying(false);
                  }
                }
              }}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                audioMode === 'narration'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Narration
            </button>
            <button
              onClick={() => {
                if (audioMode !== 'fullTheology') {
                  setAudioMode('fullTheology');
                  if (isPlaying) {
                    AudioReaderService.stop();
                    setIsPlaying(false);
                  }
                }
              }}
              className={`px-2 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                audioMode === 'fullTheology'
                  ? 'bg-sky-600 text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Théologie
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-300 font-medium">Vitesse :</span>
            {[0.9, 1.0, 1.2].map((r) => (
              <button
                key={r}
                onClick={() => handleRateChange(r)}
                className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer ${
                  speechRate === r
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>

        {/* Live Audio Narration Preview Snippet */}
        <div className="px-3.5 py-2.5 bg-slate-950/60 text-xs border-b border-slate-800/80">
          <p className="text-slate-300 italic line-clamp-2 leading-relaxed">
            « {audioMode === 'narration' ? guide.suggestedNarration : guide.theologicalReflection} »
          </p>
        </div>

        {/* Expanded Content Drawer */}
        {isExpanded && (
          <div className="p-4 max-h-72 overflow-y-auto space-y-3.5 bg-slate-900/95 text-xs">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-[11px]">
              <button
                onClick={() => setActiveTab('intro')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'intro' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Contexte</span>
              </button>
              <button
                onClick={() => setActiveTab('theology')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'theology' ? 'bg-amber-600 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Théologie</span>
              </button>
              <button
                onClick={() => setActiveTab('christ')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'christ' ? 'bg-purple-600 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Scroll className="h-3.5 w-3.5" />
                <span>Christologie</span>
              </button>
              <button
                onClick={() => setActiveTab('practice')}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'practice' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Heart className="h-3.5 w-3.5" />
                <span>Application</span>
              </button>
            </div>

            {/* Tab Body */}
            {activeTab === 'intro' && (
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="font-semibold text-amber-300 block mb-1">Thème Central :</span>
                  <p className="text-slate-300 leading-relaxed">{guide.theme}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <span className="font-semibold text-sky-300 block mb-1">Contexte Historique & Canonique :</span>
                  <p className="text-slate-300 leading-relaxed">{guide.historicalContext}</p>
                </div>
              </div>
            )}

            {activeTab === 'theology' && (
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="font-semibold text-amber-300 block">Méditation Théologique Profonde :</span>
                <p className="text-slate-300 leading-relaxed">{guide.theologicalReflection}</p>
              </div>
            )}

            {activeTab === 'christ' && (
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                <span className="font-semibold text-purple-300 block flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Préfiguration & Accomplissement en Christ :</span>
                </span>
                <p className="text-slate-300 leading-relaxed">{guide.christologicalForeshadowing}</p>
              </div>
            )}

            {activeTab === 'practice' && (
              <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <span className="font-semibold text-emerald-300 block flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Exhortation & Prière Pratique :</span>
                </span>
                <p className="text-slate-300 leading-relaxed">{guide.practicalApplication}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
