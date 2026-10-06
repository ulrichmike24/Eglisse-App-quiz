import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sliders,
  Languages,
  Book,
  Volume2,
  VolumeX,
  Share2,
  Printer,
  FileText,
  Columns,
  Sparkles,
  Maximize2,
  Bookmark,
  MessageSquare,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import { BibleBook, BibleVerse, ReaderSettings, TranslationKey, UserBookmark, UserHighlight, UserNote } from '../types';
import { BIBLE_BOOKS, BIBLE_TRANSLATIONS, getChapterVerses, fetchExactBibleChapter } from '../data/bibleCanon';
import { AudioReaderService } from '../services/storage';

interface BibleReaderProps {
  currentBookId: string;
  currentChapter: number;
  currentTranslation: TranslationKey;
  onSelectBookAndChapter: (bookId: string, chapter: number) => void;
  onSelectTranslation: (translation: TranslationKey) => void;
  readerSettings: ReaderSettings;
  onUpdateReaderSettings: (settings: Partial<ReaderSettings>) => void;
  notes: UserNote[];
  highlights: UserHighlight[];
  bookmarks: UserBookmark[];
  onOpenVerseModal: (verse: BibleVerse) => void;
  onOpenShareModal: (verse: BibleVerse) => void;
}

export const BibleReader: React.FC<BibleReaderProps> = ({
  currentBookId,
  currentChapter,
  currentTranslation,
  onSelectBookAndChapter,
  onSelectTranslation,
  readerSettings,
  onUpdateReaderSettings,
  notes,
  highlights,
  bookmarks,
  onOpenVerseModal,
  onOpenShareModal,
}) => {
  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false);
  const [isChapterGridOpen, setIsChapterGridOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [bookSearch, setBookSearch] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'AT' | 'NT'>('ALL');
  const [showStrongConcordance, setShowStrongConcordance] = useState(false);
  const [isLoadingExactBible, setIsLoadingExactBible] = useState(false);

  const currentBook = BIBLE_BOOKS.find((b) => b.id === currentBookId) || BIBLE_BOOKS[0];

  const [displayedVerses, setDisplayedVerses] = useState<BibleVerse[]>(() =>
    getChapterVerses(currentBook.id, currentChapter, currentTranslation)
  );

  const [displayedParallelVerses, setDisplayedParallelVerses] = useState<BibleVerse[]>(() =>
    readerSettings.parallelMode
      ? getChapterVerses(currentBook.id, currentChapter, readerSettings.parallelTranslation)
      : []
  );

  // Exact Bible text fetching matching EMCI TV (emcitv.com/bible/)
  useEffect(() => {
    let isMounted = true;

    // Initial immediate load from local cache if available
    const initialVerses = getChapterVerses(currentBook.id, currentChapter, currentTranslation);
    if (initialVerses.length > 0) {
      setDisplayedVerses(initialVerses);
      setIsLoadingExactBible(false);
    } else {
      setDisplayedVerses([]);
      setIsLoadingExactBible(true);
    }

    fetchExactBibleChapter(currentBook.id, currentBook.name, currentChapter, currentTranslation).then((res) => {
      if (isMounted) {
        if (res.verses && res.verses.length > 0) {
          setDisplayedVerses(res.verses);
        }
        setIsLoadingExactBible(false);
      }
    });

    if (readerSettings.parallelMode) {
      const initialParallel = getChapterVerses(
        currentBook.id,
        currentChapter,
        readerSettings.parallelTranslation
      );
      if (initialParallel.length > 0) {
        setDisplayedParallelVerses(initialParallel);
      } else {
        setDisplayedParallelVerses([]);
      }

      fetchExactBibleChapter(
        currentBook.id,
        currentBook.name,
        currentChapter,
        readerSettings.parallelTranslation
      ).then((res) => {
        if (isMounted && res.verses && res.verses.length > 0) {
          setDisplayedParallelVerses(res.verses);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [
    currentBook.id,
    currentBook.name,
    currentChapter,
    currentTranslation,
    readerSettings.parallelMode,
    readerSettings.parallelTranslation,
  ]);

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      onSelectBookAndChapter(currentBook.id, currentChapter - 1);
    } else {
      const currentIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id);
      if (currentIndex > 0) {
        const prevBook = BIBLE_BOOKS[currentIndex - 1];
        onSelectBookAndChapter(prevBook.id, prevBook.chaptersCount);
      }
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < currentBook.chaptersCount) {
      onSelectBookAndChapter(currentBook.id, currentChapter + 1);
    } else {
      const currentIndex = BIBLE_BOOKS.findIndex((b) => b.id === currentBook.id);
      if (currentIndex < BIBLE_BOOKS.length - 1) {
        const nextBook = BIBLE_BOOKS[currentIndex + 1];
        onSelectBookAndChapter(nextBook.id, 1);
      }
    }
  };

  const handleToggleChapterAudio = () => {
    if (isPlayingAudio) {
      AudioReaderService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead =
        `${currentBook.name}, chapitre ${currentChapter}. ` +
        displayedVerses.map((v) => `${v.verse}. ${v.text}`).join(' ');
      AudioReaderService.speak(textToRead, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handlePrintChapter = () => {
    window.print();
  };

  const handleExportText = () => {
    const textContent =
      `${currentBook.name} — Chapitre ${currentChapter} (${currentTranslation})\n` +
      `Conforme au texte de référence emcitv.com/bible/ (Louis Segond 1910)\nPlateforme Béréens\n\n` +
      displayedVerses.map((v) => `[${v.verse}] ${v.text}`).join('\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentBook.name}_Chapitre_${currentChapter}_${currentTranslation}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter books for drawer
  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    const matchesTestament = testamentFilter === 'ALL' || b.testament === testamentFilter;
    const matchesSearch = b.name.toLowerCase().includes(bookSearch.toLowerCase());
    return matchesTestament && matchesSearch;
  });

  // Theme styling mapping
  const getThemeClasses = () => {
    switch (readerSettings.theme) {
      case 'oled':
        return 'bg-black text-slate-100 border-neutral-900';
      case 'sepia':
        return 'bg-[#FBF8F1] text-stone-900 border-stone-300';
      case 'dark':
        return 'bg-[#0A192F] text-slate-100 border-slate-800';
      case 'light':
      default:
        return 'bg-white text-slate-900 border-slate-200';
    }
  };

  const getContainerSurfaceClasses = () => {
    switch (readerSettings.theme) {
      case 'oled':
        return 'bg-neutral-950 border-neutral-900';
      case 'sepia':
        return 'bg-[#F4EFE6] border-stone-300 text-stone-800';
      case 'dark':
        return 'bg-[#0E2442] border-slate-800 text-slate-200';
      case 'light':
      default:
        return 'bg-white/95 border-b border-sky-100 text-slate-800 shadow-xs';
    }
  };

  const getFontFamilyClass = () => {
    switch (readerSettings.fontFamily) {
      case 'display':
        return 'font-cinzel';
      case 'sans':
        return 'font-jakarta';
      case 'serif':
      default:
        return 'font-cormorant';
    }
  };

  const getLineHeightClass = () => {
    switch (readerSettings.lineHeight) {
      case 'tight':
        return 'leading-snug';
      case 'normal':
        return 'leading-relaxed';
      case 'relaxed':
      default:
        return 'leading-loose';
    }
  };

  return (
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Reader Control Toolbar */}
      <div className={`sticky top-16 z-30 border-b backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 ${getContainerSurfaceClasses()}`}>
        {/* Book & Chapter Pickers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookDrawerOpen(!isBookDrawerOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 text-xs font-bold font-cinzel transition-all shadow-xs cursor-pointer"
          >
            <Book className="h-4 w-4 text-sky-500" />
            <span>{currentBook.name}</span>
          </button>

          <button
            onClick={() => setIsChapterGridOpen(!isChapterGridOpen)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 font-mono transition-colors shadow-xs cursor-pointer"
          >
            Ch. {currentChapter} / {currentBook.chaptersCount}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevChapter}
              className="p-1.5 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
              title="Chapitre précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextChapter}
              className="p-1.5 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
              title="Chapitre suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Translation & Comparison Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <Languages className="h-3.5 w-3.5 text-sky-500 ml-1.5 mr-0.5" />
            <select
              value={currentTranslation}
              onChange={(e) => onSelectTranslation(e.target.value as TranslationKey)}
              aria-label="Sélectionner la traduction biblique"
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none py-1 pr-2 cursor-pointer"
            >
              {BIBLE_TRANSLATIONS.map((t) => (
                <option key={t.key} value={t.key} className="bg-white text-slate-900">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Parallel comparison toggle */}
          <button
            onClick={() =>
              onUpdateReaderSettings({
                parallelMode: !readerSettings.parallelMode,
              })
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              readerSettings.parallelMode
                ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-xs'
                : 'text-slate-600 border-slate-200 hover:text-sky-700 hover:bg-sky-50'
            }`}
            title="Comparer deux traductions en vis-à-vis"
          >
            <Columns className="h-3.5 w-3.5 text-sky-500" />
            <span className="hidden sm:inline">Traductions Parallèles</span>
          </button>

          {readerSettings.parallelMode && (
            <select
              value={readerSettings.parallelTranslation}
              onChange={(e) =>
                onUpdateReaderSettings({
                  parallelTranslation: e.target.value as TranslationKey,
                })
              }
              aria-label="Sélectionner la traduction parallèle de comparaison"
              className="bg-white text-xs font-semibold text-sky-700 border border-sky-200 rounded-xl px-2 py-1 focus:outline-none shadow-xs"
            >
              {BIBLE_TRANSLATIONS.map((t) => (
                <option key={t.key} value={t.key} className="bg-white text-slate-900">
                  {t.name}
                </option>
              ))}
            </select>
          )}

          {/* Audio read chapter */}
          <button
            onClick={handleToggleChapterAudio}
            className={`p-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              isPlayingAudio ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
            }`}
            title={isPlayingAudio ? 'Arrêter la lecture audio' : 'Écouter le chapitre'}
          >
            {isPlayingAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-sky-500" />}
          </button>

          {/* Export & Print */}
          <button
            onClick={handleExportText}
            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors hidden sm:inline-flex cursor-pointer"
            title="Exporter en fichier texte brut"
          >
            <FileText className="h-4 w-4 text-sky-500" />
          </button>

          <button
            onClick={handlePrintChapter}
            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors hidden sm:inline-flex cursor-pointer"
            title="Imprimer ou exporter en PDF"
          >
            <Printer className="h-4 w-4 text-sky-500" />
          </button>

          {/* Reader Display Settings */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isSettingsOpen ? 'bg-sky-100 text-sky-700' : 'text-slate-500 hover:text-sky-600 hover:bg-sky-50'
            }`}
            title="Personnaliser le confort de lecture"
          >
            <Sliders className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Settings Dropdown Drawer */}
      {isSettingsOpen && (
        <div className={`border-b p-4 text-xs space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-150 ${getContainerSurfaceClasses()}`}>
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-6">
            {/* Font Size */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">Taille police :</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    onUpdateReaderSettings({
                      fontSize: Math.max(14, readerSettings.fontSize - 2),
                    })
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold"
                >
                  A-
                </button>
                <span className="px-2 font-mono text-amber-300 font-bold">{readerSettings.fontSize}px</span>
                <button
                  onClick={() =>
                    onUpdateReaderSettings({
                      fontSize: Math.min(32, readerSettings.fontSize + 2),
                    })
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-semibold"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">Typographie :</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateReaderSettings({ fontFamily: 'serif' })}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    readerSettings.fontFamily === 'serif' ? 'bg-orange-500 text-white font-serif font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Garamond
                </button>
                <button
                  onClick={() => onUpdateReaderSettings({ fontFamily: 'display' })}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    readerSettings.fontFamily === 'display' ? 'bg-orange-500 text-white font-cinzel font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Cinzel
                </button>
                <button
                  onClick={() => onUpdateReaderSettings({ fontFamily: 'sans' })}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    readerSettings.fontFamily === 'sans' ? 'bg-orange-500 text-white font-sans font-bold' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Sans-Serif
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">Interligne :</span>
              <div className="flex items-center gap-1">
                {(['tight', 'normal', 'relaxed'] as const).map((lh) => (
                  <button
                    key={lh}
                    onClick={() => onUpdateReaderSettings({ lineHeight: lh })}
                    className={`px-2.5 py-1 rounded capitalize ${
                      readerSettings.lineHeight === lh ? 'bg-orange-500 text-white font-semibold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {lh === 'tight' ? 'Serré' : lh === 'normal' ? 'Standard' : 'Aéré'}
                  </button>
                ))}
              </div>
            </div>

            {/* Reader Theme */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">Thème de lecture :</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onUpdateReaderSettings({ theme: 'dark' })}
                  className={`px-2.5 py-1 rounded text-xs border ${
                    readerSettings.theme === 'dark' ? 'bg-blue-950 text-amber-300 border-amber-400' : 'bg-[#0A192F] text-slate-300 border-slate-700'
                  }`}
                >
                  Nuit Profonde
                </button>
                <button
                  onClick={() => onUpdateReaderSettings({ theme: 'oled' })}
                  className={`px-2.5 py-1 rounded text-xs border ${
                    readerSettings.theme === 'oled' ? 'bg-black text-amber-300 border-amber-400' : 'bg-neutral-900 text-slate-300 border-neutral-700'
                  }`}
                >
                  Noir OLED
                </button>
                <button
                  onClick={() => onUpdateReaderSettings({ theme: 'sepia' })}
                  className={`px-2.5 py-1 rounded text-xs border ${
                    readerSettings.theme === 'sepia' ? 'bg-[#FBF8F1] text-amber-900 border-amber-800 font-semibold' : 'bg-stone-200 text-stone-800 border-stone-300'
                  }`}
                >
                  Parchemin Sépia
                </button>
                <button
                  onClick={() => onUpdateReaderSettings({ theme: 'light' })}
                  className={`px-2.5 py-1 rounded text-xs border ${
                    readerSettings.theme === 'light' ? 'bg-white text-slate-900 border-slate-900 font-semibold' : 'bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  Jour Épuré
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Drawer Modal */}
      {isBookDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-2xl bg-[#0E2442] border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 bg-[#0A192F] border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-amber-300">
                  Les 66 Livres de la Bible
                </h3>
                <p className="text-xs text-slate-400">
                  39 livres de l'Ancien Testament · 27 livres du Nouveau Testament
                </p>
              </div>
              <button
                onClick={() => setIsBookDrawerOpen(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
              >
                Fermer
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <input
                type="text"
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                placeholder="Filtrer par nom de livre (ex: Genèse, Romains, Psaumes)..."
                className="w-full sm:w-72 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />

              <div className="flex items-center gap-1.5">
                {(['ALL', 'AT', 'NT'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTestamentFilter(t)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      testamentFilter === t ? 'bg-orange-500 text-white font-semibold' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t === 'ALL' ? 'Tous les 66' : t === 'AT' ? 'Ancien T. (39)' : 'Nouveau T. (27)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {filteredBooks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onSelectBookAndChapter(b.id, 1);
                    setIsBookDrawerOpen(false);
                  }}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    currentBook.id === b.id
                      ? 'border-orange-500 bg-orange-950/30 text-amber-200 shadow-md'
                      : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-orange-400 font-mono font-bold block mb-1">
                      {b.shortName} · {b.testament}
                    </span>
                    <span className="font-semibold text-xs leading-tight block">
                      {b.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2 block">
                    {b.chaptersCount} chap.
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chapters Grid Modal */}
      {isChapterGridOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0E2442] border border-slate-700 shadow-2xl p-6 flex flex-col overflow-hidden max-h-[75vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="font-cinzel text-base font-bold text-amber-300">
                  {currentBook.name} — Chapitres
                </h3>
                <p className="text-xs text-slate-400">
                  Sélectionnez un chapitre à lire ({currentBook.chaptersCount} au total)
                </p>
              </div>
              <button
                onClick={() => setIsChapterGridOpen(false)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300"
              >
                Fermer
              </button>
            </div>

            <div className="overflow-y-auto grid grid-cols-5 sm:grid-cols-6 gap-2">
              {Array.from({ length: currentBook.chaptersCount }, (_, i) => i + 1).map((cNum) => (
                <button
                  key={cNum}
                  onClick={() => {
                    onSelectBookAndChapter(currentBook.id, cNum);
                    setIsChapterGridOpen(false);
                  }}
                  className={`h-11 rounded-xl text-xs font-semibold font-mono transition-all flex items-center justify-center ${
                    currentChapter === cNum
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                      : 'bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  {cNum}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Chapter Reading Canvas */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Chapter Title & Header */}
        <div className="text-center mb-8 border-b border-slate-800/80 pb-6">
          <span className="text-xs uppercase tracking-widest text-orange-400 font-semibold font-cinzel">
            {currentBook.testament === 'AT' ? 'Ancien Testament' : 'Nouveau Testament'} · {currentBook.category}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mt-2 text-slate-100">
            {currentBook.name}
          </h1>
          <p className="font-cormorant text-xl text-slate-400 italic mt-1">
            Chapitre {currentChapter}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 bg-orange-950/40 text-orange-300 px-3 py-1 rounded-full border border-orange-500/30 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
              <span>Conforme à emcitv.com/bible/ ({currentTranslation})</span>
            </span>
            <span>·</span>
            <span>{displayedVerses.length} versets</span>
            <span>·</span>
            <button
              onClick={() => setShowStrongConcordance(!showStrongConcordance)}
              className={`px-2.5 py-0.5 rounded-full border text-[11px] transition-colors ${
                showStrongConcordance
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-semibold'
                  : 'text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Afficher les mots originaux hébreux et grecs et codes Strong comme sur EMCI TV"
            >
              Concordance Strong : {showStrongConcordance ? 'Active' : 'Désactivée'}
            </button>
          </div>

          {isLoadingExactBible && (
            <div className="mt-3 py-1.5 px-4 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs text-orange-300 flex items-center justify-center gap-2 animate-pulse">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Chargement du texte exact Louis Segond 1910...</span>
            </div>
          )}
        </div>

        {/* Verses Layout: Single or Parallel Mode */}
        {!readerSettings.parallelMode ? (
          /* Single Translation View */
          <div
            className={`space-y-4 ${getFontFamilyClass()} ${getLineHeightClass()}`}
            style={{ fontSize: `${readerSettings.fontSize}px` }}
          >
            {displayedVerses.length === 0 && (
              <div className="py-16 text-center space-y-4 rounded-2xl bg-[#0E2442]/60 border border-slate-800 p-8">
                <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center animate-pulse">
                  <Book className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-cinzel text-lg font-bold text-slate-100">
                    Chargement de {currentBook.name} {currentChapter}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Récupération du texte authentique Louis Segond 1910 ({currentTranslation})...
                  </p>
                </div>
              </div>
            )}

            {displayedVerses.map((v) => {
              const userHl = highlights.find(
                (h) => h.bookId === v.bookId && h.chapter === v.chapter && h.verse === v.verse
              );
              const userNt = notes.find(
                (n) => n.bookId === v.bookId && n.chapter === v.chapter && n.verse === v.verse
              );
              const isBm = bookmarks.some(
                (b) => b.bookId === v.bookId && b.chapter === v.chapter && b.verse === v.verse
              );

              // Highlight styles
              let hlClass = '';
              if (userHl) {
                switch (userHl.color) {
                  case 'orange':
                    hlClass = 'bg-orange-500/25 border-l-4 border-orange-500 pl-3 rounded-r-lg';
                    break;
                  case 'yellow':
                    hlClass = 'bg-amber-400/25 border-l-4 border-amber-400 pl-3 rounded-r-lg';
                    break;
                  case 'green':
                    hlClass = 'bg-emerald-500/25 border-l-4 border-emerald-500 pl-3 rounded-r-lg';
                    break;
                  case 'blue':
                    hlClass = 'bg-sky-500/25 border-l-4 border-sky-500 pl-3 rounded-r-lg';
                    break;
                  case 'purple':
                    hlClass = 'bg-purple-500/25 border-l-4 border-purple-500 pl-3 rounded-r-lg';
                    break;
                }
              }

              return (
                <div
                  key={v.verse}
                  onClick={() => onOpenVerseModal(v)}
                  className={`group relative p-2.5 -mx-2.5 rounded-xl cursor-pointer hover:bg-slate-800/40 transition-all ${hlClass}`}
                >
                  <div className="flex items-baseline gap-3">
                    {readerSettings.showVerseNumbers && (
                      <span className="font-mono text-xs font-bold text-orange-400/90 select-none shrink-0 w-6 text-right">
                        {v.verse}
                      </span>
                    )}

                    <div className="flex-1">
                      <span>{v.text}</span>

                      {/* Strong Hebrew/Greek Root & Concordance definition */}
                      {showStrongConcordance && v.strongCode && (
                        <div className="mt-1 text-[11px] font-mono text-amber-400/90 flex flex-wrap items-center gap-2 not-italic">
                          <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 font-bold">
                            {v.strongCode}
                          </span>
                          {v.strongOriginal && (
                            <span className="italic font-serif text-slate-300">
                              « {v.strongOriginal} »
                            </span>
                          )}
                          {v.strongDefinition && (
                            <span className="text-slate-400 text-[10px]">
                              ({v.strongDefinition})
                            </span>
                          )}
                        </div>
                      )}

                      {/* Attached user note preview pill if present */}
                      {userNt && (
                        <div className="mt-2 text-xs font-sans not-italic bg-slate-900/90 border border-slate-700 p-2.5 rounded-lg text-slate-300 flex items-start gap-2 shadow-sm">
                          <MessageSquare className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-semibold text-amber-300 block mb-0.5">Ma Réflexion :</span>
                            <p className="line-clamp-2">{userNt.text}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quick interactive indicators */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0 self-center">
                      {isBm && <Bookmark className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />}
                      <span className="text-[10px] text-slate-400 font-sans uppercase tracking-wider">
                        Annoter
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Parallel Multi-Translation Mode */
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-800 text-xs font-bold font-cinzel text-amber-300">
              <div>{currentTranslation} (Principale)</div>
              <div>{readerSettings.parallelTranslation} (Comparée)</div>
            </div>

            <div
              className={`space-y-4 ${getFontFamilyClass()} ${getLineHeightClass()}`}
              style={{ fontSize: `${readerSettings.fontSize}px` }}
            >
              {displayedVerses.length === 0 && (
                <div className="py-16 text-center space-y-4 rounded-2xl bg-[#0E2442]/60 border border-slate-800 p-8">
                  <div className="w-12 h-12 mx-auto rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center animate-pulse">
                    <Book className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-cinzel text-lg font-bold text-slate-100">
                      Chargement des versions comparées...
                    </h3>
                    <p className="text-xs text-slate-400">
                      Récupération de {currentBook.name} {currentChapter} ({currentTranslation} & {readerSettings.parallelTranslation})...
                    </p>
                  </div>
                </div>
              )}

              {displayedVerses.map((pv, idx) => {
                const sv = displayedParallelVerses[idx] || pv;
                return (
                  <div
                    key={pv.verse}
                    onClick={() => onOpenVerseModal(pv)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 rounded-xl border border-slate-800/60 hover:border-orange-500/50 hover:bg-slate-850/50 cursor-pointer transition-all"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-orange-400 mr-2 select-none">
                        {pv.verse}.
                      </span>
                      <span>{pv.text}</span>
                    </div>

                    <div className="text-slate-300 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
                      <span className="font-mono text-xs font-bold text-amber-400 mr-2 select-none">
                        {sv.verse}.
                      </span>
                      <span>{sv.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Chapter Navigation Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handlePrevChapter}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Chapitre Précédent</span>
          </button>

          <span className="font-cinzel text-xs text-slate-400">
            {currentBook.name} {currentChapter} / {currentBook.chaptersCount}
          </span>

          <button
            onClick={handleNextChapter}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all"
          >
            <span>Chapitre Suivant</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
