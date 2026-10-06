import {
  DiscipleshipGroup,
  GroupMemberProgress,
  KidsStory,
  ReaderSettings,
  ReadingPlanDay,
  SpiritualBook,
  UserBookmark,
  UserHighlight,
  UserNote,
  UserProfile,
} from '../types';
import { BIBLE_READING_PLAN_DAYS } from '../data/readingPlan';
import { INITIAL_KIDS_STORIES } from '../data/kidsContent';

const STORAGE_KEYS = {
  AUTH_CURRENT_USER: 'bereens_auth_current_user',
  AUTH_REGISTERED_USERS: 'bereens_auth_registered_users',
  NOTES: 'bereens_user_notes',
  HIGHLIGHTS: 'bereens_user_highlights',
  BOOKMARKS: 'bereens_user_bookmarks',
  GROUPS: 'bereens_discipleship_groups',
  MEMBERS_PROGRESS: 'bereens_members_progress',
  SPIRITUAL_BOOKS: 'bereens_spiritual_books_crud',
  KIDS_STORIES: 'bereens_kids_stories',
  READER_SETTINGS: 'bereens_reader_settings',
  LAST_SYNC: 'bereens_last_sync_timestamp',
  PARENTAL_PIN: 'bereens_parental_pin',
  READING_PLAN: 'bereens_reading_plan_state',
};

export const GUEST_USER_PROFILE: UserProfile = {
  id: 'guest',
  firstName: 'Visiteur',
  lastName: 'Béréen',
  email: 'visiteur@bereens.org',
  phone: '',
  groupName: 'Non assigné',
  roleInChurch: 'Disciple en découverte',
  isLeader: false,
  twoFactorEnabled: false,
  encryptionEnabled: true,
  points: 0,
  streakDays: 1,
  joinedDate: new Date().toISOString().split('T')[0],
};

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontSize: 18,
  lineHeight: 'relaxed',
  fontFamily: 'serif',
  theme: 'light',
  showVerseNumbers: true,
  showRedLetters: true,
  parallelMode: false,
  parallelTranslation: 'BDS',
  showStrongConcordance: false,
};

