import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Circle, BookOpen, ArrowRight } from 'lucide-react';
import { ReadingPlanDay } from '../types';
import { StorageService } from '../services/storage';

interface ReadingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage: (passage: string) => void;
}

export const ReadingPlanModal: React.FC<ReadingPlanModalProps> = ({
  isOpen,
  onClose,
  onSelectPassage,
}) => {
  const [readingPlan, setReadingPlan] = useState<ReadingPlanDay[]>(() =>
    StorageService.getReadingPlan()
  );

  if (!isOpen) return null;

  const handleToggle = (dayNum: number, section: 'at' | 'nt' | 'psaume') => {
    const updated = StorageService.toggleReadingSection(dayNum, section);
    setReadingPlan([...updated]);
  };

  const totalReadings = readingPlan.length * 3;
  const completedCount = readingPlan.reduce(
    (acc, d) => acc + (d.completedAt ? 1 : 0) + (d.completedNt ? 1 : 0) + (d.completedPsaume ? 1 : 0),
    0
  );
  const progressPercent = Math.round((completedCount / totalReadings) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-5 w-5 text-sky-500" />
            <div>
              <h3 className="font-cinzel text-base font-bold text-slate-900">
                Plan de Lecture : La Bible en 1 An (EMCI TV)
              </h3>
              <p className="text-[11px] text-slate-500">
                Une portion quotidienne équilibrée : Ancien Testament, Nouveau Testament & Psaumes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="px-6 py-4 bg-white border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">Progression globale du plan annuel :</span>
            <span className="font-mono text-sky-600 font-bold">{progressPercent}% accompli</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Days List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {readingPlan.map((day) => (
            <div
              key={day.day}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold text-slate-900 uppercase tracking-wide">
                  {day.title}
                </span>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  {day.completedAt && day.completedNt && day.completedPsaume
                    ? '✓ Complété'
                    : 'En cours'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* AT */}
                <div
                  onClick={() => handleToggle(day.day, 'at')}
                  className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                    day.completedAt
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/30'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-500 block">Ancien Testament</span>
                    <strong className="truncate">{day.atPassage}</strong>
                  </div>
                  {day.completedAt ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                  )}
                </div>

                {/* NT */}
                <div
                  onClick={() => handleToggle(day.day, 'nt')}
                  className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                    day.completedNt
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/30'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-500 block">Nouveau Testament</span>
                    <strong className="truncate">{day.ntPassage}</strong>
                  </div>
                  {day.completedNt ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                  )}
                </div>

                {/* Psaume */}
                <div
                  onClick={() => handleToggle(day.day, 'psaume')}
                  className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                    day.completedPsaume
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50/30'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="text-[10px] text-slate-500 block">Psaumes / Sagesse</span>
                    <strong className="truncate">{day.psaumePassage}</strong>
                  </div>
                  {day.completedPsaume ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
