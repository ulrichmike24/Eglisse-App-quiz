import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Clock,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BibleStory } from '../types';
import { BIBLE_STORIES } from '../data/bibleStories';
import { AudioReaderService } from '../services/storage';

interface StoriesSectionProps {
  onAwardPoints: (points: number) => void;
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({ onAwardPoints }) => {
  const [selectedStory, setSelectedStory] = useState<BibleStory>(BIBLE_STORIES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQuestion = selectedStory.quiz[currentQuizIndex];

  const handleToggleStoryAudio = () => {
    if (isPlayingAudio) {
      AudioReaderService.stop();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToRead = `${selectedStory.title}. ${selectedStory.fullNarrative.join(' ')}`;
      AudioReaderService.speak(textToRead, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);

    if (selectedOption === currentQuestion.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < selectedStory.quiz.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      const earnedPoints = (quizScore + (selectedOption === currentQuestion.correctIndex ? 1 : 0)) * 25;
      onAwardPoints(earnedPoints);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B35', '#F59E0B', '#10B981'],
      });
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  const handleSelectDifferentStory = (story: BibleStory) => {
    AudioReaderService.stop();
    setIsPlayingAudio(false);
    setSelectedStory(story);
    handleResetQuiz();
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-sky-600 font-semibold font-cinzel">
              Enseignements & Récits Bibliques
            </span>
            <h1 className="font-cinzel text-3xl font-bold text-slate-900 mt-1">
              Histoires Fondatrices & Quiz d'Apprentissage
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Récits illustrés avec validation des connaissances et points spirituels.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStoryAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/20'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-sky-500" />}
              <span>{isPlayingAudio ? 'Arrêter la narration' : 'Écouter le récit'}</span>
            </button>
          </div>
        </div>

        {/* Stories Horizontal Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BIBLE_STORIES.map((story) => (
            <button
              key={story.id}
              onClick={() => handleSelectDifferentStory(story)}
              className={`text-left p-3 rounded-2xl border transition-all flex items-center gap-3 overflow-hidden group cursor-pointer ${
                selectedStory.id === story.id
                  ? 'bg-sky-50/70 border-sky-400 shadow-md ring-1 ring-sky-400'
                  : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'
              }`}
            >
              <img
                src={story.image}
                alt={story.title}
                referrerPolicy="no-referrer"
                className="h-16 w-16 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] text-sky-600 font-mono font-bold block truncate">
                  {story.reference}
                </span>
                <h4 className="font-cinzel text-xs font-bold text-slate-900 truncate mt-0.5">
                  {story.title}
                </h4>
                <span className="text-[10px] text-slate-500 block mt-1">
                  {story.estimatedMinutes} min de lecture
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Story Main Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Narrative & Visual Card (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg group">
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm">
                <span className="text-[11px] text-sky-600 font-mono font-bold uppercase tracking-wider block">
                  {selectedStory.reference} · {selectedStory.testament === 'AT' ? 'Ancien Testament' : 'Nouveau Testament'}
                </span>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {selectedStory.title}
                </h2>
                <p className="text-xs text-slate-600 italic mt-1">{selectedStory.subtitle}</p>
              </div>
            </div>

            {/* Narrative text */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5 text-slate-700">
              {selectedStory.fullNarrative.map((paragraph, idx) => (
                <p key={idx} className="font-cormorant text-lg sm:text-xl leading-relaxed text-slate-700">
                  {idx === 0 ? (
                    <span className="first-letter:text-4xl first-letter:font-cinzel first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-sky-600">
                      {paragraph}
                    </span>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}

              {/* Spiritual Lesson Callout */}
              <div className="mt-6 p-5 rounded-xl bg-sky-50 border border-sky-200">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-700 font-cinzel uppercase tracking-wider mb-2">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <span>Enseignement Spirituel pour Votre Vie</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedStory.spiritualLesson}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Quiz Panel (5 cols) */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-lg">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  <h3 className="font-cinzel text-base font-bold text-slate-900">
                    Validation des Connaissances
                  </h3>
                </div>
                <span className="text-xs font-mono bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-lg text-sky-700 font-bold">
                  Quiz : {selectedStory.quiz.length} Questions
                </span>
              </div>

              {!isQuizCompleted ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Question {currentQuizIndex + 1} sur {selectedStory.quiz.length}</span>
                    <span className="text-sky-600 font-semibold font-mono">
                      Score : {quizScore} / {currentQuizIndex + (isAnswerSubmitted ? 1 : 0)}
                    </span>
                  </div>

                  {/* Progress indicator */}
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
                      style={{
                        width: `${((currentQuizIndex + 1) / selectedStory.quiz.length) * 100}%`,
                      }}
                    />
                  </div>

                  <h4 className="font-cinzel text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {currentQuestion.question}
                  </h4>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {currentQuestion.options.map((opt, idx) => {
                      let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (selectedOption === idx) {
                        btnStyle = 'bg-sky-50 border-sky-500 text-sky-800 ring-1 ring-sky-500';
                      }

                      if (isAnswerSubmitted) {
                        if (idx === currentQuestion.correctIndex) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500';
                        } else if (selectedOption === idx) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-800';
                        }
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => !isAnswerSubmitted && setSelectedOption(idx)}
                          disabled={isAnswerSubmitted}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswerSubmitted && idx === currentQuestion.correctIndex && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                          )}
                          {isAnswerSubmitted && selectedOption === idx && idx !== currentQuestion.correctIndex && (
                            <XCircle className="h-4 w-4 text-rose-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isAnswerSubmitted && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 animate-in fade-in">
                      <strong className="text-sky-700 block">Explication biblique :</strong>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                  )}

                  {/* Action button */}
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmitQuizAnswer}
                      disabled={selectedOption === null}
                      className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
                    >
                      Valider ma réponse
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuizQuestion}
                      className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>
                        {currentQuizIndex < selectedStory.quiz.length - 1
                          ? 'Question suivante'
                          : 'Voir mes résultats & points'}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ) : (
                /* Quiz Complete Result */
                <div className="text-center py-6 space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
                    <Trophy className="h-8 w-8" />
                  </div>

                  <h4 className="font-cinzel text-lg font-bold text-slate-900">
                    Quiz Accompli avec Succès !
                  </h4>

                  <p className="text-xs text-slate-600">
                    Vous avez obtenu <strong className="text-sky-600 font-mono text-sm">{quizScore} / {selectedStory.quiz.length}</strong> bonnes réponses.
                  </p>

                  <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-800">
                    🎉 +{quizScore * 25} Points de Croissance Spirituelle crédités sur votre compte !
                  </div>

                  <button
                    onClick={handleResetQuiz}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-sky-500" />
                    <span>Recommencer le quiz</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
