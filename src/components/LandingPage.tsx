import React, { useState } from 'react';
import {
  BookOpen,
  Baby,
  Users,
  Sparkles,
  Library,
  Search,
  CheckCircle2,
  Volume2,
  Calendar,
  Languages,
  ShieldCheck,
  Star,
  ArrowRight,
  Heart,
  ChevronRight,
  Flame,
  Award,
  Zap,
  Bookmark,
  Share2,
  Bot,
} from 'lucide-react';
import { ActiveTab } from './Navbar';
import { UserProfile } from '../types';

interface LandingPageProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenAuth: () => void;
  onOpenReadingPlan: () => void;
  onOpenStrongLexicon: () => void;
  userProfile: UserProfile;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateTab,
  onOpenAuth,
  onOpenReadingPlan,
  onOpenStrongLexicon,
  userProfile,
}) => {
  const isGuest = userProfile?.id === 'guest';
  const [quickPrompt, setQuickPrompt] = useState('');

  const handleQuickAiGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateTab('kids');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-500 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-sky-100 bg-gradient-to-b from-sky-50/50 via-white to-white">
        {/* Soft background light blooms */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-sky-200/30 via-sky-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-sky-50 border border-sky-200 shadow-xs text-sky-800 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
            <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
            <span>Plateforme Biblique & Discipulat Chrétien • Inspiré d’EMCI TV</span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="hidden sm:inline text-sky-600 font-medium">66 Livres & IA Gemini</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Plongez dans la <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500">Parole de Dieu</span>,
              <br />
              Grandissez en Famille de Disciples.
            </h1>
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Une expérience spirituelle tout-en-un réunissant le texte intégral des Saintes Écritures,
              la Concordance Strong, un <strong className="text-slate-900 font-semibold">Générateur d’Histoires Bibliques pour Enfants propulsé par l’IA Gemini</strong>,
              ainsi que la gestion complète de vos cellules de disciples et de votre bibliothèque.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => onNavigateTab('chat')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Bot className="h-5 w-5 text-white" />
              <span>Consulter Bible AI (RAG)</span>
              <Sparkles className="h-4 w-4 text-sky-100 animate-pulse" />
            </button>

            <button
              onClick={() => onNavigateTab('bible')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-semibold text-sm sm:text-base shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <BookOpen className="h-5 w-5 text-sky-600" />
              <span>Ouvrir la Bible d’Étude</span>
              <ArrowRight className="h-4 w-4 text-sky-600" />
            </button>

            <button
              onClick={() => onNavigateTab('kids')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-slate-800 hover:text-sky-700 font-semibold text-sm sm:text-base border border-sky-200 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Baby className="h-5 w-5 text-sky-500" />
              <span>Espace Enfants & IA Gemini</span>
              <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">Nouveau</span>
            </button>

            <button
              onClick={() => onNavigateTab('groups')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-sm border border-slate-200 transition-all cursor-pointer"
            >
              <Users className="h-4 w-4 text-sky-500" />
              <span>Familles de Disciples</span>
            </button>

            {isGuest ? (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-200 transition-all cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-sky-500" />
                <span>Se Connecter / Inscription</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-medium text-sm border border-sky-200 transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                <span>Mon Profil ({userProfile.firstName})</span>
              </button>
            )}
          </div>

          {/* Quick Metrics Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-600">66</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Livres de la Bible (AT & NT)</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-600">1 189</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Chapitres complets (LSG, S21...)</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-600">Gemini</span>
              <span className="text-xs text-slate-500 font-medium mt-1">IA Histoires Enfants & Recherche</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-black text-sky-600">100%</span>
              <span className="text-xs text-slate-500 font-medium mt-1">Hors-ligne & CRUD Familles/Livres</span>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* VERSE OF THE DAY BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-sky-50/30 border-b border-sky-100">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-sky-200 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-600 shrink-0 mt-0.5">
              <Flame className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Parole du Jour</span>
              <p className="text-sm sm:text-base font-serif italic text-slate-800 mt-0.5">
                « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »
              </p>
              <span className="text-xs font-semibold text-slate-500">— Psaumes 119:105</span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('bible')}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold border border-sky-200 transition-colors cursor-pointer"
          >
            <span>Méditer ce passage</span>
            <ChevronRight className="h-3.5 w-3.5 text-sky-500" />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* KEY FEATURES GRID */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Fonctionnalités Clés</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Tout pour nourrir votre foi et fortifier l’Église
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Inspiré de l’excellence d’EMCI TV Bible, enrichi pour la vie communautaire et l’éducation biblique des enfants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Bible & EMCI TV Tools */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Bible d’Étude & Outils EMCI
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Texte intégral des 66 livres en français avec comparateur multi-traductions (Louis Segond 1910, Segond 21, BDS, Darby, Martin, KJV).
                Recherche par mot-clé, notes, surlignage 5 teintes et cartes de partage.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Concordance Strong Hébreu & Grec</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Synthèse vocale audio pour écouter chaque chapitre</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Plan de lecture « La Bible en 1 an »</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigateTab('bible')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs border border-sky-200 transition-colors cursor-pointer"
              >
                <span>Accéder au lecteur biblique</span>
                <ChevronRight className="h-4 w-4 text-sky-500" />
              </button>
            </div>
          </div>

          {/* Card 2: AI Gemini for Kids Stories */}
          <div className="p-6 rounded-3xl bg-white border-2 border-sky-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-4 right-4">
              <span className="px-2.5 py-1 rounded-full bg-sky-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Gemini AI
              </span>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Baby className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Histoires Enfants & IA Gemini
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Générez des histoires bibliques sur-mesure pour vos enfants selon vos thèmes, héros ou enseignements moraux.
                Ajoutez vos propres récits ou supprimez-les en toute liberté (CRUD).
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Génération intelligente via Google Gemini</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Scènes sonorisées & quiz avec récompenses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Versets à mémoriser & courtes prières d’enfants</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigateTab('kids')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-sky-100" />
                <span>Créer une histoire avec Gemini</span>
                <ChevronRight className="h-4 w-4 text-sky-100" />
              </button>
            </div>
          </div>

          {/* Card 3: Discipleship Families (CRUD) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Familles de Disciples (CRUD)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Créez et gérez vos cellules de maison, ajoutez des membres avec leur rôle, suivez leurs objectifs journaliers,
                hebdomadaires et mensuels avec barres de progression individuelles.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Gestion complète (Créer, Modifier, Supprimer)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Évaluation spirituelle avec mentor IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Génération de fiches et rapports imprimables</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigateTab('groups')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs border border-sky-200 transition-colors cursor-pointer"
              >
                <span>Gérer les familles de disciples</span>
                <ChevronRight className="h-4 w-4 text-sky-500" />
              </button>
            </div>
          </div>

          {/* Card 4: Spiritual Library (CRUD) */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Library className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Bibliothèque Spirituelle (CRUD)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ajoutez manuellement ou importez vos livres chrétiens, traités et manuels de formation.
                Une liseuse intégrée offre réglage de police, mode jour/nuit et signets.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Importation rapide de fichiers texte & documents</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Catégorisation (Discipulat, Prière, Théologie)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Mode lecture immersif et sans distraction</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => onNavigateTab('library')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs border border-sky-200 transition-colors cursor-pointer"
              >
                <span>Accéder à la bibliothèque</span>
                <ChevronRight className="h-4 w-4 text-sky-500" />
              </button>
            </div>
          </div>

          {/* Card 5: Strong Lexicon & Hebrew/Greek */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Languages className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Lexique & Concordance Strong
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Découvrez la richesse originelle des textes bibliques avec les racines hébraïques de l’Ancien Testament
                et grecques du Nouveau Testament avec définition exhaustive et prononciation vocale.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Codes Strong directement reliés aux versets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Translittération phonétique & audio vocal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Occurrences dans l’ensemble des Écritures</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={onOpenStrongLexicon}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs border border-sky-200 transition-colors cursor-pointer"
              >
                <span>Consulter le lexique Strong</span>
                <ChevronRight className="h-4 w-4 text-sky-500" />
              </button>
            </div>
          </div>

          {/* Card 6: Reading Plan in 1 Year */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                Plan « La Bible en 1 An »
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Suivez le plan officiel de lecture quotidienne avec portions équilibrées :
                un passage de l’Ancien Testament, un passage du Nouveau Testament et un Psaume ou Proverbe.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Cases à cocher synchronisées</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Saut direct au texte du jour en 1 clic</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0" />
                  <span>Calcul automatique de la régularité</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={onOpenReadingPlan}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs border border-sky-200 transition-colors cursor-pointer"
              >
                <span>Ouvrir le plan de lecture</span>
                <ChevronRight className="h-4 w-4 text-sky-500" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* GEMINI AI INTERACTIVE TEASER SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-500 to-sky-600 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              <span>Intelligence Artificielle Gemini Intégrée</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Une histoire biblique pour vos enfants en 10 secondes
            </h2>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Demandez à Gemini de raconter le courage de David, la sagesse de Salomon,
              l’obéissance de Noé ou toute requête de votre choix. L’IA génère l’histoire,
              les dialogues vivants, la morale, un quiz amusant et une prière adaptée !
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col items-center gap-3">
            <button
              onClick={() => onNavigateTab('kids')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white hover:bg-sky-50 text-sky-600 font-bold text-base shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-sky-500" />
              <span>Essayer le Générateur Gemini</span>
              <ArrowRight className="h-5 w-5 text-sky-500" />
            </button>
            <span className="text-xs text-sky-200 font-medium">100% gratuit • Scènes sonorisées & Quiz interactifs</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* TESTIMONIAL / VALUES BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex p-3 rounded-2xl bg-sky-50 text-sky-500">
          <Heart className="h-8 w-8 text-sky-500" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
          « Ils reçurent la parole avec beaucoup d’empressement, et ils examinaient chaque jour les Écritures. »
        </h3>
        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
          Actes des Apôtres 17:11 (Les Juifs de Bérée)
        </p>

        <div className="pt-6 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigateTab('bible')}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
          >
            Commencer la lecture maintenant
          </button>
          {isGuest && (
            <button
              onClick={onOpenAuth}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors cursor-pointer"
            >
              Créer mon compte disciple
            </button>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="py-8 px-4 border-t border-sky-100 bg-slate-50 text-center text-xs text-slate-500 space-y-2">
        <p className="font-medium text-slate-700">
          BÉRÉENS • Plateforme Biblique, Discipulat & Éducation Spirituelle (Inspiré d’EMCI TV)
        </p>
        <p>
          Traductions bibliques : Louis Segond 1910 (domaine public), Segond 21, BDS, Darby, Martin, KJV. Lexique Strong Hébreu / Grec.
        </p>
      </footer>
    </div>
  );
};
