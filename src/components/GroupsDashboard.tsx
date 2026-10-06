import React, { useState } from 'react';
import {
  Users,
  Target,
  Sparkles,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  Plus,
  Edit3,
  Save,
  Trophy,
  Flame,
  Award,
  ChevronRight,
  TrendingUp,
  Trash2,
  UserPlus,
  Shield,
  Clock,
  Printer,
  X,
  UserCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DiscipleshipGroup, GroupMemberProgress, UserProfile } from '../types';
import { AISpiritualGrowthResult, AIService } from '../services/aiService';

interface GroupsDashboardProps {
  groups: DiscipleshipGroup[];
  membersProgress: GroupMemberProgress[];
  userProfile: UserProfile;
  onUpdateObjectives: (
    groupId: string,
    objectives: { dailyObjective: string; weeklyObjective: string; monthlyObjective: string }
  ) => void;
  onCreateGroup: (newGroup: Omit<DiscipleshipGroup, 'id'>) => void;
  onUpdateGroup: (id: string, updatedFields: Partial<DiscipleshipGroup>) => void;
  onDeleteGroup: (id: string) => void;
  onAddMember: (member: GroupMemberProgress) => void;
  onUpdateMember: (userId: string, updatedFields: Partial<GroupMemberProgress>) => void;
  onDeleteMember: (userId: string) => void;
  onUpdateUserPoints: (newPoints: number) => void;
}