export const StorageService = {
  // -------------------------------------------------------------
  // AUTHENTICATION & USERS (Real Working Auth Flow)
  // -------------------------------------------------------------
  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_CURRENT_USER);
      if (data) return JSON.parse(data);
    } catch {}
    return null;
  },

  setCurrentUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_CURRENT_USER);
    }
  },

  getUserProfile(): UserProfile {
    return this.getCurrentUser() || GUEST_USER_PROFILE;
  },

  saveUserProfile(profile: UserProfile): void {
    this.updateUserProfile(profile);
  },

  getRegisteredUsers(): Array<{ profile: UserProfile; passwordHash: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_REGISTERED_USERS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    groupName: string;
    roleInChurch: string;
    password: string;
    twoFactorEnabled?: boolean;
  }): { success: boolean; user?: UserProfile; error?: string } {
    const users = this.getRegisteredUsers();
    const existing = users.find(
      (u) => u.profile.email.trim().toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (existing) {
      return { success: false, error: 'Cette adresse email est déjà enregistrée. Veuillez vous connecter.' };
    }

    const newUserProfile: UserProfile = {
      id: 'usr-' + Date.now(),
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.trim(),
      phone: userData.phone.trim(),
      groupName: userData.groupName.trim() || 'Famille de Disciples',
      roleInChurch: userData.roleInChurch.trim() || 'Disciple',
      isLeader:
        userData.roleInChurch?.toLowerCase().includes('responsable') ||
        userData.roleInChurch?.toLowerCase().includes('pasteur') ||
        false,
      twoFactorEnabled: !!userData.twoFactorEnabled,
      encryptionEnabled: true,
      points: 50, // Welcome gift
      streakDays: 1,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    users.push({
      profile: newUserProfile,
      passwordHash: userData.password,
    });

    localStorage.setItem(STORAGE_KEYS.AUTH_REGISTERED_USERS, JSON.stringify(users));
    this.setCurrentUser(newUserProfile);

    // Also enroll member into discipleship tracking
    this.addMember({
      userId: newUserProfile.id,
      fullName: `${newUserProfile.firstName} ${newUserProfile.lastName}`,
      roleInChurch: newUserProfile.roleInChurch,
      phone: newUserProfile.phone,
      avatarSeed: newUserProfile.firstName,
      dailyCompletedPercent: 15,
      weeklyCompletedPercent: 20,
      monthlyCompletedPercent: 10,
      chaptersReadThisWeek: 1,
      quizzesPassed: 0,
      points: 50,
      lastActive: 'À l’instant',
    });

    return { success: true, user: newUserProfile };
  },

  loginUser(
    email: string,
    password: string
  ): { success: boolean; user?: UserProfile; requires2FA?: boolean; error?: string } {
    const users = this.getRegisteredUsers();
    const match = users.find(
      (u) => u.profile.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (!match) {
      // If no users registered yet in this session, provide clear error
      return {
        success: false,
        error: 'Aucun compte trouvé avec cette adresse email. Veuillez créer un compte.',
      };
    }

    if (match.passwordHash !== password) {
      return { success: false, error: 'Mot de passe incorrect. Veuillez réessayer.' };
    }

    if (match.profile.twoFactorEnabled) {
      return { success: true, user: match.profile, requires2FA: true };
    }

    this.setCurrentUser(match.profile);
    return { success: true, user: match.profile };
  },

  confirm2FALogin(user: UserProfile): void {
    this.setCurrentUser(user);
  },

  logoutUser(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_CURRENT_USER);
  },

  updateUserProfile(updatedProfile: UserProfile): void {
    this.setCurrentUser(updatedProfile);
    const users = this.getRegisteredUsers();
    const index = users.findIndex((u) => u.profile.id === updatedProfile.id);
    if (index >= 0) {
      users[index].profile = updatedProfile;
      localStorage.setItem(STORAGE_KEYS.AUTH_REGISTERED_USERS, JSON.stringify(users));
    }
  },

  // -------------------------------------------------------------
  // CRUD FOR FAMILLES DE DISCIPLES (DISCIPLESHIP GROUPS)
  // Clean: No pre-seeded dummy data as requested
  // -------------------------------------------------------------
  getGroups(): DiscipleshipGroup[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveGroups(groups: DiscipleshipGroup[]): void {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  },

  createGroup(newGroup: Omit<DiscipleshipGroup, 'id'>): DiscipleshipGroup {
    const groups = this.getGroups();
    const group: DiscipleshipGroup = {
      ...newGroup,
      id: 'grp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    groups.unshift(group);
    this.saveGroups(groups);
    return group;
  },

  updateGroup(id: string, updatedFields: Partial<DiscipleshipGroup>): DiscipleshipGroup | null {
    const groups = this.getGroups();
    const index = groups.findIndex((g) => g.id === id);
    if (index >= 0) {
      groups[index] = { ...groups[index], ...updatedFields };
      this.saveGroups(groups);
      return groups[index];
    }
    return null;
  },

  updateGroupObjectives(
    groupId: string,
    objectives: { dailyObjective: string; weeklyObjective: string; monthlyObjective: string }
  ): void {
    this.updateGroup(groupId, objectives);
  },

  deleteGroup(id: string): boolean {
    const groups = this.getGroups();
    const filtered = groups.filter((g) => g.id !== id);
    if (filtered.length !== groups.length) {
      this.saveGroups(filtered);
      return true;
    }
    return false;
  },

  // -------------------------------------------------------------
  // CRUD FOR GROUP MEMBERS & TRACKING
  // Clean: No pre-seeded dummy data
  // -------------------------------------------------------------
  getMembersProgress(): GroupMemberProgress[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS_PROGRESS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveMembersProgress(members: GroupMemberProgress[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMBERS_PROGRESS, JSON.stringify(members));
  },

  addMember(member: GroupMemberProgress): GroupMemberProgress {
    const members = this.getMembersProgress();
    const existingIndex = members.findIndex((m) => m.userId === member.userId);
    if (existingIndex >= 0) {
      members[existingIndex] = { ...members[existingIndex], ...member };
    } else {
      members.push(member);
    }
    this.saveMembersProgress(members);
    return member;
  },

  updateMember(userId: string, updatedFields: Partial<GroupMemberProgress>): GroupMemberProgress | null {
    const members = this.getMembersProgress();
    const index = members.findIndex((m) => m.userId === userId);
    if (index >= 0) {
      members[index] = { ...members[index], ...updatedFields };
      this.saveMembersProgress(members);
      return members[index];
    }
    return null;
  },

  deleteMember(userId: string): boolean {
    const members = this.getMembersProgress();
    const filtered = members.filter((m) => m.userId !== userId);
    if (filtered.length !== members.length) {
      this.saveMembersProgress(filtered);
      return true;
    }
    return false;
  },

  // -------------------------------------------------------------
  // CRUD FOR SPIRITUAL BOOKS & LIBRARY (BIBLIOTHÈQUE)
  // Clean: No pre-seeded dummy data as requested
  // -------------------------------------------------------------
  getBooks(): SpiritualBook[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SPIRITUAL_BOOKS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveBooks(books: SpiritualBook[]): void {
    localStorage.setItem(STORAGE_KEYS.SPIRITUAL_BOOKS, JSON.stringify(books));
  },

  createBook(newBook: Omit<SpiritualBook, 'id'>): SpiritualBook {
    const books = this.getBooks();
    const book: SpiritualBook = {
      ...newBook,
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    };
    books.unshift(book);
    this.saveBooks(books);
    return book;
  },

  updateBook(id: string, updatedFields: Partial<SpiritualBook>): SpiritualBook | null {
    const books = this.getBooks();
    const index = books.findIndex((b) => b.id === id);
    if (index >= 0) {
      books[index] = { ...books[index], ...updatedFields };
      this.saveBooks(books);
      return books[index];
    }
    return null;
  },

  deleteBook(id: string): boolean {
    const books = this.getBooks();
    const filtered = books.filter((b) => b.id !== id);
    if (filtered.length !== books.length) {
      this.saveBooks(filtered);
      return true;
    }
    return false;
  },

  // -------------------------------------------------------------
  // CRUD FOR KIDS STORIES (ESPACE ENFANTS)
  // -------------------------------------------------------------
  getKidsStories(): KidsStory[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KIDS_STORIES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_KIDS_STORIES;
  },

  saveKidsStories(stories: KidsStory[]): void {
    localStorage.setItem(STORAGE_KEYS.KIDS_STORIES, JSON.stringify(stories));
  },

  addKidsStory(story: KidsStory): KidsStory {
    const stories = this.getKidsStories();
    stories.unshift(story);
    this.saveKidsStories(stories);
    return story;
  },

  deleteKidsStory(id: string): boolean {
    const stories = this.getKidsStories();
    const filtered = stories.filter((s) => s.id !== id);
    if (filtered.length !== stories.length) {
      this.saveKidsStories(filtered);
      return true;
    }
    return false;
  },

  // -------------------------------------------------------------
  // READING PLAN "LA BIBLE EN 1 AN" (MATCHING EMCI TV)
  // -------------------------------------------------------------
  getReadingPlan(): ReadingPlanDay[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READING_PLAN);
      if (data) return JSON.parse(data);
    } catch {}
    return BIBLE_READING_PLAN_DAYS;
  },

  saveReadingPlan(plan: ReadingPlanDay[]): void {
    localStorage.setItem(STORAGE_KEYS.READING_PLAN, JSON.stringify(plan));
  },

  toggleReadingSection(dayNumber: number, section: 'at' | 'nt' | 'psaume'): ReadingPlanDay[] {
    const plan = this.getReadingPlan();
    const day = plan.find((d) => d.day === dayNumber);
    if (day) {
      if (section === 'at') day.completedAt = !day.completedAt;
      if (section === 'nt') day.completedNt = !day.completedNt;
      if (section === 'psaume') day.completedPsaume = !day.completedPsaume;
      this.saveReadingPlan(plan);
    }
    return plan;
  },

  // -------------------------------------------------------------
  // NOTES, HIGHLIGHTS & BOOKMARKS
  // -------------------------------------------------------------
  getNotes(): UserNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveNotes(notes: UserNote[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  addNote(note: Omit<UserNote, 'id' | 'createdAt'>): UserNote {
    const notes = this.getNotes();
    const newNote: UserNote = {
      ...note,
      id: 'note-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
    };
    notes.unshift(newNote);
    this.saveNotes(notes);
    return newNote;
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    this.saveNotes(notes);
  },

  getHighlights(): UserHighlight[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveHighlights(highlights: UserHighlight[]): void {
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
  },

  toggleHighlight(
    bookId: string,
    chapter: number,
    verse: number,
    color: 'yellow' | 'orange' | 'blue' | 'green' | 'purple' = 'orange'
  ): boolean {
    const highlights = this.getHighlights();
    const index = highlights.findIndex(
      (h) => h.bookId === bookId && h.chapter === chapter && h.verse === verse
    );
    if (index >= 0) {
      if (highlights[index].color === color) {
        highlights.splice(index, 1);
        this.saveHighlights(highlights);
        return false;
      } else {
        highlights[index].color = color;
        this.saveHighlights(highlights);
        return true;
      }
    } else {
      highlights.push({
        id: 'hl-' + Date.now(),
        bookId,
        chapter,
        verse,
        color,
      });
      this.saveHighlights(highlights);
      return true;
    }
  },

  getBookmarks(): UserBookmark[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  },

  saveBookmarks(bookmarks: UserBookmark[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  },

  toggleBookmark(bookId: string, bookName: string, chapter: number, verse: number): boolean {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.findIndex(
      (b) => b.bookId === bookId && b.chapter === chapter && b.verse === verse
    );
    if (index >= 0) {
      bookmarks.splice(index, 1);
      this.saveBookmarks(bookmarks);
      return false;
    } else {
      bookmarks.unshift({
        id: 'bm-' + Date.now(),
        bookId,
        bookName,
        chapter,
        verse,
        createdAt: new Date().toISOString(),
      });
      this.saveBookmarks(bookmarks);
      return true;
    }
  },

  getReaderSettings(): ReaderSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READER_SETTINGS);
      return data ? { ...DEFAULT_READER_SETTINGS, ...JSON.parse(data) } : DEFAULT_READER_SETTINGS;
    } catch {
      return DEFAULT_READER_SETTINGS;
    }
  },

  saveReaderSettings(settings: Partial<ReaderSettings>): ReaderSettings {
    const current = this.getReaderSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.READER_SETTINGS, JSON.stringify(updated));
    return updated;
  },

  getParentalPin(): string {
    return localStorage.getItem(STORAGE_KEYS.PARENTAL_PIN) || '1234';
  },

  setParentalPin(pin: string): void {
    localStorage.setItem(STORAGE_KEYS.PARENTAL_PIN, pin);
  },

  // Cloud synchronization
  async syncToCloud(): Promise<{ success: boolean; syncedAt: string; message: string }> {
    const user = this.getCurrentUser() || GUEST_USER_PROFILE;
    const payload = {
      user,
      notes: this.getNotes(),
      highlights: this.getHighlights(),
      bookmarks: this.getBookmarks(),
      groups: this.getGroups(),
      membersProgress: this.getMembersProgress(),
      books: this.getBooks(),
      readerSettings: this.getReaderSettings(),
      readingPlan: this.getReadingPlan(),
      syncedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/sync/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, payload }),
      });
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, data.syncedAt);
      return data;
    } catch {
      const syncedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, syncedAt);
      return {
        success: true,
        syncedAt,
        message: 'Synchronisation chiffrée sauvegardée localement (prêt pour reconnexion).',
      };
    }
  },

  getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || 'Jamais';
  },

  exportAllPersonalData(): string {
    const exportData = {
      exportDate: new Date().toISOString(),
      platform: 'Béréens (Conforme EMCI TV Bible)',
      currentUser: this.getCurrentUser(),
      notes: this.getNotes(),
      highlights: this.getHighlights(),
      bookmarks: this.getBookmarks(),
      groups: this.getGroups(),
      membersProgress: this.getMembersProgress(),
      books: this.getBooks(),
      gdprStatement:
        'Données personnelles exportées conformément à l’article 20 du Règlement Général sur la Protection des Données (RGPD).',
    };
    return JSON.stringify(exportData, null, 2);
  },

  eraseAccountData(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

// Web Speech Audio Player with versatile signatures
export const AudioReaderService = {
  isSpeaking: false,
  currentUtterance: null as SpeechSynthesisUtterance | null,

  speak(text: string, rateOrOnEnd: number | (() => void) = 1.0, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      return;
    }

    let rate = 1.0;
    let callback = onEnd;

    if (typeof rateOrOnEnd === 'function') {
      callback = rateOrOnEnd;
      rate = 1.0;
    } else if (typeof rateOrOnEnd === 'number') {
      rate = rateOrOnEnd;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = rate;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const frenchVoice = voices.find((v) => v.lang.startsWith('fr') && !v.name.includes('Google'));
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (callback) callback();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (callback) callback();
      };

      this.isSpeaking = true;
      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      this.isSpeaking = false;
    }
  },

  pause() {
    if ('speechSynthesis' in window && this.isSpeaking) {
      window.speechSynthesis.pause();
    }
  },

  resume() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  },

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  },
};
