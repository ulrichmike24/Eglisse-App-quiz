export type TranslationKey = 'LSG' | 'BDS' | 'BFC' | 'DARBY' | 'KJV' | 'AMP';

export interface BibleTranslationInfo {
  key: TranslationKey;
  name: string;
  fullName: string;
  language: string;
}

export interface BibleBook {
  id: string;
  name: string;
  shortName: string;
  testament: 'AT' | 'NT'; // Ancien or Nouveau Testament
  category: string;
  chaptersCount: number;
}

export interface BibleVerse {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  translation: TranslationKey;
  strongCode?: string;
  strongOriginal?: string;
  strongDefinition?: string;
}

export interface UserNote {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: string;
  tags?: string[];
}

export interface UserHighlight {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  color: 'yellow' | 'orange' | 'blue' | 'green' | 'purple';
}

export interface UserBookmark {
  id: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  groupName: string; // Famille de disciples
  roleInChurch: string; // Poste occupé à l'église
  isLeader: boolean;
  twoFactorEnabled: boolean;
  encryptionEnabled: boolean;
  points: number;
  streakDays: number;
  avatarSeed?: string;
  joinedDate: string;
}

export interface DiscipleshipGroup {
  id: string;
  name: string;
  leaderName: string;
  leaderEmail: string;
  description: string;
  meetingDay: string;
  membersCount: number;
  dailyObjective: string;
  weeklyObjective: string;
  monthlyObjective: string;
}

export interface GroupMemberProgress {
  userId: string;
  fullName: string;
  roleInChurch: string;
  phone: string;
  avatarSeed: string;
  dailyCompletedPercent: number;
  weeklyCompletedPercent: number;
  monthlyCompletedPercent: number;
  chaptersReadThisWeek: number;
  quizzesPassed: number;
  points: number;
  lastActive: string;
}

export interface BibleStoryQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BibleStory {
  id: string;
  title: string;
  subtitle: string;
  reference: string;
  testament: 'AT' | 'NT';
  summary: string;
  fullNarrative: string[];
  spiritualLesson: string;
  image: string;
  estimatedMinutes: number;
  quiz: BibleStoryQuizQuestion[];
}

export interface KidsStory {
  id: string;
  title: string;
  passage: string;
  heroName: string;
  moral: string;
  coverImage: string;
  ageRange?: string;
  memoryVerse?: string;
  prayer?: string;
  generatedByAI?: boolean;
  createdAt?: string;
  scenes: {
    dialogue: string;
    caption: string;
    soundEffect?: string;
  }[];
  quiz: {
    question: string;
    choices: string[];
    correctIndex: number;
    funFact: string;
  }[];
}

export interface SpiritualBook {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  pages: number;
  readMinutes: number;
  isUploaded?: boolean;
  chapters: {
    title: string;
    content: string;
  }[];
}

export interface ReaderSettings {
  fontSize: number; // 14 to 28
  lineHeight: 'tight' | 'normal' | 'relaxed';
  fontFamily: 'serif' | 'display' | 'sans';
  theme: 'dark' | 'oled' | 'sepia' | 'light';
  showVerseNumbers: boolean;
  showRedLetters: boolean;
  parallelMode: boolean;
  parallelTranslation: TranslationKey;
  showStrongConcordance?: boolean;
}

export interface StrongLexiconEntry {
  code: string;
  originalWord: string;
  language: 'Hébreu' | 'Grec';
  transliteration: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  theologicalContext: string;
  occurrencesCount: number;
  sampleVerses: string[];
}

export interface ReadingPlanDay {
  day: number;
  title: string;
  atPassage: string;
  ntPassage: string;
  psaumePassage: string;
  completedAt: boolean;
  completedNt: boolean;
  completedPsaume: boolean;
}

