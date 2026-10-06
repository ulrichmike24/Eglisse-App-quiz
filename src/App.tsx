/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { BibleReader } from './components/BibleReader';
import { VerseModal } from './components/VerseModal';
import { ShareVerseModal } from './components/ShareVerseModal';
import { SearchModal } from './components/SearchModal';
import { GroupsDashboard } from './components/GroupsDashboard';
import { StoriesSection } from './components/StoriesSection';
import { KidsZone } from './components/KidsZone';
import { SpiritualLibrary } from './components/SpiritualLibrary';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AuthModal } from './components/AuthModal';
import { ReadingPlanModal } from './components/ReadingPlanModal';
import { StrongLexiconModal } from './components/StrongLexiconModal';
import { LandingPage } from './components/LandingPage';
import { BibleAIChat } from './components/BibleAIChat';
import {
  BibleVerse,
  DiscipleshipGroup,
  GroupMemberProgress,
  ReaderSettings,
  TranslationKey,
  UserBookmark,
  UserHighlight,
  UserNote,
  UserProfile,
} from './types';
import { StorageService, GUEST_USER_PROFILE } from './services/storage';
import { BIBLE_BOOKS } from './data/bibleCanon';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [initialChatPrompt, setInitialChatPrompt] = useState<{
    bookName: string;
    chapter: number;
    verse: number;
    text: string;
  } | null>(null);

  // Reader state
  const [currentBookId, setCurrentBookId] = useState('PSA');
  const [currentChapter, setCurrentChapter] = useState(23);
  const [currentTranslation, setCurrentTranslation] = useState<TranslationKey>('LSG');
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(() =>
    StorageService.getReaderSettings()
  );

  // User & Data state
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    StorageService.getUserProfile()
  );
  const [notes, setNotes] = useState<UserNote[]>(() => StorageService.getNotes());
  const [highlights, setHighlights] = useState<UserHighlight[]>(() => StorageService.getHighlights());
  const [bookmarks, setBookmarks] = useState<UserBookmark[]>(() => StorageService.getBookmarks());
  const [groups, setGroups] = useState<DiscipleshipGroup[]>(() => StorageService.getGroups());
  const [membersProgress, setMembersProgress] = useState<GroupMemberProgress[]>(() =>
    StorageService.getMembersProgress()
  );

  // Modals state
  const [selectedVerseForModal, setSelectedVerseForModal] = useState<BibleVerse | null>(null);
  const [selectedVerseForShare, setSelectedVerseForShare] = useState<BibleVerse | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isReadingPlanOpen, setIsReadingPlanOpen] = useState(false);
  const [isStrongLexiconOpen, setIsStrongLexiconOpen] = useState(false);
  const [activeStrongCode, setActiveStrongCode] = useState('H7706');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Keyboard shortcut: Cmd+K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdateReaderSettings = (partial: Partial<ReaderSettings>) => {
    const updated = StorageService.saveReaderSettings(partial);
    setReaderSettings(updated);
  };

  const handleQuickSync = async () => {
    setIsSyncing(true);
    const result = await StorageService.syncToCloud();
    setIsSyncing(false);
    setSyncToast(result.message);
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleSaveNote = (text: string, tags: string[]) => {
    if (!selectedVerseForModal) return;
    const newNote = StorageService.addNote({
      bookId: selectedVerseForModal.bookId,
      bookName: selectedVerseForModal.bookName,
      chapter: selectedVerseForModal.chapter,
      verse: selectedVerseForModal.verse,
      text,
      tags,
    });
    setNotes([newNote, ...notes.filter((n) => n.id !== newNote.id)]);
  };

  const handleDeleteNote = (id: string) => {
    StorageService.deleteNote(id);
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleToggleHighlight = (
    verse: BibleVerse,
    color: 'yellow' | 'orange' | 'blue' | 'green' | 'purple' = 'orange'
  ) => {
    StorageService.toggleHighlight(verse.bookId, verse.chapter, verse.verse, color);
    setHighlights(StorageService.getHighlights());
  };

  const handleToggleBookmark = (verse: BibleVerse) => {
    StorageService.toggleBookmark(verse.bookId, verse.bookName, verse.chapter, verse.verse);
    setBookmarks(StorageService.getBookmarks());
  };

  const handleAwardPoints = (addedPoints: number) => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      points: Math.max(0, userProfile.points + addedPoints),
    };
    setUserProfile(updatedProfile);
    StorageService.saveUserProfile(updatedProfile);

    // Update in progress list as well
    const updatedList = membersProgress.map((m) =>
      m.userId === userProfile.id ? { ...m, points: Math.max(0, m.points + addedPoints) } : m
    );
    setMembersProgress(updatedList);
    StorageService.saveMembersProgress(updatedList);
  };

  // -------------------------------------------------------------
  // FAMILIES (GROUPS) CRUD HANDLERS
  // -------------------------------------------------------------
  const handleCreateGroup = (newGroupData: Omit<DiscipleshipGroup, 'id'>) => {
    const created = StorageService.createGroup(newGroupData);
    setGroups(StorageService.getGroups());
    setSyncToast(`Famille "${created.name}" créée avec succès.`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleUpdateGroup = (id: string, updatedFields: Partial<DiscipleshipGroup>) => {
    StorageService.updateGroup(id, updatedFields);
    setGroups(StorageService.getGroups());
  };

  const handleDeleteGroup = (id: string) => {
    StorageService.deleteGroup(id);
    setGroups(StorageService.getGroups());
    setSyncToast('Famille supprimée.');
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleUpdateGroupObjectives = (
    groupId: string,
    objectives: { dailyObjective: string; weeklyObjective: string; monthlyObjective: string }
  ) => {
    StorageService.updateGroupObjectives(groupId, objectives);
    setGroups(StorageService.getGroups());
  };

  // -------------------------------------------------------------
  // MEMBERS CRUD HANDLERS
  // -------------------------------------------------------------
  const handleAddMember = (newMember: GroupMemberProgress) => {
    StorageService.addMember(newMember);
    setMembersProgress(StorageService.getMembersProgress());
    setSyncToast(`Disciple "${newMember.fullName}" inscrit avec succès.`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleUpdateMember = (userId: string, updatedFields: Partial<GroupMemberProgress>) => {
    StorageService.updateMember(userId, updatedFields);
    setMembersProgress(StorageService.getMembersProgress());
  };

  const handleDeleteMember = (userId: string) => {
    StorageService.deleteMember(userId);
    setMembersProgress(StorageService.getMembersProgress());
    setSyncToast('Disciple retiré du groupe.');
    setTimeout(() => setSyncToast(null), 3000);
  };

  // -------------------------------------------------------------
  // AUTHENTICATION HANDLERS
  // -------------------------------------------------------------
  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    StorageService.saveUserProfile(updated);
  };

  const handleLogout = () => {
    StorageService.logoutUser();
    setUserProfile(GUEST_USER_PROFILE);
    setSyncToast('Vous êtes déconnecté.');
    setTimeout(() => setSyncToast(null), 3000);
  };

  const handleSelectVerseFromSearch = (bookId: string, chapter: number, verse: number) => {
    setCurrentBookId(bookId);
    setCurrentChapter(chapter);
    setActiveTab('bible');
  };

  // Handle passage jump from Reading Plan (e.g. "Genèse 1", "Psaumes 23")
  const handlePassageJump = (passageText: string) => {
    const matchedBook = BIBLE_BOOKS.find((b) =>
      passageText.toLowerCase().includes(b.name.toLowerCase())
    );
    if (matchedBook) {
      const matchNumbers = passageText.match(/\d+/);
      const chapter = matchNumbers ? parseInt(matchNumbers[0], 10) : 1;
      setCurrentBookId(matchedBook.id);
      setCurrentChapter(Math.min(matchedBook.chaptersCount, Math.max(1, chapter)));
      setActiveTab('bible');
      setIsReadingPlanOpen(false);
      setIsStrongLexiconOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-white border border-sky-200 text-slate-800 text-xs font-semibold shadow-xl flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-200">
          <div className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenReadingPlan={() => setIsReadingPlanOpen(true)}
        onOpenStrongLexicon={() => setIsStrongLexiconOpen(true)}
        userProfile={userProfile}
        isSyncing={isSyncing}
        onQuickSync={handleQuickSync}
      />

      {/* Main Section Routing */}
      <div className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenReadingPlan={() => setIsReadingPlanOpen(true)}
            onOpenStrongLexicon={() => setIsStrongLexiconOpen(true)}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'chat' && (
          <BibleAIChat
            userProfile={userProfile}
            initialVersePrompt={initialChatPrompt}
            onNavigateToVerse={(bId, cNum) => {
              setCurrentBookId(bId);
              setCurrentChapter(cNum);
              setActiveTab('bible');
            }}
            onSaveNote={({ bookName, chapter, verse, text }) => {
              const bookObj = BIBLE_BOOKS.find(
                (b) =>
                  b.name.toLowerCase() === bookName.toLowerCase() ||
                  b.id.toLowerCase() === bookName.toLowerCase()
              );
              const bId = bookObj?.id || 'GEN';
              StorageService.addNote({
                bookId: bId,
                bookName,
                chapter,
                verse,
                text,
                tags: ['Bible AI'],
              });
              setNotes(StorageService.getNotes());
            }}
          />
        )}

        {activeTab === 'bible' && (
          <BibleReader
            currentBookId={currentBookId}
            currentChapter={currentChapter}
            currentTranslation={currentTranslation}
            onSelectBookAndChapter={(bId, cNum) => {
              setCurrentBookId(bId);
              setCurrentChapter(cNum);
            }}
            onSelectTranslation={(tr) => setCurrentTranslation(tr)}
            readerSettings={readerSettings}
            onUpdateReaderSettings={handleUpdateReaderSettings}
            notes={notes}
            highlights={highlights}
            bookmarks={bookmarks}
            onOpenVerseModal={(v) => setSelectedVerseForModal(v)}
            onOpenShareModal={(v) => setSelectedVerseForShare(v)}
          />
        )}

        {activeTab === 'groups' && (
          <GroupsDashboard
            groups={groups}
            membersProgress={membersProgress}
            userProfile={userProfile}
            onUpdateObjectives={handleUpdateGroupObjectives}
            onCreateGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
            onUpdateUserPoints={(pts) => handleAwardPoints(pts - userProfile.points)}
          />
        )}

        {activeTab === 'library' && <SpiritualLibrary />}

        {activeTab === 'stories' && (
          <StoriesSection onAwardPoints={handleAwardPoints} />
        )}

        {activeTab === 'kids' && <KidsZone />}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            userProfile={userProfile}
            notes={notes}
            highlights={highlights}
            bookmarks={bookmarks}
            membersProgress={membersProgress}
          />
        )}
      </div>

      {/* Modals */}
      {selectedVerseForModal && (
        <VerseModal
          verse={selectedVerseForModal}
          onClose={() => setSelectedVerseForModal(null)}
          userNote={notes.find(
            (n) =>
              n.bookId === selectedVerseForModal.bookId &&
              n.chapter === selectedVerseForModal.chapter &&
              n.verse === selectedVerseForModal.verse
          )}
          userHighlight={highlights.find(
            (h) =>
              h.bookId === selectedVerseForModal.bookId &&
              h.chapter === selectedVerseForModal.chapter &&
              h.verse === selectedVerseForModal.verse
          )}
          isBookmarked={bookmarks.some(
            (b) =>
              b.bookId === selectedVerseForModal.bookId &&
              b.chapter === selectedVerseForModal.chapter &&
              b.verse === selectedVerseForModal.verse
          )}
          onSaveNote={handleSaveNote}
          onDeleteNote={() => {
            const existing = notes.find(
              (n) =>
                n.bookId === selectedVerseForModal.bookId &&
                n.chapter === selectedVerseForModal.chapter &&
                n.verse === selectedVerseForModal.verse
            );
            if (existing) handleDeleteNote(existing.id);
          }}
          onToggleHighlight={(color) => handleToggleHighlight(selectedVerseForModal, color)}
          onToggleBookmark={() => handleToggleBookmark(selectedVerseForModal)}
          onOpenShareModal={() => {
            setSelectedVerseForShare(selectedVerseForModal);
            setSelectedVerseForModal(null);
          }}
          onOpenStrongLexicon={(code) => {
            setActiveStrongCode(code);
            setIsStrongLexiconOpen(true);
            setSelectedVerseForModal(null);
          }}
          onOpenInBibleAI={(v) => {
            setInitialChatPrompt({
              bookName: v.bookName,
              chapter: v.chapter,
              verse: v.verse,
              text: v.text,
            });
            setSelectedVerseForModal(null);
            setActiveTab('chat');
          }}
        />
      )}

      {selectedVerseForShare && (
        <ShareVerseModal
          verse={selectedVerseForShare}
          onClose={() => setSelectedVerseForShare(null)}
        />
      )}

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectVerse={handleSelectVerseFromSearch}
        currentTranslation={currentTranslation}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userProfile={userProfile}
        groups={groups}
        onSaveProfile={handleSaveProfile}
        onLogout={handleLogout}
        onSyncCloud={handleQuickSync}
        isSyncing={isSyncing}
      />

      <ReadingPlanModal
        isOpen={isReadingPlanOpen}
        onClose={() => setIsReadingPlanOpen(false)}
        onSelectPassage={handlePassageJump}
      />

      <StrongLexiconModal
        isOpen={isStrongLexiconOpen}
        onClose={() => setIsStrongLexiconOpen(false)}
        initialCode={activeStrongCode}
        onSelectVerseJump={handlePassageJump}
      />
    </div>
  );
}