export const GroupsDashboard: React.FC<GroupsDashboardProps> = ({
  groups,
  membersProgress,
  userProfile,
  onUpdateObjectives,
  onCreateGroup,
  onUpdateGroup,
  onDeleteGroup,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onUpdateUserPoints,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');

  // Modals state
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [editingGroup, setEditingGroup] = useState<DiscipleshipGroup | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMember, setEditingMember] = useState<GroupMemberProgress | null>(null);
  const [isEditingObjectives, setIsEditingObjectives] = useState(false);

  // Group Form state
  const [groupName, setGroupName] = useState('');
  const [groupLeader, setGroupLeader] = useState(userProfile.firstName + ' ' + userProfile.lastName);
  const [groupEmail, setGroupEmail] = useState(userProfile.email);
  const [groupDesc, setGroupDesc] = useState('');
  const [groupMeeting, setGroupMeeting] = useState('Mercredi 19h30');
  const [groupDailyObj, setGroupDailyObj] = useState('Lire 2 chapitres bibliques');
  const [groupWeeklyObj, setGroupWeeklyObj] = useState('Méditer 1 livre & réunion de prière');
  const [groupMonthlyObj, setGroupMonthlyObj] = useState('Valider 1 plan de lecture & 1 évangélisation');

  // Member Form state (All requested fields)
  const [memberLastName, setMemberLastName] = useState('');
  const [memberFirstName, setMemberFirstName] = useState('');
  const [memberRoleInChurch, setMemberRoleInChurch] = useState('Disciple');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberDailyPercent, setMemberDailyPercent] = useState(50);
  const [memberWeeklyPercent, setMemberWeeklyPercent] = useState(60);
  const [memberMonthlyPercent, setMemberMonthlyPercent] = useState(40);
  const [memberPoints, setMemberPoints] = useState(100);

  // AI points evaluation state
  const [isEvaluatingAI, setIsEvaluatingAI] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<AISpiritualGrowthResult | null>(null);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0] || null;

  // Filter members belonging to current selected group or all members
  const currentGroupMembers = selectedGroup
    ? membersProgress.filter(
        (m) =>
          !selectedGroup.name ||
          m.roleInChurch.includes(selectedGroup.name) ||
          true // Display members with active tracking
      )
    : membersProgress;

  // Objectives edit state
  const [dailyObjInput, setDailyObjInput] = useState(selectedGroup?.dailyObjective || '');
  const [weeklyObjInput, setWeeklyObjInput] = useState(selectedGroup?.weeklyObjective || '');
  const [monthlyObjInput, setMonthlyObjInput] = useState(selectedGroup?.monthlyObjective || '');

  const openCreateGroupModal = () => {
    setGroupName('');
    setGroupLeader(`${userProfile.firstName} ${userProfile.lastName}`.trim() || 'Leader Disciple');
    setGroupEmail(userProfile.email || '');
    setGroupDesc('');
    setGroupMeeting('Chaque Jeudi 19h30 (Culte de maison)');
    setGroupDailyObj('Lire 2 chapitres et prier 20 min');
    setGroupWeeklyObj('Participer au groupe de maison & méditer 1 épître');
    setGroupMonthlyObj('Finir un livre biblique complet');
    setEditingGroup(null);
    setIsCreatingGroup(true);
  };

  const openEditGroupModal = (group: DiscipleshipGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGroup(group);
    setGroupName(group.name);
    setGroupLeader(group.leaderName);
    setGroupEmail(group.leaderEmail);
    setGroupDesc(group.description);
    setGroupMeeting(group.meetingDay);
    setGroupDailyObj(group.dailyObjective);
    setGroupWeeklyObj(group.weeklyObjective);
    setGroupMonthlyObj(group.monthlyObjective);
    setIsCreatingGroup(true);
  };

  const handleSaveGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    if (editingGroup) {
      onUpdateGroup(editingGroup.id, {
        name: groupName,
        leaderName: groupLeader,
        leaderEmail: groupEmail,
        description: groupDesc,
        meetingDay: groupMeeting,
        dailyObjective: groupDailyObj,
        weeklyObjective: groupWeeklyObj,
        monthlyObjective: groupMonthlyObj,
      });
    } else {
      onCreateGroup({
        name: groupName,
        leaderName: groupLeader,
        leaderEmail: groupEmail,
        description: groupDesc || 'Famille de disciples dédiée à la prière et la sanctification.',
        meetingDay: groupMeeting,
        membersCount: 1,
        dailyObjective: groupDailyObj,
        weeklyObjective: groupWeeklyObj,
        monthlyObjective: groupMonthlyObj,
      });
    }

    setIsCreatingGroup(false);
  };

  const handleDeleteGroupClick = (group: DiscipleshipGroup, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Voulez-vous vraiment supprimer la famille "${group.name}" ?`)) {
      onDeleteGroup(group.id);
      if (selectedGroupId === group.id) {
        setSelectedGroupId('');
      }
    }
  };

  // Member CRUD actions
  const openAddMemberModal = () => {
    setMemberLastName('');
    setMemberFirstName('');
    setMemberRoleInChurch('Disciple');
    setMemberPhone('');
    setMemberEmail('');
    setMemberDailyPercent(30);
    setMemberWeeklyPercent(50);
    setMemberMonthlyPercent(25);
    setMemberPoints(50);
    setEditingMember(null);
    setIsAddingMember(true);
  };

  const openEditMemberModal = (member: GroupMemberProgress) => {
    setEditingMember(member);
    const names = member.fullName.split(' ');
    setMemberFirstName(names[0] || '');
    setMemberLastName(names.slice(1).join(' ') || '');
    setMemberRoleInChurch(member.roleInChurch);
    setMemberPhone(member.phone);
    setMemberDailyPercent(member.dailyCompletedPercent);
    setMemberWeeklyPercent(member.weeklyCompletedPercent);
    setMemberMonthlyPercent(member.monthlyCompletedPercent);
    setMemberPoints(member.points);
    setIsAddingMember(true);
  };

  const handleSaveMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${memberFirstName.trim()} ${memberLastName.trim()}`.trim();
    if (!fullName) return;

    if (editingMember) {
      onUpdateMember(editingMember.userId, {
        fullName,
        roleInChurch: memberRoleInChurch,
        phone: memberPhone,
        dailyCompletedPercent: memberDailyPercent,
        weeklyCompletedPercent: memberWeeklyPercent,
        monthlyCompletedPercent: memberMonthlyPercent,
        points: memberPoints,
        lastActive: 'Modifié à l’instant',
      });
    } else {
      const newMember: GroupMemberProgress = {
        userId: 'mbr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        fullName,
        roleInChurch: memberRoleInChurch,
        phone: memberPhone,
        avatarSeed: memberFirstName || 'Disciple',
        dailyCompletedPercent: memberDailyPercent,
        weeklyCompletedPercent: memberWeeklyPercent,
        monthlyCompletedPercent: memberMonthlyPercent,
        chaptersReadThisWeek: 3,
        quizzesPassed: 1,
        points: memberPoints,
        lastActive: 'Inscrit à l’instant',
      };
      onAddMember(newMember);
    }

    setIsAddingMember(false);
  };

  const handleDeleteMemberClick = (userId: string, name: string) => {
    if (window.confirm(`Supprimer le membre ${name} de cette famille ?`)) {
      onDeleteMember(userId);
    }
  };

  const handleTriggerAIEvaluation = async () => {
    setIsEvaluatingAI(true);
    const result = await AIService.evaluateSpiritualGrowth(
      {
        chaptersRead: 14,
        quizzesCompleted: 6,
        notesCount: 8,
        daysStreak: userProfile.streakDays,
        prayerMinutes: 45,
      },
      `${userProfile.firstName} ${userProfile.lastName}`,
      selectedGroup?.name || 'Famille de Disciples'
    );

    setAiEvaluation(result);
    onUpdateUserPoints(result.totalPoints);
    setIsEvaluatingAI(false);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B35', '#F59E0B', '#10B981', '#3B82F6'],
    });
  };

  const handlePrintGroupReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-sky-100">
          <div>
            <span className="text-xs uppercase tracking-widest text-sky-600 font-semibold font-cinzel">
              Gestion Multi-Groupes & Suivi des Disciples (CRUD)
            </span>
            <h1 className="font-cinzel text-3xl font-bold text-slate-900 mt-1">
              Familles de Disciples
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Objectifs journaliers, hebdomadaires et mensuels avec barres de progression individuelles.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerAIEvaluation}
              disabled={isEvaluatingAI}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-sky-100" />
              <span>{isEvaluatingAI ? 'Calcul IA en cours...' : 'Calculer mes points IA'}</span>
            </button>

            <button
              onClick={openCreateGroupModal}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-xl border border-sky-200 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4 text-sky-500" />
              <span>Nouvelle Famille</span>
            </button>

            <button
              onClick={handlePrintGroupReport}
              className="p-2.5 text-slate-600 hover:text-sky-600 bg-slate-50 hover:bg-sky-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
              title="Imprimer / Exporter le rapport du groupe"
            >
              <Printer className="h-4 w-4 text-sky-500" />
            </button>
          </div>
        </div>

        {/* AI Spiritual Evaluation Card (if active) */}
        {aiEvaluation && (
          <div className="p-6 rounded-2xl bg-sky-50/70 border border-sky-200 shadow-sm space-y-4 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 border border-sky-200">
                  <Award className="h-6 w-6 text-sky-500" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">
                    Évaluation IA de Croissance Spirituelle
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900">
                    Palier Spirituel : {aiEvaluation.growthTier}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-sky-600">
                    +{aiEvaluation.totalPoints} pts
                  </div>
                  <div className="text-[10px] text-slate-500">Points calculés par l’IA</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-700 italic bg-white p-3.5 rounded-xl border border-sky-100 shadow-xs">
              « {aiEvaluation.evaluation} »
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 1: FAMILIES (GROUPS) CARDS & SELECTOR            */}
        {/* ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-cinzel flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-500" />
              <span>Vos Familles de Disciples ({groups.length})</span>
            </h2>
          </div>

          {groups.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <Users className="h-6 w-6 text-sky-500" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold text-slate-900">
                  Aucune famille de disciples créée pour l’instant
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Créez votre première famille de disciples pour assigner des objectifs journaliers, hebdomadaires et mensuels à vos membres.
                </p>
              </div>
              <button
                onClick={openCreateGroupModal}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4 text-sky-100" />
                <span>Créer ma première famille</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => {
                const isSelected = selectedGroup?.id === group.id;
                return (
                  <div
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all text-left flex flex-col justify-between space-y-4 ${
                      isSelected
                        ? 'bg-sky-50/70 border-sky-400 shadow-md ring-2 ring-sky-200'
                        : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-sky-50/20 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-cinzel text-base font-bold text-slate-900 flex items-center gap-2">
                          <span>{group.name}</span>
                          {isSelected && (
                            <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-sky-500 text-white">
                              Actif
                            </span>
                          )}
                        </h3>

                        {/* Actions: Edit & Delete */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => openEditGroupModal(group, e)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Modifier la famille"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteGroupClick(group, e)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer la famille"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{group.description}</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Responsable :</span>
                        <span className="font-medium text-slate-800">{group.leaderName}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="text-slate-400">Rencontre :</span>
                        <span className="font-medium text-sky-600">{group.meetingDay}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* SECTION 2: OBJECTIVES & PROGRESS TRACKING FOR SELECTED    */}
        {/* ======================================================== */}
        {selectedGroup && (
          <div className="space-y-6">
            {/* Objectives Banner */}
            <div className="p-6 rounded-3xl bg-white border border-sky-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
                    <Target className="h-5 w-5 text-sky-500" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-slate-900">
                      Objectifs Spirituels : {selectedGroup.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Fixés par le responsable principal et les conducteurs de groupe
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingObjectives(!isEditingObjectives)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors self-start sm:self-auto cursor-pointer font-semibold"
                >
                  <Edit3 className="h-3.5 w-3.5 text-sky-500" />
                  <span>{isEditingObjectives ? 'Fermer' : 'Ajuster les Objectifs'}</span>
                </button>
              </div>

              {isEditingObjectives ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Objectif Journalier
                      </label>
                      <input
                        type="text"
                        value={dailyObjInput}
                        onChange={(e) => setDailyObjInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Objectif Hebdomadaire
                      </label>
                      <input
                        type="text"
                        value={weeklyObjInput}
                        onChange={(e) => setWeeklyObjInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Objectif Mensuel
                      </label>
                      <input
                        type="text"
                        value={monthlyObjInput}
                        onChange={(e) => setMonthlyObjInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        onUpdateObjectives(selectedGroup.id, {
                          dailyObjective: dailyObjInput,
                          weeklyObjective: weeklyObjInput,
                          monthlyObjective: monthlyObjInput,
                        });
                        setIsEditingObjectives(false);
                      }}
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
                    >
                      Enregistrer les nouveaux objectifs
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Journalier */}
                  <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-700">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-sky-500" />
                        <span>Journalier</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">
                      {selectedGroup.dailyObjective || 'Non défini'}
                    </p>
                  </div>

                  {/* Hebdomadaire */}
                  <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-700">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-sky-500" />
                        <span>Hebdomadaire</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">
                      {selectedGroup.weeklyObjective || 'Non défini'}
                    </p>
                  </div>

                  {/* Mensuel */}
                  <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-sky-700">
                      <span className="flex items-center gap-1.5">
                        <Trophy className="h-3.5 w-3.5 text-sky-500" />
                        <span>Mensuel</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">
                      {selectedGroup.monthlyObjective || 'Non défini'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* SECTION 3: MEMBERS CRUD & INDIVIDUAL PROGRESS BARS        */}
            {/* ======================================================== */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-slate-900 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-sky-500" />
                    <span>Membres & Barres de Progression Individuelles</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Suivi en temps réel de chaque disciple : taux de complétion journalier, hebdomadaire et mensuel.
                  </p>
                </div>

                <button
                  onClick={openAddMemberModal}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xl shadow transition-all self-start sm:self-auto cursor-pointer"
                >
                  <UserPlus className="h-4 w-4 text-sky-100" />
                  <span>Ajouter un Disciple</span>
                </button>
              </div>

              {currentGroupMembers.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <p className="text-xs text-slate-500">
                    Aucun membre enregistré dans cette famille. Cliquez sur « Ajouter un Disciple » pour inscrire un membre avec son nom, prénom, téléphone et poste à l'église.
                  </p>
                  <button
                    onClick={openAddMemberModal}
                    className="px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl text-xs font-semibold border border-sky-200 cursor-pointer"
                  >
                    + Inscrire un membre
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentGroupMembers.map((member) => (
                    <div
                      key={member.userId}
                      className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 transition-colors space-y-4 shadow-xs"
                    >
                      {/* Top: Member Info & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold font-cinzel shadow-xs">
                            {member.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{member.fullName}</h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                                {member.roleInChurch}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                              {member.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 text-sky-500" />
                                  <span>{member.phone}</span>
                                </span>
                              )}
                              <span>• {member.points} pts spirituels</span>
                              <span>• {member.lastActive}</span>
                            </div>
                          </div>
                        </div>

                        {/* Edit & Delete Buttons */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            onClick={() => openEditMemberModal(member)}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                            title="Modifier ce membre"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMemberClick(member.userId, member.fullName)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer ce membre"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* 3 Individual Progress Bars */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                        {/* Daily Progress */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-sky-400" />
                              <span>Progression Journalière</span>
                            </span>
                            <span className="font-bold font-mono text-sky-600">
                              {member.dailyCompletedPercent}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                            <div
                              className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, member.dailyCompletedPercent))}%` }}
                            />
                          </div>
                        </div>

                        {/* Weekly Progress */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-cyan-400" />
                              <span>Progression Hebdomadaire</span>
                            </span>
                            <span className="font-bold font-mono text-cyan-600">
                              {member.weeklyCompletedPercent}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, member.weeklyCompletedPercent))}%` }}
                            />
                          </div>
                        </div>

                        {/* Monthly Progress */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-emerald-400" />
                              <span>Progression Mensuelle</span>
                            </span>
                            <span className="font-bold font-mono text-emerald-600">
                              {member.monthlyCompletedPercent}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, member.monthlyCompletedPercent))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: CREATE / EDIT FAMILLE                             */}
        {/* ======================================================== */}
        {isCreatingGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white border border-sky-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <h3 className="font-cinzel text-base font-bold text-slate-900">
                  {editingGroup ? 'Modifier la Famille' : 'Créer une Famille de Disciples'}
                </h3>
                <button
                  onClick={() => setIsCreatingGroup(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveGroupSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom de la Famille <span className="text-sky-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Famille Béthel, Famille Sion..."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Responsable / Leader <span className="text-sky-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={groupLeader}
                      onChange={(e) => setGroupLeader(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email de contact
                    </label>
                    <input
                      type="email"
                      value={groupEmail}
                      onChange={(e) => setGroupEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jour & Horaire de Rencontre
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Chaque Jeudi 19h30"
                    value={groupMeeting}
                    onChange={(e) => setGroupMeeting(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description & Vision
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Vision spirituelle, communion et mission..."
                    value={groupDesc}
                    onChange={(e) => setGroupDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                {/* Initial Objectives */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-sky-600 uppercase tracking-wider font-cinzel">
                    Objectifs Initiaux
                  </h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Objectif Journalier (ex: 2 chapitres)"
                      value={groupDailyObj}
                      onChange={(e) => setGroupDailyObj(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <input
                      type="text"
                      placeholder="Objectif Hebdomadaire (ex: 1 livre médité)"
                      value={groupWeeklyObj}
                      onChange={(e) => setGroupWeeklyObj(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                    <input
                      type="text"
                      placeholder="Objectif Mensuel (ex: lecture complète)"
                      value={groupMonthlyObj}
                      onChange={(e) => setGroupMonthlyObj(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreatingGroup(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
                  >
                    {editingGroup ? 'Mettre à jour' : 'Créer la famille'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: ADD / EDIT MEMBER (All Requested Fields)          */}
        {/* ======================================================== */}
        {isAddingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white border border-sky-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <h3 className="font-cinzel text-base font-bold text-slate-900">
                  {editingMember ? 'Modifier le Disciple' : 'Inscrire un Nouveau Disciple'}
                </h3>
                <button
                  onClick={() => setIsAddingMember(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMemberSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nom <span className="text-sky-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ngassa"
                      value={memberLastName}
                      onChange={(e) => setMemberLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Prénom <span className="text-sky-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ulrich"
                      value={memberFirstName}
                      onChange={(e) => setMemberFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Poste occupé à l'église <span className="text-sky-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Pasteur, Responsable, Diacre, Disciple..."
                      value={memberRoleInChurch}
                      onChange={(e) => setMemberRoleInChurch(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Numéro de Téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@eglise.org"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                {/* Progress Sliders */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-sky-600 uppercase tracking-wider font-cinzel">
                    Suivi des Barres de Progression
                  </h4>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Progression Journalière (%)</span>
                      <span className="font-mono text-sky-600 font-bold">{memberDailyPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={memberDailyPercent}
                      onChange={(e) => setMemberDailyPercent(Number(e.target.value))}
                      className="w-full accent-sky-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Progression Hebdomadaire (%)</span>
                      <span className="font-mono text-cyan-600 font-bold">{memberWeeklyPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={memberWeeklyPercent}
                      onChange={(e) => setMemberWeeklyPercent(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span>Progression Mensuelle (%)</span>
                      <span className="font-mono text-emerald-600 font-bold">{memberMonthlyPercent}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={memberMonthlyPercent}
                      onChange={(e) => setMemberMonthlyPercent(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Points spirituels
                    </label>
                    <input
                      type="number"
                      value={memberPoints}
                      onChange={(e) => setMemberPoints(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingMember(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
                  >
                    {editingMember ? 'Enregistrer les modifications' : 'Inscrire le disciple'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
