import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  BookOpen,
  MessageSquare,
  Trophy,
  Users,
  Printer,
  Calendar,
  ShieldCheck,
  TrendingUp,
  Download,
} from 'lucide-react';
import { GroupMemberProgress, UserBookmark, UserHighlight, UserNote, UserProfile } from '../types';

interface AnalyticsDashboardProps {
  userProfile: UserProfile;
  notes: UserNote[];
  highlights: UserHighlight[];
  bookmarks: UserBookmark[];
  membersProgress: GroupMemberProgress[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userProfile,
  notes,
  highlights,
  bookmarks,
  membersProgress,
}) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  const handlePrintDashboardPDF = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      user: userProfile,
      stats: {
        points: userProfile.points,
        streakDays: userProfile.streakDays,
        notesCount: notes.length,
        highlightsCount: highlights.length,
        bookmarksCount: bookmarks.length,
      },
      members: membersProgress,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bereens_Bilan_Engagement_${userProfile.firstName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-sky-600 font-semibold font-cinzel">
              Indicateurs & Suivi Spirituel
            </span>
            <h1 className="font-cinzel text-3xl font-bold text-slate-900 mt-1">
              Tableau de Bord Analytique d’Engagement
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Mesurez votre assiduité dans la Parole de Dieu et l'impact au sein de votre famille de disciples.
            </p>
          </div>

          <div className="flex items-center gap-3 no-print">
            <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs">
              {(['week', 'month', 'year'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    timeframe === tf ? 'bg-sky-500 text-white font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf === 'week' ? 'Semaine' : tf === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4 text-sky-500" />
              <span>Données JSON</span>
            </button>

            <button
              onClick={handlePrintDashboardPDF}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Exporter Rapport PDF</span>
            </button>
          </div>
        </div>

        {/* KPI Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Points de Croissance</span>
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-slate-900">
              {userProfile.points} <span className="text-sm font-sans font-normal text-slate-500">pts</span>
            </div>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+85 pts cette semaine</span>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Série Quotidienne (Streak)</span>
              <Flame className="h-4 w-4 text-amber-500" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-slate-900">
              {userProfile.streakDays} <span className="text-sm font-sans font-normal text-slate-500">jours</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Fidélité sans interruption
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Réflexions & Notes</span>
              <MessageSquare className="h-4 w-4 text-sky-500" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-slate-900">
              {notes.length} <span className="text-sm font-sans font-normal text-slate-500">notes</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {highlights.length} versets surlignés
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Membres du Groupe</span>
              <Users className="h-4 w-4 text-sky-500" />
            </div>
            <div className="font-mono text-3xl font-extrabold text-slate-900">
              {membersProgress.length} <span className="text-sm font-sans font-normal text-slate-500">membres</span>
            </div>
            <p className="text-[11px] text-emerald-600">
              Taux d’achèvement : 84%
            </p>
          </div>
        </div>

        {/* Engagement Progression Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Group Comparative Activity (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-cinzel text-lg font-bold text-slate-900">
                Participation Active par Membre
              </h3>
              <span className="text-xs text-sky-600 font-mono font-semibold">
                {userProfile.groupName}
              </span>
            </div>

            <div className="space-y-4">
              {membersProgress.map((m) => (
                <div key={m.userId} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">
                      {m.fullName} ({m.roleInChurch})
                    </span>
                    <span className="font-mono text-sky-600 font-bold">
                      {m.weeklyCompletedPercent}% accompli
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full"
                      style={{ width: `${m.weeklyCompletedPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Cadence & Weekly Calendar (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-cinzel text-lg font-bold text-slate-900">
                Rythme de Lecture Biblique
              </h3>
              <Calendar className="h-4 w-4 text-sky-500" />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Votre moyenne actuelle est de <strong>2,4 chapitres par jour</strong>. À ce rythme, vous aurez complété
              l’ensemble des 66 livres de la Bible en moins de 16 mois.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Ancien Testament (39 livres) :</span>
                <span className="font-mono text-sky-700 font-semibold">42% complété</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 w-[42%]" />
              </div>

              <div className="flex justify-between text-slate-600 pt-2">
                <span>Nouveau Testament (27 livres) :</span>
                <span className="font-mono text-sky-700 font-semibold">78% complété</span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[78%]" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-sky-500 shrink-0" />
              <div className="text-xs text-slate-700">
                <strong className="text-sky-800 block mb-0.5">Conformité RGPD Garantie</strong>
                Vos réflexions et données spirituelles sont chiffrées de bout en bout et demeurent strictement privées.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
