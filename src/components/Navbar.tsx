import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Users,
  Sparkles,
  Baby,
  Library,
  BarChart3,
  Search,
  User,
  RefreshCw,
  Calendar,
  Languages,
  LogIn,
  Home,
  CheckCircle2,
  ChevronDown,
  X,
  ArrowRight,
  Menu,
  SlidersHorizontal,
  Compass,
  Bot,
} from 'lucide-react';
import { UserProfile } from '../types';

export type ActiveTab = 'landing' | 'bible' | 'chat' | 'groups' | 'stories' | 'kids' | 'library' | 'analytics';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  onOpenReadingPlan?: () => void;
  onOpenStrongLexicon?: () => void;
  userProfile: UserProfile;
  isSyncing: boolean;
  onQuickSync: () => void;
}

interface FeatureItem {
  id: string;
  tab?: ActiveTab;
  action?: () => void;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  category: 'bible' | 'kids' | 'community' | 'tools';
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSearch,
  onOpenAuth,
  onOpenReadingPlan,
  onOpenStrongLexicon,
  userProfile,
  isSyncing,
  onQuickSync,
}) => {
  const isGuest = userProfile?.id === 'guest';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuFilter, setMenuFilter] = useState<'all' | 'bible' | 'kids' | 'community' | 'tools'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close menu on Escape or click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  // Complete list of all features
  const allFeatures: FeatureItem[] = [
    {
      id: 'landing',
      tab: 'landing',
      title: "Page d'Accueil",
      subtitle: 'Présentation complète de la plateforme, vision spirituelle, guides et accès direct à tous les modules.',
      icon: Home,
      badge: 'Accueil',
      badgeColor: 'bg-slate-100 text-slate-700',
      category: 'tools',
    },
    {
      id: 'chat',
      tab: 'chat',
      title: 'Bible AI — Assistant Intelligent (RAG)',
      subtitle: 'Posez toutes vos questions bibliques, exégèse de versets, dictionnaire Strong, biographies et études guidées par Gemini et RAG.',
      icon: Bot,
      badge: 'Gemini RAG',
      badgeColor: 'bg-sky-100 text-sky-800',
      category: 'bible',
    },
    {
      id: 'bible',
      tab: 'bible',
      title: "Bible d'Étude Intégrale (66 Livres)",
      subtitle: 'Ancien et Nouveau Testament, 5 traductions comparées (LSG, BDS, S21, Martin, Darby), surlignage, notes et mode audio.',
      icon: BookOpen,
      badge: '66 Livres',
      badgeColor: 'bg-sky-100 text-sky-700',
      category: 'bible',
    },
    {
      id: 'kids',
      tab: 'kids',
      title: 'Espace Enfants & IA Gemini',
      subtitle: "Histoires bibliques illustrées, narration vocale, quiz interactifs avec récompenses et générateur d'histoires IA sur-mesure.",
      icon: Baby,
      badge: 'IA Gemini',
      badgeColor: 'bg-cyan-100 text-cyan-700',
      category: 'kids',
    },
    {
      id: 'groups',
      tab: 'groups',
      title: 'Familles de Disciples (CRUD)',
      subtitle: 'Gestion des cellules de maison, ajout et suivi des disciples, objectifs spirituels hebdomadaires et points de fidélité.',
      icon: Users,
      badge: 'Gestion CRUD',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      category: 'community',
    },
    {
      id: 'library',
      tab: 'library',
      title: 'Bibliothèque Spirituelle (CRUD)',
      subtitle: "Gestion de livres chrétiens, traités d'édification, manuels pastoraux et ressources téléchargeables pour grandir dans la foi.",
      icon: Library,
      badge: 'Livres & PDF',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      category: 'community',
    },
    {
      id: 'stories',
      tab: 'stories',
      title: 'Récits Bibliques & Quiz',
      subtitle: 'Les récits fondateurs de la foi racontés avec soin, mode audio et validation des acquis par quiz interactif.',
      icon: Sparkles,
      badge: 'Interactif',
      badgeColor: 'bg-amber-100 text-amber-700',
      category: 'community',
    },
    {
      id: 'reading-plan',
      action: onOpenReadingPlan,
      title: 'Plan de Lecture en 1 An',
      subtitle: 'Programme quotidien équilibré inspiré d’EMCI TV : Ancien Testament, Nouveau Testament et Psaumes pour lire toute la Bible.',
      icon: Calendar,
      badge: 'EMCI TV',
      badgeColor: 'bg-rose-100 text-rose-700',
      category: 'bible',
    },
    {
      id: 'strong-lexicon',
      action: onOpenStrongLexicon,
      title: 'Lexique & Concordance Strong',
      subtitle: 'Racines hébraïques et grecques, translittérations, définitions théologiques originales et fréquences d’usage biblique.',
      icon: Languages,
      badge: 'Hébreu & Grec',
      badgeColor: 'bg-purple-100 text-purple-700',
      category: 'bible',
    },
    {
      id: 'ai-search',
      action: onOpenSearch,
      title: 'Recherche Biblique par IA (⌘K)',
      subtitle: 'Interrogez les Saintes Écritures par thème de vie, problème personnel ou mot-clé avec synthèse immédiate par Gemini.',
      icon: Search,
      badge: 'Sémantique',
      badgeColor: 'bg-sky-100 text-sky-700',
      category: 'tools',
    },
    {
      id: 'analytics',
      tab: 'analytics',
      title: 'Tableau de Bord & Statistiques',
      subtitle: 'Suivi de votre régularité dans la Parole, série de jours consécutifs (streak), temps de lecture et engagement.',
      icon: BarChart3,
      badge: 'Indicateurs',
      badgeColor: 'bg-teal-100 text-teal-700',
      category: 'tools',
    },
  ];

  const filteredFeatures = allFeatures.filter((item) => {
    const matchesCategory = menuFilter === 'all' || item.category === menuFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectFeature = (item: FeatureItem) => {
    setIsMenuOpen(false);
    if (item.tab) {
      setActiveTab(item.tab);
    } else if (item.action) {
      item.action();
    }
  };

  const getActiveTabLabel = (tab: ActiveTab): string => {
    switch (tab) {
      case 'landing':
        return 'Accueil';
      case 'chat':
        return 'Bible AI';
      case 'bible':
        return 'Bible (66 Livres)';
      case 'kids':
        return 'Enfants & IA';
      case 'groups':
        return 'Familles de Disciples';
      case 'library':
        return 'Bibliothèque';
      case 'stories':
        return 'Récits & Quiz';
      case 'analytics':
        return 'Statistiques';
      default:
        return 'Navigation';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sky-100 bg-white/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo + CURRENT TAB BADGE + DEDICATED NAVIGATION MENU BUTTON */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveTab('landing')}
            className="group flex items-center gap-2.5 text-left focus-visible:outline-none cursor-pointer"
            title="Retour à l'accueil"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl font-bold tracking-wider text-slate-900 group-hover:text-sky-600 transition-colors">
                BÉRÉENS
              </span>
              <span className="text-[9px] uppercase tracking-widest text-sky-600 font-semibold -mt-1 hidden sm:block">
                Bible & Discipulat
              </span>
            </div>
          </button>

          {/* Current Page Pill (shows user where they are) */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs font-medium text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
            <span className="truncate max-w-[140px] font-semibold text-slate-700">
              {getActiveTabLabel(activeTab)}
            </span>
          </div>

          {/* MAIN NAVIGATION MENU BUTTON (CLICK TO DISPLAY ALL FEATURES) */}
          <div className="relative">
            <button
              ref={triggerRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold text-xs sm:text-sm border transition-all cursor-pointer shadow-xs ${
                isMenuOpen
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/30 ring-2 ring-sky-300'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200 hover:border-sky-300'
              }`}
              aria-expanded={isMenuOpen}
              aria-label="Menu de navigation - Afficher les fonctionnalités"
            >
              <Menu className={`h-4 w-4 ${isMenuOpen ? 'text-white' : 'text-sky-600'}`} />
              <span className="font-bold tracking-wide">Menu de Navigation</span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-md bg-white/30 text-[10px] font-mono">
                {allFeatures.length}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180 text-white' : 'text-sky-600'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Center: Quick direct actions for convenience */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-sky-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bot className={`h-3.5 w-3.5 ${activeTab === 'chat' ? 'text-white' : 'text-sky-500'}`} />
            <span>Bible AI</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'chat' ? 'bg-sky-400 text-white' : 'bg-sky-100 text-sky-700'
            }`}>
              RAG
            </span>
          </button>

          <button
            onClick={() => setActiveTab('bible')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'bible'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-sky-500" />
            <span>Lire la Bible</span>
          </button>

          <button
            onClick={() => setActiveTab('kids')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'kids'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Baby className="h-3.5 w-3.5 text-sky-500" />
            <span>Enfants IA</span>
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'groups'
                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="h-3.5 w-3.5 text-sky-500" />
            <span>Familles</span>
          </button>
        </div>

        {/* Right Side: Quick Tools & Auth Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* AI Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-sky-50 hover:text-sky-700 rounded-xl border border-slate-200 hover:border-sky-200 transition-colors cursor-pointer"
            title="Recherche biblique sémantique par IA (⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-sky-500" />
            <span className="hidden sm:inline">Recherche IA</span>
            <kbd className="hidden md:inline text-[10px] bg-white px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Cloud Sync Button */}
          <button
            onClick={onQuickSync}
            disabled={isSyncing}
            className="p-2 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors relative cursor-pointer border border-transparent hover:border-sky-100"
            title="Synchronisation Cloud en temps réel"
          >
            <RefreshCw className={`h-4 w-4 text-sky-500 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>

          {/* User Button: Sign In / Profile */}
          {isGuest ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md hover:shadow-sky-500/20 transition-all cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5 text-sky-100" />
              <span>Connexion</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-slate-800 rounded-xl text-xs font-medium border border-sky-200 shadow-xs transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                {userProfile.firstName.charAt(0)}
              </div>
              <span className="hidden sm:inline truncate max-w-[100px] font-semibold text-slate-800">
                {userProfile.firstName}
              </span>
              <span className="bg-white text-sky-700 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold border border-sky-100">
                {userProfile.points} pts
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THE NAVIGATION MENU: INTERACTIVE FULL FEATURES MODAL / DRAWER   */}
      {/* ------------------------------------------------------------- */}
      {isMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs -z-10"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Drawer Container */}
          <div
            ref={menuRef}
            className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8 pt-3 pb-8 max-h-[calc(100vh-4.5rem)] overflow-y-auto"
          >
            <div className="bg-white rounded-3xl border border-sky-200 shadow-2xl p-5 sm:p-7 space-y-6">
              {/* Menu Top Bar: Title, Search inside menu & Close button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-md shadow-sky-500/20">
                    <Compass className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>Menu de Navigation</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-medium">
                        Toutes les fonctionnalités
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sélectionnez un module biblique, communautaire, éducatif ou d'étude approfondie.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
                  {/* Search within features */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filtrer les fonctionnalités..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Fermer le menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="h-3 w-3" /> Catégories :
                </span>
                {[
                  { key: 'all', label: 'Toutes les fonctionnalités' },
                  { key: 'bible', label: 'Bible & Étude' },
                  { key: 'kids', label: 'Enfants & IA' },
                  { key: 'community', label: 'Communauté & Discipulat' },
                  { key: 'tools', label: 'Outils & Vue d’ensemble' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setMenuFilter(cat.key as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      menuFilter === cat.key
                        ? 'bg-sky-500 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-sky-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid of Interactive Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredFeatures.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.tab && activeTab === item.tab;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectFeature(item)}
                      className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${
                        isActive
                          ? 'bg-sky-50/80 border-sky-400 shadow-md ring-2 ring-sky-400/20'
                          : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/30 hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Top Icon & Badge Row */}
                        <div className="flex items-center justify-between mb-3">
                          <div
                            className={`p-2.5 rounded-xl transition-colors ${
                              isActive
                                ? 'bg-sky-500 text-white shadow-xs'
                                : 'bg-slate-50 text-sky-600 border border-slate-200 group-hover:bg-sky-100 group-hover:border-sky-300'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex items-center gap-1.5">
                            {item.badge && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.badgeColor || 'bg-sky-100 text-sky-700'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {isActive && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-bold">
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Actuel</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Title & Subtitle */}
                        <h4
                          className={`text-sm font-bold transition-colors ${
                            isActive ? 'text-sky-950 font-extrabold' : 'text-slate-900 group-hover:text-sky-700'
                          }`}
                        >
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1 line-clamp-2">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Bottom Direct CTA Link */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                        <span>Ouvrir cette fonctionnalité</span>
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredFeatures.length === 0 && (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <p className="font-semibold text-sm">Aucune fonctionnalité ne correspond à votre recherche.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setMenuFilter('all');
                    }}
                    className="text-xs text-sky-600 hover:underline font-bold"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}

              {/* Menu Quick Footer Bar */}
              <div className="pt-3 border-t border-sky-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-700">Accès directs :</span>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveTab('landing');
                    }}
                    className="hover:text-sky-600 underline font-medium cursor-pointer"
                  >
                    Accueil
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setActiveTab('bible');
                    }}
                    className="hover:text-sky-600 underline font-medium cursor-pointer"
                  >
                    Lecteur Biblique
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSearch();
                    }}
                    className="hover:text-sky-600 underline font-medium cursor-pointer"
                  >
                    Recherche Sémantique (⌘K)
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="hover:text-sky-600 underline font-medium cursor-pointer"
                  >
                    {isGuest ? 'Connexion' : 'Profil & Sécurité'}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Appuyez sur <kbd className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Échap</kbd> pour fermer
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
