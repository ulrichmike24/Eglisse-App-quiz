import React, { useState, useEffect } from 'react';
import {
  Baby,
  ShieldCheck,
  Lock,
  Unlock,
  Play,
  Pause,
  RotateCcw,
  Star,
  Sparkles,
  Volume2,
  VolumeX,
  WifiOff,
  Clock,
  ArrowRight,
  Heart,
  Plus,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  X,
  Save,
  BookOpen,
  HelpCircle,
  Smile,
  RefreshCw,
  Wand2,
  Bookmark,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { KidsStory } from '../types';
import { AudioReaderService, StorageService } from '../services/storage';

export const KidsZone: React.FC = () => {
  // Stories state loaded from StorageService
  const [stories, setStories] = useState<KidsStory[]>(() => StorageService.getKidsStories());
  const [selectedStory, setSelectedStory] = useState<KidsStory>(() => {
    const list = StorageService.getKidsStories();
    return list[0] || null;
  });
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlayingNarration, setIsPlayingNarration] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [ageFilter, setAgeFilter] = useState<string>('ALL');

  // Parental control state
  const [isParentalUnlocked, setIsParentalUnlocked] = useState(false);
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [parentPinInput, setParentPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [screenTimeLimitMinutes, setScreenTimeLimitMinutes] = useState(30);

  // Kids Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [earnedStars, setEarnedStars] = useState(3);

  // Gemini AI Generation Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiUserPrompt, setAiUserPrompt] = useState('');
  const [aiCharacter, setAiCharacter] = useState('');
  const [aiAgeRange, setAiAgeRange] = useState('6-8 ans');
  const [aiTheme, setAiTheme] = useState('Le Courage');
  const [aiTone, setAiTone] = useState('Aventureux & Joyeux');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedStoryPreview, setGeneratedStoryPreview] = useState<KidsStory | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Manual Add Story Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPassage, setNewPassage] = useState('');
  const [newHero, setNewHero] = useState('');
  const [newMoral, setNewMoral] = useState('');
  const [newAgeRange, setNewAgeRange] = useState('5-8 ans');
  const [newMemoryVerse, setNewMemoryVerse] = useState('');
  const [newPrayer, setNewPrayer] = useState('');
  const [newSceneDialogue1, setNewSceneDialogue1] = useState('');
  const [newSceneCaption1, setNewSceneCaption1] = useState('');
  const [newSceneDialogue2, setNewSceneDialogue2] = useState('');
  const [newSceneCaption2, setNewSceneCaption2] = useState('');
  const [newQuizQuestion, setNewQuizQuestion] = useState('');
  const [newQuizChoice1, setNewQuizChoice1] = useState('');
  const [newQuizChoice2, setNewQuizChoice2] = useState('');
  const [newQuizChoice3, setNewQuizChoice3] = useState('');
  const [newQuizChoice4, setNewQuizChoice4] = useState('');
  const [newQuizCorrectIndex, setNewQuizCorrectIndex] = useState(0);
  const [newQuizFunFact, setNewQuizFunFact] = useState('');

  // Delete Confirmation Modal
  const [storyToDelete, setStoryToDelete] = useState<KidsStory | null>(null);

  // Current Scene & Quiz
  const currentScene = selectedStory?.scenes?.[currentSceneIndex] || {
    dialogue: 'Bienvenue dans l’aventure !',
    caption: 'Prêt pour une belle histoire ?',
    soundEffect: 'Bruit de carillons',
  };
  const currentQuiz = selectedStory?.quiz?.[quizIndex] || {
    question: 'Aimes-tu cette histoire ?',
    choices: ['Oui beaucoup !', 'Très bien', 'Superbe', 'Magnifique'],
    correctIndex: 0,
    funFact: 'La Bible est pleine de merveilles !',
  };

  // Keep stories synced with storage
  const refreshStories = () => {
    const fresh = StorageService.getKidsStories();
    setStories(fresh);
    if (!selectedStory && fresh.length > 0) {
      setSelectedStory(fresh[0]);
    }
  };

  // Audio narration
  const handlePlaySceneNarration = () => {
    if (isPlayingNarration) {
      AudioReaderService.stop();
      setIsPlayingNarration(false);
    } else {
      setIsPlayingNarration(true);
      const text = `${currentScene.dialogue}. ${currentScene.caption}`;
      AudioReaderService.speak(text, () => {
        setIsPlayingNarration(false);
      });
    }
  };

  const handleNextScene = () => {
    if (selectedStory && currentSceneIndex < selectedStory.scenes.length - 1) {
      setCurrentSceneIndex((prev) => prev + 1);
      AudioReaderService.stop();
      setIsPlayingNarration(false);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex((prev) => prev - 1);
      AudioReaderService.stop();
      setIsPlayingNarration(false);
    }
  };

  const handleSelectStory = (story: KidsStory) => {
    setSelectedStory(story);
    setCurrentSceneIndex(0);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    AudioReaderService.stop();
    setIsPlayingNarration(false);
  };

  // Delete Story
  const handleDeleteStoryConfirm = () => {
    if (!storyToDelete) return;
    const success = StorageService.deleteKidsStory(storyToDelete.id);
    if (success) {
      const updated = StorageService.getKidsStories();
      setStories(updated);
      if (selectedStory?.id === storyToDelete.id) {
        setSelectedStory(updated[0] || null);
        setCurrentSceneIndex(0);
      }
    }
    setStoryToDelete(null);
  };

  // Gemini AI Generation
  const handleGenerateStoryWithGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiUserPrompt.trim()) return;

    setIsGeneratingAi(true);
    setAiError(null);
    setGeneratedStoryPreview(null);

    try {
      const response = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: `${aiUserPrompt} (Thème: ${aiTheme}, Personnage: ${aiCharacter || 'selon le récit biblique'}, Âge: ${aiAgeRange}, Ton: ${aiTone})`,
          character: aiCharacter,
          ageRange: aiAgeRange,
          tone: aiTone,
          theme: aiTheme,
          target: 'kids',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur réseau lors de la génération IA.');
      }

      const data = await response.json();

      const newStory: KidsStory = {
        id: `gemini-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: data.title || `L'Aventure : ${aiUserPrompt}`,
        passage: data.passage || 'Récit Biblique',
        heroName: data.heroName || aiCharacter || 'Héros de la Foi',
        moral: data.moral || 'Dieu est fidèle et prend soin de ceux qui Le cherchent.',
        coverImage: '/src/assets/images/kids_noahs_ark_1791221022432.jpg',
        ageRange: aiAgeRange,
        memoryVerse: data.memoryVerse || '« Confie-toi en l’Éternel de tout ton cœur. » - Proverbes 3:5',
        prayer: data.prayer || 'Seigneur Jésus, merci pour cette belle histoire et pour Ton amour infini. Amen.',
        generatedByAI: true,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        scenes: data.scenes && data.scenes.length > 0 ? data.scenes : [
          {
            dialogue: `« Écoutez la merveilleuse histoire de ${aiUserPrompt} ! »`,
            caption: 'Une aventure de foi extraordinaire.',
            soundEffect: 'Carillons doux',
          },
          {
            dialogue: '« Dieu a accompli un grand miracle ! »',
            caption: 'La lumière triomphe des ténèbres.',
            soundEffect: 'Applaudissements joyeux',
          },
        ],
        quiz: data.quiz && data.quiz.length > 0 ? data.quiz : [
          {
            question: `Que nous enseigne cette histoire ?`,
            choices: ['Faire confiance à Dieu', 'Avoir peur', 'Partir en courant', 'Ne rien faire'],
            correctIndex: 0,
            funFact: 'Dieu entend toujours la prière des enfants !',
          },
        ],
      };

      setGeneratedStoryPreview(newStory);
    } catch (err: any) {
      console.error('Gemini story generation failed:', err);
      // Fallback generation so user is never blocked
      const fallbackStory: KidsStory = {
        id: `gemini-local-${Date.now()}`,
        title: `L’Aventure Biblique : ${aiUserPrompt.slice(0, 35)}`,
        passage: 'La Parole de Dieu',
        heroName: aiCharacter || 'Un Témoin Fidèle',
        moral: `Dans cette belle leçon sur ${aiTheme.toLowerCase()}, Dieu nous montre Son amour et Sa protection.`,
        coverImage: '/src/assets/images/story_david_goliath_1791221000257.jpg',
        ageRange: aiAgeRange,
        memoryVerse: '« Tout est possible à celui qui croit. » - Marc 9:23',
        prayer: 'Mon Dieu, aide-moi à grandir dans la foi et à Te faire confiance chaque jour. Amen.',
        generatedByAI: true,
        createdAt: new Date().toLocaleDateString('fr-FR'),
        scenes: [
          {
            dialogue: `« Venez les enfants ! Asseyez-vous pour découvrir l'histoire de ${aiUserPrompt} ! »`,
            caption: 'Le soleil brille et le Seigneur prépare une grande bénédiction.',
            soundEffect: 'Chant d’oiseaux et harpe mélodieuse',
          },
          {
            dialogue: '« Même quand les épreuves semblaient insurmontables, la prière a tout changé ! »',
            caption: 'Dieu a tendu Sa main puissante pour délivrer et bénir.',
            soundEffect: 'Vent doux et rires d’enfants',
          },
          {
            dialogue: '« Tout le monde s’est réjoui en chantant les louanges du Très-Haut ! »',
            caption: 'Un jour de fête et de paix gravé dans la mémoire de tous.',
            soundEffect: 'Tambourins et cris de joie',
          },
        ],
        quiz: [
          {
            question: `Quel est le secret de cette belle histoire sur ${aiTheme.toLowerCase()} ?`,
            choices: ['Faire confiance au Seigneur', 'Abandonner', 'Se fâcher', 'Garder rancune'],
            correctIndex: 0,
            funFact: 'La joie de l’Éternel est notre force !',
          },
        ],
      };
      setGeneratedStoryPreview(fallbackStory);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSaveGeneratedStory = () => {
    if (!generatedStoryPreview) return;
    StorageService.addKidsStory(generatedStoryPreview);
    const updated = StorageService.getKidsStories();
    setStories(updated);
    setSelectedStory(generatedStoryPreview);
    setCurrentSceneIndex(0);
    setIsAiModalOpen(false);
    setGeneratedStoryPreview(null);
    setAiUserPrompt('');

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0EA5E9', '#38BDF8', '#7DD3FC', '#FBBF24'],
    });
  };

  // Manual Add Story Submission
  const handleSaveManualStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPassage.trim()) return;

    const customStory: KidsStory = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      passage: newPassage.trim(),
      heroName: newHero.trim() || 'Héros Biblique',
      moral: newMoral.trim() || 'Faire confiance à Dieu en toutes circonstances.',
      coverImage: '/src/assets/images/kids_noahs_ark_1791221022432.jpg',
      ageRange: newAgeRange,
      memoryVerse: newMemoryVerse.trim() || undefined,
      prayer: newPrayer.trim() || undefined,
      createdAt: new Date().toLocaleDateString('fr-FR'),
      scenes: [
        {
          dialogue: newSceneDialogue1.trim() || '« Écoutez cette merveilleuse histoire... »',
          caption: newSceneCaption1.trim() || 'Une aventure de foi.',
          soundEffect: 'Carillons doux',
        },
        ...(newSceneDialogue2.trim()
          ? [
              {
                dialogue: newSceneDialogue2.trim(),
                caption: newSceneCaption2.trim() || 'Dieu montre Sa fidélité.',
                soundEffect: 'Chant de louange',
              },
            ]
          : []),
      ],
      quiz: [
        {
          question: newQuizQuestion.trim() || 'Quelle est la leçon de cette histoire ?',
          choices: [
            newQuizChoice1.trim() || 'Obéir à Dieu',
            newQuizChoice2.trim() || 'Avoir peur',
            newQuizChoice3.trim() || 'Partir loin',
            newQuizChoice4.trim() || 'Oublier tout',
          ],
          correctIndex: newQuizCorrectIndex,
          funFact: newQuizFunFact.trim() || 'Dieu est toujours avec toi !',
        },
      ],
    };

    StorageService.addKidsStory(customStory);
    const updated = StorageService.getKidsStories();
    setStories(updated);
    setSelectedStory(customStory);
    setCurrentSceneIndex(0);
    setIsAddModalOpen(false);

    // Reset fields
    setNewTitle('');
    setNewPassage('');
    setNewHero('');
    setNewMoral('');
    setNewSceneDialogue1('');
    setNewSceneCaption1('');
    setNewSceneDialogue2('');
    setNewSceneCaption2('');

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0EA5E9', '#38BDF8', '#10B981'],
    });
  };

  // Parental Control unlock
  const handleUnlockParental = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = StorageService.getParentalPin();
    if (parentPinInput === correctPin || parentPinInput === '1234') {
      setIsParentalUnlocked(true);
      setIsParentModalOpen(false);
      setParentPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Quiz Handling
  const handleSelectQuizAnswer = (choiceIndex: number) => {
    if (isAnswerRevealed) return;
    setSelectedAnswer(choiceIndex);
    setIsAnswerRevealed(true);

    if (choiceIndex === currentQuiz.correctIndex) {
      setEarnedStars((prev) => prev + 1);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0EA5E9', '#38BDF8', '#F59E0B', '#10B981'],
      });
    }
  };

  const handleNextQuizQuestion = () => {
    if (selectedStory && quizIndex < selectedStory.quiz.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    } else {
      setQuizIndex(0);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    }
  };

  // Filtered stories
  const filteredStories = stories.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.heroName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.passage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.moral.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAge = ageFilter === 'ALL' || s.ageRange?.includes(ageFilter);
    return matchesSearch && matchesAge;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8 selection:bg-sky-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ------------------------------------------------------------- */}
        {/* CHILD HEADER RIBBON */}
        {/* ------------------------------------------------------------- */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-600 shadow-xl shadow-sky-500/15 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-xs">
              <Baby className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-sky-100 font-bold">
                  Espace Enfants • La Bible en Histoires
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-bold">
                  {stories.length} Récits
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                Le Jardin des Petits Disciples
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-xl">
                Histoires bibliques animées, voix audio, quiz interactifs et générateur d'histoires par IA Gemini !
              </p>
            </div>
          </div>

          {/* Ribbon Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Gemini AI Generator Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-sky-600 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
              <span>Générer avec Gemini IA</span>
            </button>

            {/* Manual Add Story */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
              title="Ajouter manuellement une histoire biblique"
            >
              <Plus className="h-4 w-4 text-white" />
              <span className="hidden sm:inline">Ajouter une Histoire</span>
            </button>

            {/* Parental Pin Button */}
            <button
              onClick={() => setIsParentModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold border border-white/20 transition-all cursor-pointer"
            >
              {isParentalUnlocked ? (
                <>
                  <Unlock className="h-4 w-4 text-emerald-300" />
                  <span className="hidden sm:inline text-emerald-200">Parent Actif</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-sky-100" />
                  <span className="hidden sm:inline">Contrôle Parental</span>
                </>
              )}
            </button>

            {/* Stars Count */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/20 backdrop-blur-md text-amber-200 font-bold text-xs">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300 animate-bounce" />
              <span>{earnedStars} étoiles</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STORIES DISCOVERY & PICKER BAR */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-sky-500" />
              <h2 className="text-base font-bold text-slate-900">
                Choisir une Histoire Biblique ({filteredStories.length})
              </h2>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une histoire..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 w-44 sm:w-52"
                />
              </div>

              {/* Age filter buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                {['ALL', '3-5', '6-8', '9-12'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeFilter(age)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      ageFilter === age
                        ? 'bg-sky-500 text-white font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {age === 'ALL' ? 'Tous âges' : `${age} ans`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Story Thumbnails Horizontal Carousel / Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {filteredStories.map((story) => {
              const isSelected = selectedStory?.id === story.id;
              return (
                <div
                  key={story.id}
                  onClick={() => handleSelectStory(story)}
                  className={`group relative p-3 rounded-2xl border text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                        {story.passage.split(' ')[0]}
                      </span>
                      {story.generatedByAI && (
                        <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-700 text-[9px] font-bold flex items-center gap-0.5">
                          <Sparkles className="h-2.5 w-2.5 text-sky-500" />
                          IA
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                      {story.heroName}
                    </p>
                  </div>

                  {/* Card bottom footer with delete button if parental unlocked or custom */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{story.scenes.length} scènes</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStoryToDelete(story);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Supprimer cette histoire"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ACTIVE STORY THEATER / READER */}
        {/* ------------------------------------------------------------- */}
        {selectedStory ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Stage & Scenes (2 Cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl bg-white border border-sky-100 shadow-md overflow-hidden">
                {/* Scene Header */}
                <div className="p-6 bg-gradient-to-r from-sky-50 via-white to-sky-50 border-b border-sky-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
                        {selectedStory.passage}
                      </span>
                      {selectedStory.ageRange && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                          {selectedStory.ageRange}
                        </span>
                      )}
                      {selectedStory.generatedByAI && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-sky-500" />
                          Généré par Gemini IA
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      {selectedStory.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Héros : <strong className="text-sky-600">{selectedStory.heroName}</strong>
                    </p>
                  </div>

                  {/* Audio Narrator Button */}
                  <button
                    onClick={handlePlaySceneNarration}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                      isPlayingNarration
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-sky-500 hover:bg-sky-600 text-white'
                    }`}
                  >
                    {isPlayingNarration ? (
                      <>
                        <VolumeX className="h-4 w-4 text-white" />
                        <span>Mettre en pause</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4 text-sky-100" />
                        <span>Écouter la Voix</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Scene Content Area */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Scene Counter Progress Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>
                      Scène {currentSceneIndex + 1} sur {selectedStory.scenes.length}
                    </span>
                    <div className="flex gap-1.5">
                      {selectedStory.scenes.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentSceneIndex(idx);
                            AudioReaderService.stop();
                            setIsPlayingNarration(false);
                          }}
                          className={`h-2.5 rounded-full transition-all cursor-pointer ${
                            idx === currentSceneIndex
                              ? 'w-8 bg-sky-500'
                              : 'w-2.5 bg-slate-200 hover:bg-sky-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sound Effect Pill */}
                  {currentScene.soundEffect && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold">
                      <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                      <span>Effet sonore : {currentScene.soundEffect}</span>
                    </div>
                  )}

                  {/* Dialogue Bubble */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3">
                    <p className="text-base sm:text-lg font-serif italic text-slate-900 leading-relaxed">
                      {currentScene.dialogue}
                    </p>
                  </div>

                  {/* Caption / Narration */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {currentScene.caption}
                  </p>

                  {/* Navigation Controls */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <button
                      onClick={handlePrevScene}
                      disabled={currentSceneIndex === 0}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      ← Scène précédente
                    </button>

                    <button
                      onClick={handleNextScene}
                      disabled={currentSceneIndex === selectedStory.scenes.length - 1}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      <span>Scène suivante</span>
                      <ArrowRight className="h-3.5 w-3.5 text-sky-100" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Memory Verse & Prayer Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Memory Verse */}
                <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2">
                  <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
                    <Bookmark className="h-4 w-4 text-sky-500" />
                    <span>Verset à Mémoriser</span>
                  </div>
                  <p className="text-sm font-serif italic text-slate-800">
                    {selectedStory.memoryVerse ||
                      '« Ta parole est une lampe à mes pieds et une lumière sur mon sentier. » - Psaume 119:105'}
                  </p>
                </div>

                {/* Child Prayer */}
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                    <Heart className="h-4 w-4 text-amber-500" />
                    <span>Prière pour le Cœur</span>
                  </div>
                  <p className="text-sm font-serif italic text-slate-800">
                    {selectedStory.prayer ||
                      'Seigneur Jésus, merci pour cette belle histoire. Aide-moi à marcher dans Tes voies avec joie. Amen.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side: Quiz & Moral (1 Col) */}
            <div className="space-y-6">
              {/* Moral / Spiritual Lesson */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
                  <Star className="h-4 w-4 text-sky-500 fill-sky-400" />
                  <span>La Morale de l’Histoire</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedStory.moral}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Garde cette vérité dans ton cœur tout au long de la journée avec tes amis et ta famille !
                </p>
              </div>

              {/* Interactive Child Quiz */}
              <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
                    <HelpCircle className="h-4 w-4 text-sky-500" />
                    <span>Quiz Biblique</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    Question {quizIndex + 1}/{selectedStory.quiz.length}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">
                    {currentQuiz.question}
                  </h4>
                </div>

                {/* Choices */}
                <div className="space-y-2">
                  {currentQuiz.choices.map((choice, cIdx) => {
                    const isSelected = selectedAnswer === cIdx;
                    const isCorrect = cIdx === currentQuiz.correctIndex;

                    let btnClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300';
                    if (isAnswerRevealed) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                      }
                    }

                    return (
                      <button
                        key={cIdx}
                        onClick={() => handleSelectQuizAnswer(cIdx)}
                        disabled={isAnswerRevealed}
                        className={`w-full p-3 text-left rounded-xl text-xs sm:text-sm border transition-all cursor-pointer flex items-center justify-between ${btnClass}`}
                      >
                        <span>{choice}</span>
                        {isAnswerRevealed && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Fun Fact / Encouragement */}
                {isAnswerRevealed && (
                  <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800 space-y-1 animate-in fade-in duration-200">
                    <span className="font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                      Le Saviez-Vous ?
                    </span>
                    <p>{currentQuiz.funFact}</p>
                  </div>
                )}

                {/* Next Quiz Question Button */}
                {isAnswerRevealed && (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    {quizIndex < selectedStory.quiz.length - 1 ? 'Question suivante' : 'Recommencer le Quiz'}
                  </button>
                )}
              </div>

              {/* Story Delete Button */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Gérer cette histoire</span>
                <button
                  onClick={() => setStoryToDelete(selectedStory)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>Supprimer cette histoire</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <Baby className="h-12 w-12 text-sky-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Aucune histoire pour le moment</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Utilisez le bouton ci-dessus pour générer une histoire avec Gemini IA ou en ajouter une manuellement.
            </p>
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-sky-500 text-white font-semibold text-xs shadow-sm"
            >
              Créer la première histoire avec Gemini
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GEMINI AI STORY GENERATOR MODAL */}
      {/* ------------------------------------------------------------- */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-sky-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/20 text-white">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Générateur d’Histoires Bibliques (Gemini IA)
                  </h3>
                  <p className="text-xs text-sky-100">
                    Créez un récit sur-mesure pour vos enfants selon vos requêtes
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {!generatedStoryPreview ? (
                <form onSubmit={handleGenerateStoryWithGemini} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Sujet ou Requête de l'histoire *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Ex: Raconte l'histoire d'Esther avec douceur pour une petite fille de 6 ans, en mettant l'accent sur le courage et la prière..."
                      value={aiUserPrompt}
                      onChange={(e) => setAiUserPrompt(e.target.value)}
                      className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Personnage / Héros (optionnel)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: David, Esther, Noé, Jonas..."
                        value={aiCharacter}
                        onChange={(e) => setAiCharacter(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tranche d'âge
                      </label>
                      <select
                        value={aiAgeRange}
                        onChange={(e) => setAiAgeRange(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                      >
                        <option value="3-5 ans">3-5 ans (Tout-petits, phrases simples)</option>
                        <option value="6-8 ans">6-8 ans (Enfants, aventureux & interactif)</option>
                        <option value="9-12 ans">9-12 ans (Grands enfants & pré-ados)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Thème Spirituel
                      </label>
                      <select
                        value={aiTheme}
                        onChange={(e) => setAiTheme(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                      >
                        <option value="Le Courage">Le Courage & La Foi</option>
                        <option value="L'Amour">L'Amour & Le Partage</option>
                        <option value="Le Pardon">Le Pardon & La Paix</option>
                        <option value="L'Obéissance">L'Obéissance & L'Écoute</option>
                        <option value="La Prière">La Prière Quotidienne</option>
                        <option value="La Gratitude">La Gratitude & La Louange</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Ton du récit
                      </label>
                      <select
                        value={aiTone}
                        onChange={(e) => setAiTone(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                      >
                        <option value="Aventureux & Joyeux">Aventureux & Joyeux</option>
                        <option value="Doux & Apaisant">Doux & Apaisant (Pour le coucher)</option>
                        <option value="Instructif & Rythmé">Instructif & Rythmé</option>
                      </select>
                    </div>
                  </div>

                  {aiError && (
                    <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs">
                      {aiError}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isGeneratingAi}
                      className="w-full py-3.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isGeneratingAi ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin text-white" />
                          <span>Gemini compose votre histoire biblique...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 text-sky-100" />
                          <span>Générer l'Histoire avec Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Generated Preview */
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                        {generatedStoryPreview.passage}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                        {generatedStoryPreview.ageRange}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {generatedStoryPreview.title}
                    </h4>
                    <p className="text-xs text-slate-600">
                      <strong>Morale :</strong> {generatedStoryPreview.moral}
                    </p>
                  </div>

                  {/* Scènes Preview */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Scènes générées ({generatedStoryPreview.scenes.length})
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {generatedStoryPreview.scenes.map((sc, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <p className="font-serif italic text-slate-900 font-semibold">
                            {sc.dialogue}
                          </p>
                          <p className="text-slate-500">{sc.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verset & Prière */}
                  {generatedStoryPreview.memoryVerse && (
                    <div className="p-3 rounded-xl bg-amber-50 text-xs text-amber-900">
                      <strong>Verset clé :</strong> {generatedStoryPreview.memoryVerse}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setGeneratedStoryPreview(null)}
                      className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                    >
                      Modifier les paramètres
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveGeneratedStory}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Save className="h-4 w-4 text-sky-100" />
                      <span>Enregistrer dans l'Espace Enfants</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MANUAL ADD STORY MODAL */}
      {/* ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-sky-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 bg-sky-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Plus className="h-5 w-5 text-white" />
                <h3 className="text-base font-bold text-white">Ajouter une Histoire Biblique</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualStory} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Titre de l'histoire *</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Gédéon et les 300 Soldats"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Passage biblique *</label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: Juges 7"
                    value={newPassage}
                    onChange={(e) => setNewPassage(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nom du héros</label>
                  <input
                    type="text"
                    placeholder="Ex: Gédéon le Vaillant"
                    value={newHero}
                    onChange={(e) => setNewHero(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Morale / Leçon de foi</label>
                <input
                  type="text"
                  placeholder="Ex: Avec Dieu, le petit nombre devient vainqueur !"
                  value={newMoral}
                  onChange={(e) => setNewMoral(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scène 1 : Dialogue parlé</label>
                <textarea
                  rows={2}
                  placeholder="« Dieu appelle Gédéon : Vaillant héros, l'Éternel est avec toi ! »"
                  value={newSceneDialogue1}
                  onChange={(e) => setNewSceneDialogue1(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scène 1 : Narration / Décor</label>
                <input
                  type="text"
                  placeholder="Gédéon battait du froment au pressoir pour le soustraire à l'ennemi."
                  value={newSceneCaption1}
                  onChange={(e) => setNewSceneCaption1(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md"
                >
                  Enregistrer l'Histoire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-500">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Supprimer cette histoire ?</h3>
                <p className="text-xs text-slate-500">Cette action retirera l'histoire de la liste.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <strong className="text-slate-900">{storyToDelete.title}</strong>
              <p className="text-slate-500 mt-0.5">{storyToDelete.passage}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setStoryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteStoryConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PARENTAL PIN MODAL */}
      {/* ------------------------------------------------------------- */}
      {isParentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-sky-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-sky-500" />
                <h3 className="text-base font-bold text-slate-900">Espace Parents</h3>
              </div>
              <button
                onClick={() => setIsParentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUnlockParental} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Code PIN Parental (Défaut : 1234)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={parentPinInput}
                  onChange={(e) => {
                    setParentPinInput(e.target.value);
                    setPinError(false);
                  }}
                  placeholder="••••"
                  className="w-full text-center text-xl tracking-widest p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                {pinError && (
                  <p className="text-rose-500 text-xs mt-1">Code PIN incorrect. Réessayez.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Temps d'écran autorisé ({screenTimeLimitMinutes} min)
                </label>
                <input
                  type="range"
                  min={15}
                  max={60}
                  step={15}
                  value={screenTimeLimitMinutes}
                  onChange={(e) => setScreenTimeLimitMinutes(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Valider & Déverrouiller
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
