import React, { useState } from 'react';
import {
  Flame,
  Award,
  Sparkles,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Share2,
  Calendar,
  Volume2,
  MessageSquare,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  DailyReadingChallenge,
  DiscipleshipGroup,
  GroupMemberProgress,
  UserProfile,
  ChallengeCategory,
} from '../types';
import { DAILY_READING_CHALLENGES, getTodayChallenge } from '../data/dailyChallengesData';
import { AudioReaderService } from '../services/storage';

interface DailyBibleChallengesSectionProps {
  userProfile: UserProfile;
  selectedGroup: DiscipleshipGroup | null;
  membersProgress: GroupMemberProgress[];
  onAwardChallengePoints: (
    userPoints: number,
    bonusGroupPoints: number,
    challengeTitle: string
  ) => void;
  onNavigateToPassage?: (bookId: string, chapter: number) => void;
  completedChallengeIds: string[];
}

export const DailyBibleChallengesSection: React.FC<DailyBibleChallengesSectionProps> = ({
  userProfile,
  selectedGroup,
  membersProgress,
  onAwardChallengePoints,
  onNavigateToPassage,
  completedChallengeIds,
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(() => {
    return getTodayChallenge().id;
  });

  // Quiz state
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // User reflection note
  const [userReflection, setUserReflection] = useState<string>('');
  const [hasActionConfirmed, setHasActionConfirmed] = useState<boolean>(false);

  // Audio reading
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Category filter
  const [filterCategory, setFilterCategory] = useState<ChallengeCategory | 'all'>('all');

  const activeChallenge =
    DAILY_READING_CHALLENGES.find((c) => c.id === selectedChallengeId) || getTodayChallenge();

  const isAlreadyCompleted = completedChallengeIds.includes(activeChallenge.id);

  // Calculate user group stats
  const currentMember = membersProgress.find((m) => m.userId === userProfile.id);
  const userRankInGroup = [...membersProgress]
    .sort((a, b) => b.points - a.points)
    .findIndex((m) => m.userId === userProfile.id) + 1;

  const filteredChallenges = DAILY_READING_CHALLENGES.filter((c) => {
    if (filterCategory === 'all') return true;
    return c.category === filterCategory;
  });

  const handleSelectChallenge = (id: string) => {
    setSelectedChallengeId(id);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setQuizFeedback(null);
    setUserReflection('');
    setHasActionConfirmed(false);
    if (isPlayingAudio) {
      AudioReaderService.stop();
      setIsPlayingAudio(false);
    }
  };

  const handleToggleReadAudio = () => {
    if (isPlayingAudio) {
      AudioReaderService.stop();
      setIsPlayingAudio(false);
    } else {
      const speechText = `Défi de lecture biblique : ${activeChallenge.title}. Passage : ${activeChallenge.versesRange}. Thème : ${activeChallenge.theme}. Verset clé : ${activeChallenge.keyVerse}. Méditation : ${activeChallenge.contextNote} ${activeChallenge.readingFocus}. Action concrète du jour : ${activeChallenge.practicalAction}`;
      AudioReaderService.speak(speechText, () => {
        setIsPlayingAudio(false);
      });
      setIsPlayingAudio(true);
    }
  };

  const handleVerifyQuiz = () => {
    if (selectedQuizOption === null || !activeChallenge.quizQuestion) return;
    setIsQuizSubmitted(true);
    if (selectedQuizOption === activeChallenge.quizQuestion.correctIndex) {
      setQuizFeedback('Bonne réponse ! Vous avez validé la compréhension théologique du passage.');
    } else {
      setQuizFeedback('Réponse inexacte. Lisez attentivement l’explication ci-dessous.');
    }
  };

  const handleCompleteChallenge = () => {
    if (isAlreadyCompleted) return;

    // Trigger celebration
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#fbbf24', '#10b981'],
      });
    } catch {}

    const totalUserPts = activeChallenge.pointsReward + (isQuizSubmitted && selectedQuizOption === activeChallenge.quizQuestion?.correctIndex ? 15 : 0);
    const totalBonusGroupPts = activeChallenge.bonusGroupPoints;

    onAwardChallengePoints(totalUserPts, totalBonusGroupPts, activeChallenge.title);
  };

  const getCategoryBadge = (cat: ChallengeCategory) => {
    switch (cat) {
      case 'meditation':
        return { label: 'Méditation', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'memorization':
        return { label: 'Mémorisation', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'theology':
        return { label: 'Théologie', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'intercession':
        return { label: 'Intercession', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'discipleship':
        return { label: 'Discipulat', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      default:
        return { label: 'Lecture', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER & REWARD BANNER */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-linear-to-r from-sky-600 via-sky-700 to-indigo-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white border border-white/30">
              <Flame className="h-4 w-4 text-amber-300 animate-pulse" />
              <span>Défis Quotidiens de Lecture Biblique</span>
              <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-1.5 py-0.5 rounded-sm">
                +Bonus Disciples
              </span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Élevez Votre Marche & Boostez Votre Groupe
            </h2>
            <p className="text-xs md:text-sm text-white/95 leading-relaxed font-medium">
              Complétez les défis quotidiens de méditation, mémorisation et mise en pratique. Chaque défi validé octroie des points directs à votre profil et fait grimper la barre de progression collective de votre famille de disciples !
            </p>
          </div>

          {/* Group and user quick metrics */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 w-full md:w-auto">
            <div className="bg-white/15 backdrop-blur-md border border-white/25 p-3 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold mb-1">
                <Trophy className="h-4 w-4" />
                <span>Mes Points</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white">
                {userProfile.points}
              </div>
              <div className="text-[11px] text-white/90 font-medium mt-0.5 truncate">
                {userRankInGroup > 0 ? `Rang #${userRankInGroup} du groupe` : 'En progression'}
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md border border-white/25 p-3 rounded-2xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-xs font-bold mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Groupe Actif</span>
              </div>
              <div className="text-base sm:text-lg font-bold truncate text-white">
                {selectedGroup ? selectedGroup.name : 'Famille'}
              </div>
              <div className="text-[11px] text-white/90 font-medium mt-0.5 truncate">
                {currentMember ? `${currentMember.dailyCompletedPercent}% aujourd’hui` : 'Objectif actif'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS & LIST OF CHALLENGES */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
            <Compass className="h-3.5 w-3.5" />
            Filtrer :
          </span>
          {[
            { id: 'all', label: 'Tous les défis' },
            { id: 'meditation', label: 'Méditation' },
            { id: 'memorization', label: 'Mémorisation' },
            { id: 'theology', label: 'Théologie' },
            { id: 'discipleship', label: 'Discipulat' },
            { id: 'intercession', label: 'Intercession' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-700 font-semibold">
          {completedChallengeIds.length} sur {DAILY_READING_CHALLENGES.length} défis accomplis
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL / GRID OF CHALLENGES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredChallenges.map((challenge) => {
          const isSelected = challenge.id === activeChallenge.id;
          const isDone = completedChallengeIds.includes(challenge.id);
          const catInfo = getCategoryBadge(challenge.category);

          return (
            <div
              key={challenge.id}
              onClick={() => handleSelectChallenge(challenge.id)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-sky-50/90 border-sky-500 shadow-md ring-2 ring-sky-300'
                  : 'bg-white border-slate-300 hover:border-sky-400 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${catInfo.bg}`}
                >
                  {catInfo.label}
                </span>

                {isDone ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Validé
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                    +{challenge.pointsReward} pts
                  </span>
                )}
              </div>

              <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
                {challenge.title}
              </h4>
              <p className="text-xs text-slate-600 font-semibold line-clamp-1 mb-2">
                {challenge.versesRange}
              </p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 text-slate-700 font-medium">
                <span className="font-bold text-sky-800">+{challenge.bonusGroupPoints} pts groupe</span>
                <span className="text-[11px] text-slate-500">
                  {challenge.id === getTodayChallenge().id ? 'Défi du jour' : 'Disponible'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTIVE CHALLENGE DETAILED CARD */}
      <div className="p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border border-sky-200 shadow-md space-y-5 sm:space-y-6">
        {/* Challenge Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-sky-100">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-bold border ${
                  getCategoryBadge(activeChallenge.category).bg
                }`}
              >
                {getCategoryBadge(activeChallenge.category).label}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {activeChallenge.id === getTodayChallenge().id
                  ? 'Aujourd’hui'
                  : `Jour #${activeChallenge.dayOfYear}`}
              </span>
              {isAlreadyCompleted && (
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Défi validé
                </span>
              )}
            </div>
            <h3 className="font-cinzel text-lg sm:text-xl md:text-2xl font-bold text-slate-900 break-words">
              {activeChallenge.title}
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-sky-700 break-words">
              Passage : {activeChallenge.versesRange} • Thème : {activeChallenge.theme}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto w-full sm:w-auto">
            {/* Audio narration button */}
            <button
              onClick={handleToggleReadAudio}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500 text-white shadow-md animate-pulse'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <Volume2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{isPlayingAudio ? 'Arrêter narration' : 'Écouter le guide'}</span>
            </button>

            {/* Jump to Bible Reader */}
            {onNavigateToPassage && (
              <button
                onClick={() =>
                  onNavigateToPassage(activeChallenge.bookId, activeChallenge.chapter)
                }
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <BookOpen className="h-4 w-4 text-sky-600 shrink-0" />
                <span className="truncate">Ouvrir Bible</span>
              </button>
            )}
          </div>
        </div>

        {/* Key Verse Box */}
        <div className="p-4 md:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Verset Clé à Méditer</span>
          </div>
          <blockquote className="font-serif italic text-base md:text-lg text-slate-800 leading-relaxed">
            « {activeChallenge.keyVerse} »
          </blockquote>
        </div>

        {/* Two-column insights: Context & Focus */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-sky-500" />
              <span>Contexte Historique & Canonique</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeChallenge.contextNote}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-sky-600" />
              <span>Orientation de Lecture & Méditation</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {activeChallenge.readingFocus}
            </p>
          </div>
        </div>

        {/* Practical Action for the Discipleship Group */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-indigo-600" />
              <span>Action Pratique pour le Groupe de Disciples</span>
            </h4>
            <span className="text-[11px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
              +{activeChallenge.bonusGroupPoints} pts pour la famille
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {activeChallenge.practicalAction}
          </p>

          <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={hasActionConfirmed}
              onChange={(e) => setHasActionConfirmed(e.target.checked)}
              disabled={isAlreadyCompleted}
              className="h-4 w-4 text-sky-600 rounded-sm border-slate-300 focus:ring-sky-400 cursor-pointer"
            />
            <span className="text-xs font-semibold text-slate-700">
              J'ai mis en pratique cette action ou partagé la bénédiction avec un membre de mon groupe
            </span>
          </label>
        </div>

        {/* Interactive Quiz Step (Optional extra points) */}
        {activeChallenge.quizQuestion && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-sky-600" />
                <span>Question de Compréhension Biblique</span>
              </h4>
              <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                +15 pts bonus
              </span>
            </div>

            <p className="text-xs font-bold text-slate-800">
              {activeChallenge.quizQuestion.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeChallenge.quizQuestion.options.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === activeChallenge.quizQuestion!.correctIndex;
                let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                if (isQuizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-sky-100 border-sky-400 text-sky-900 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!isQuizSubmitted) setSelectedQuizOption(idx);
                    }}
                    disabled={isQuizSubmitted}
                    className={`p-3 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span className="font-mono text-[10px] text-slate-400 mr-1.5">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {!isQuizSubmitted ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleVerifyQuiz}
                  disabled={selectedQuizOption === null}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs disabled:opacity-40 cursor-pointer"
                >
                  Valider ma réponse
                </button>
              </div>
            ) : (
              <div
                className={`p-3 rounded-xl text-xs ${
                  selectedQuizOption === activeChallenge.quizQuestion.correctIndex
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                <div className="font-bold mb-1">{quizFeedback}</div>
                <p className="text-[11px] opacity-90">
                  {activeChallenge.quizQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reflection Note & Completion Action Button */}
        <div className="pt-2 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-sky-600" />
              <span>Ma réflexion spirituelle du jour (facultatif)</span>
            </label>
            <textarea
              value={userReflection}
              onChange={(e) => setUserReflection(e.target.value)}
              disabled={isAlreadyCompleted}
              placeholder="Ce que l'Esprit me montre à travers ce texte aujourd'hui..."
              rows={2}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-400 resize-none disabled:opacity-60"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
            <div>
              <div className="text-xs font-bold text-sky-900">
                Récompense : +{activeChallenge.pointsReward} pts personnels +{activeChallenge.bonusGroupPoints} pts pour{' '}
                {selectedGroup ? selectedGroup.name : 'le groupe'}
              </div>
              <p className="text-[11px] text-slate-500">
                Fait avancer les objectifs journaliers de votre famille de disciples.
              </p>
            </div>

            {isAlreadyCompleted ? (
              <button
                disabled
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-default"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Défi Déjà Récompensé</span>
              </button>
            ) : (
              <button
                onClick={handleCompleteChallenge}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Award className="h-4 w-4 text-amber-300" />
                <span>Valider et Réclamer les Points</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
