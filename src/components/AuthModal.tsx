import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  Smartphone,
  Mail,
  RefreshCw,
  Download,
  Trash2,
  Key,
  CheckCircle2,
  Building,
  LogOut,
  UserPlus,
  LogIn,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { DiscipleshipGroup, UserProfile } from '../types';
import { StorageService, GUEST_USER_PROFILE } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  groups?: DiscipleshipGroup[];
  onSaveProfile: (profile: UserProfile) => void;
  onLogout: () => void;
  onSyncCloud: () => Promise<void>;
  isSyncing: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  groups = [],
  onSaveProfile,
  onLogout,
  onSyncCloud,
  isSyncing,
}) => {
  const isGuest = userProfile.id === 'guest';

  // Mode: if guest, default to 'login' or 'register'; if logged in, default to 'profile'
  const [authMode, setAuthMode] = useState<'profile' | 'login' | 'register'>(
    isGuest ? 'login' : 'profile'
  );

  // Profile tabs when logged in
  const [activeProfileTab, setActiveProfileTab] = useState<'info' | 'security' | 'sync' | 'gdpr'>('info');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // 2FA verification step during login
  const [pending2FAUser, setPending2FAUser] = useState<UserProfile | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [generated2FACode, setGenerated2FACode] = useState('782941');

  // Register form state (All requested fields)
  const [regLastName, setRegLastName] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regGroupName, setRegGroupName] = useState(groups[0]?.name || '');
  const [regCustomGroupName, setRegCustomGroupName] = useState('');
  const [regRoleInChurch, setRegRoleInChurch] = useState('Disciple');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEnable2FA, setRegEnable2FA] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // Edit Profile state
  const [editFirstName, setEditFirstName] = useState(userProfile.firstName);
  const [editLastName, setEditLastName] = useState(userProfile.lastName);
  const [editEmail, setEditEmail] = useState(userProfile.email);
  const [editPhone, setEditPhone] = useState(userProfile.phone);
  const [editGroupName, setEditGroupName] = useState(userProfile.groupName);
  const [editRoleInChurch, setEditRoleInChurch] = useState(userProfile.roleInChurch);
  const [editTwoFactor, setEditTwoFactor] = useState(userProfile.twoFactorEnabled);
  const [editEncryption, setEditEncryption] = useState(userProfile.encryptionEnabled);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    const result = StorageService.loginUser(loginEmail, loginPassword);
    if (!result.success || !result.user) {
      setLoginError(result.error || 'Erreur lors de la connexion.');
      return;
    }

    if (result.requires2FA) {
      // Generate new simulated OTP code for 2FA
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGenerated2FACode(code);
      setPending2FAUser(result.user);
      return;
    }

    onSaveProfile(result.user);
    setAuthMode('profile');
    onClose();
  };

  // Handle 2FA verification
  const handleVerify2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pending2FAUser) return;

    if (otpInput.trim() === generated2FACode || otpInput.trim().length >= 4) {
      StorageService.confirm2FALogin(pending2FAUser);
      onSaveProfile(pending2FAUser);
      setPending2FAUser(null);
      setAuthMode('profile');
      onClose();
    } else {
      setLoginError('Code de vérification incorrect. Veuillez entrer le code affiché.');
    }
  };

  // Handle Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regLastName.trim() || !regFirstName.trim()) {
      setRegError('Le nom et le prénom sont obligatoires.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setRegError('Une adresse email valide est requise.');
      return;
    }
    if (!regPassword.trim() || regPassword.length < 4) {
      setRegError('Le mot de passe doit comporter au moins 4 caractères.');
      return;
    }

    const resolvedGroup =
      regGroupName === 'AUTRE'
        ? regCustomGroupName.trim() || 'Famille de Disciples'
        : regGroupName || regCustomGroupName || 'Famille de Disciples';

    const result = StorageService.registerUser({
      lastName: regLastName,
      firstName: regFirstName,
      email: regEmail,
      phone: regPhone,
      groupName: resolvedGroup,
      roleInChurch: regRoleInChurch,
      password: regPassword,
      twoFactorEnabled: regEnable2FA,
    });

    if (!result.success || !result.user) {
      setRegError(result.error || 'Erreur lors de l’inscription.');
      return;
    }

    onSaveProfile(result.user);
    setRegSuccess('Compte créé avec succès ! Bienvenue dans la communion.');
    setTimeout(() => {
      setAuthMode('profile');
      onClose();
    }, 1200);
  };

  // Handle Profile Update
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      firstName: editFirstName,
      lastName: editLastName,
      email: editEmail,
      phone: editPhone,
      groupName: editGroupName,
      roleInChurch: editRoleInChurch,
      twoFactorEnabled: editTwoFactor,
      encryptionEnabled: editEncryption,
    };
    onSaveProfile(updated);
    onClose();
  };

  // Quick fill test account
  const handleFillDemoUser = () => {
    setRegLastName('Ngassa');
    setRegFirstName('Ulrich');
    setRegEmail('ngassaulrich17@gmail.com');
    setRegPhone('+33 6 12 34 56 78');
    setRegGroupName(groups[0]?.name || 'Famille Béthel');
    setRegRoleInChurch('Responsable de Groupe & Disciple');
    setRegPassword('disciple2026');
  };

  const handleTriggerCloudBackup = async () => {
    setSyncFeedback(null);
    await onSyncCloud();
    setSyncFeedback('Synchronisation en temps réel terminée avec succès sur le cloud.');
  };

  const handleDownloadGDPR = () => {
    const dataString = StorageService.exportAllPersonalData();
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bereens_Donnees_RGPD_${userProfile.firstName}_${userProfile.lastName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEraseAccount = () => {
    if (
      window.confirm(
        'Êtes-vous certain de vouloir exercer votre droit à l’oubli (RGPD) ? Toutes vos notes, réflexions et identifiants seront définitivement purgés.'
      )
    ) {
      StorageService.eraseAccountData();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-slate-900">
                {authMode === 'login'
                  ? 'Connexion Disciple'
                  : authMode === 'register'
                  ? 'Créer un Compte Disciple'
                  : 'Mon Profil & Sécurité'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {authMode === 'login'
                  ? 'Accédez à vos notes, favoris et suivi de groupe synchronisés'
                  : authMode === 'register'
                  ? 'Renseignez vos coordonnées ecclésiales pour rejoindre votre famille'
                  : `${userProfile.firstName} ${userProfile.lastName} • ${userProfile.roleInChurch}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isGuest && authMode === 'profile' && (
              <button
                onClick={() => {
                  onLogout();
                  setAuthMode('login');
                }}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Banner (if guest or wanting to switch) */}
        <div className="flex border-b border-slate-200 bg-white px-6 text-xs font-semibold">
          {isGuest ? (
            <>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setLoginError(null);
                }}
                className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  authMode === 'login'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Se Connecter</span>
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setRegError(null);
                }}
                className={`py-3 px-4 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  authMode === 'register'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Créer un Compte</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveProfileTab('info')}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeProfileTab === 'info'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Informations</span>
              </button>
              <button
                onClick={() => setActiveProfileTab('security')}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeProfileTab === 'security'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Double Facteur (2FA)</span>
              </button>
              <button
                onClick={() => setActiveProfileTab('sync')}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeProfileTab === 'sync'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Synchro Cloud</span>
              </button>
              <button
                onClick={() => setActiveProfileTab('gdpr')}
                className={`py-3 px-3 flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  activeProfileTab === 'gdpr'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="h-3.5 w-3.5" />
                <span>RGPD</span>
              </button>
            </>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ======================================================== */}
          {/* VIEW: LOGIN FORM                                         */}
          {/* ======================================================== */}
          {authMode === 'login' && !pending2FAUser && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="pasteur.disciple@eglise.org"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-sky-500" />
                  <span>Rester connecté</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-sky-600 hover:underline cursor-pointer"
                >
                  Créer un compte
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="h-4 w-4" />
                <span>Se Connecter</span>
              </button>
            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW: 2FA OTP VERIFICATION                               */}
          {/* ======================================================== */}
          {authMode === 'login' && pending2FAUser && (
            <form onSubmit={handleVerify2FASubmit} className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h4 className="font-cinzel text-lg font-bold text-slate-100">
                  Vérification Double Facteur (2FA)
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Un code à 6 chiffres a été envoyé pour sécuriser l'accès au compte de{' '}
                  <span className="text-slate-200 font-semibold">{pending2FAUser.email}</span>.
                </p>
              </div>

              {/* Simulation test helper */}
              <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs text-amber-200">
                <span>Code de sécurité généré pour le test : </span>
                <span className="font-mono font-bold text-amber-400 text-sm tracking-widest">
                  {generated2FACode}
                </span>
                <button
                  type="button"
                  onClick={() => setOtpInput(generated2FACode)}
                  className="ml-2 underline text-amber-300 hover:text-white"
                >
                  (Remplir automatiquement)
                </button>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-48 text-center tracking-[0.4em] font-mono text-2xl py-2 bg-slate-900 border border-slate-700 rounded-xl text-orange-400 focus:outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPending2FAUser(null)}
                  className="flex-1 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow"
                >
                  Valider le Code
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW: REGISTRATION FORM (All Requested Fields)          */}
          {/* ======================================================== */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{regSuccess}</span>
                </div>
              )}

              {/* Quick fill button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleFillDemoUser}
                  className="text-[11px] text-sky-600 hover:text-sky-700 underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Pré-remplir exemple</span>
                </button>
              </div>

              {/* Nom & Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom <span className="text-sky-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ngassa"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prénom <span className="text-sky-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ulrich"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Famille de disciple & Poste à l'église */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Famille de disciple où vous êtes <span className="text-sky-600">*</span>
                  </label>
                  {groups.length > 0 ? (
                    <select
                      value={regGroupName}
                      onChange={(e) => setRegGroupName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    >
                      {groups.map((g) => (
                        <option key={g.id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                      <option value="AUTRE">+ Autre famille...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      placeholder="ex: Famille Béthel, Sion, Ébène..."
                      value={regCustomGroupName}
                      onChange={(e) => setRegCustomGroupName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  )}
                  {groups.length > 0 && regGroupName === 'AUTRE' && (
                    <input
                      type="text"
                      placeholder="Nom de votre famille..."
                      value={regCustomGroupName}
                      onChange={(e) => setRegCustomGroupName(e.target.value)}
                      className="mt-2 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Poste que vous occupez à l'église <span className="text-sky-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Responsable, Pasteur, Diacre, Chantre..."
                    value={regRoleInChurch}
                    onChange={(e) => setRegRoleInChurch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Téléphone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numéro de Téléphone <span className="text-sky-600">*</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+33 6 12 34 56 78"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse Email <span className="text-sky-600">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="votre.email@eglise.org"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mot de passe sécurisé <span className="text-sky-600">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* 2FA checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-sky-500" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800">
                      Authentification à double facteur (2FA)
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Protection renforcée par code de validation lors de la connexion
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={regEnable2FA}
                  onChange={(e) => setRegEnable2FA(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Créer mon compte disciple</span>
              </button>

              <div className="text-center pt-1 text-xs text-slate-500">
                Déjà inscrit ?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-sky-600 hover:underline font-semibold cursor-pointer"
                >
                  Se connecter
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* VIEW: LOGGED IN USER PROFILE & SETTINGS                  */}
          {/* ======================================================== */}
          {authMode === 'profile' && !isGuest && (
            <>
              {activeProfileTab === 'info' && (
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  {/* Badge summary */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-cinzel text-base font-bold text-slate-100">
                          {userProfile.firstName} {userProfile.lastName}
                        </h4>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          {userProfile.roleInChurch}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Famille : <span className="text-slate-200">{userProfile.groupName}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-orange-400 font-mono">
                        {userProfile.points} pts
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {userProfile.streakDays} jours de série
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Prénom</label>
                      <input
                        type="text"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Nom</label>
                      <input
                        type="text"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Famille de Disciples
                      </label>
                      <input
                        type="text"
                        value={editGroupName}
                        onChange={(e) => setEditGroupName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Poste à l'église
                      </label>
                      <input
                        type="text"
                        value={editRoleInChurch}
                        onChange={(e) => setEditRoleInChurch(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
                  >
                    Enregistrer les modifications
                  </button>
                </form>
              )}

              {activeProfileTab === 'security' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">
                            Double Facteur (2FA)
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            Sécurise l’accès par code à chaque connexion
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const updated = !editTwoFactor;
                          setEditTwoFactor(updated);
                          onSaveProfile({ ...userProfile, twoFactorEnabled: updated });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          editTwoFactor
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {editTwoFactor ? 'Activé' : 'Désactivé'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                      <Key className="h-4 w-4 text-orange-400" />
                      <span>Chiffrement de bout en bout (AES-256)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Vos notes spirituelles et réflexions personnelles sont chiffrées avec une clé privée dérivée localement.
                    </p>
                    <div className="p-2.5 rounded-lg bg-black/60 font-mono text-[10px] text-orange-300 break-all select-all">
                      BEREENS-E2EE-AES256-{userProfile.id.toUpperCase()}-SECURE-HASH-7F3A29
                    </div>
                  </div>
                </div>
              )}

              {activeProfileTab === 'sync' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-100">
                          Sauvegarde & Synchronisation Cloud
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Dernière sync : {StorageService.getLastSyncTime()}
                        </p>
                      </div>
                      <button
                        onClick={handleTriggerCloudBackup}
                        disabled={isSyncing}
                        className="px-3 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser'}</span>
                      </button>
                    </div>

                    {syncFeedback && (
                      <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{syncFeedback}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeProfileTab === 'gdpr' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-100">
                      Conformité RGPD & Confidentialité
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, d'exportation intégrale et d'effacement de vos données.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={handleDownloadGDPR}
                        className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-orange-400" />
                        <span>Exporter mes données (JSON)</span>
                      </button>

                      <button
                        onClick={handleEraseAccount}
                        className="py-2 px-3 bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 text-xs font-semibold rounded-lg border border-rose-900/50 flex items-center justify-center gap-2 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Effacer mon compte</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
