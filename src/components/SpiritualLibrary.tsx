import React, { useState } from 'react';
import {
  Library,
  Upload,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Search,
  Clock,
  Save,
  X,
  FileText,
  Bookmark,
  CheckCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { SpiritualBook } from '../types';
import { StorageService } from '../services/storage';

export const SpiritualLibrary: React.FC = () => {
  const [books, setBooks] = useState<SpiritualBook[]>(() => StorageService.getBooks());
  const [selectedBook, setSelectedBook] = useState<SpiritualBook | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Reader customizations inside modal
  const [readerFontSize, setReaderFontSize] = useState(18);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light'>('dark');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<SpiritualBook | null>(null);

  // Form fields for Create / Edit
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookCategory, setBookCategory] = useState('Enseignement & Discipulat');
  const [bookDescription, setBookDescription] = useState('');
  const [bookContent, setBookContent] = useState('');

  const CATEGORIES = [
    'Enseignement & Discipulat',
    'Prière & Intercession',
    'Foi & Guérison',
    'Vie Chrétienne & Sanctification',
    'Théologie & Étude Biblique',
    'Témoignages & Révélations',
    'Jeunesse & Famille',
  ];

  const resetForm = () => {
    setBookTitle('');
    setBookAuthor('');
    setBookCategory('Enseignement & Discipulat');
    setBookDescription('');
    setBookContent('');
    setEditingBook(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (book: SpiritualBook, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBook(book);
    setBookTitle(book.title);
    setBookAuthor(book.author);
    setBookCategory(book.category);
    setBookDescription(book.description);
    setBookContent(book.chapters[0]?.content || '');
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Voulez-vous vraiment supprimer l'ouvrage "${title}" de votre bibliothèque ?`)) {
      StorageService.deleteBook(id);
      const updated = StorageService.getBooks();
      setBooks(updated);
      if (selectedBook?.id === id) {
        setSelectedBook(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBookTitle(file.name.replace(/\.[^/.]+$/, ''));
    setBookAuthor('Auteur importé');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setBookContent(text);
      setBookDescription(`Ouvrage importé depuis le fichier ${file.name} (${Math.round(file.size / 1024)} Ko).`);
    };
    reader.readAsText(file);
  };

  const handleSaveBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    const estimatedPages = Math.max(1, Math.round((bookContent.length || 1200) / 1200));
    const estimatedMinutes = Math.max(3, Math.round((bookContent.length || 1200) / 800));

    if (editingBook) {
      // UPDATE
      StorageService.updateBook(editingBook.id, {
        title: bookTitle.trim(),
        author: bookAuthor.trim() || 'Auteur chrétien',
        category: bookCategory,
        description: bookDescription.trim(),
        pages: estimatedPages,
        readMinutes: estimatedMinutes,
        chapters: [
          {
            title: 'Texte Intégral',
            content: bookContent.trim() || 'Contenu en cours de rédaction...',
          },
        ],
      });
    } else {
      // CREATE
      StorageService.createBook({
        title: bookTitle.trim(),
        author: bookAuthor.trim() || 'Auteur chrétien',
        category: bookCategory,
        description: bookDescription.trim() || 'Livre spirituel pour l’édification et le discipulat.',
        pages: estimatedPages,
        readMinutes: estimatedMinutes,
        chapters: [
          {
            title: 'Texte Intégral',
            content: bookContent.trim() || 'Contenu du livre...',
          },
        ],
      });
    }

    const updated = StorageService.getBooks();
    setBooks(updated);
    setIsAddModalOpen(false);
    resetForm();
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-sky-600 font-semibold font-cinzel">
              Littérature & Ressources Spirituelles (CRUD)
            </span>
            <h1 className="font-cinzel text-3xl font-bold text-slate-900 mt-1">
              Bibliothèque Spirituelle
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ajoutez, importez, modifiez et lisez vos livres chrétiens, traités et manuels de discipulat.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 text-sky-100" />
              <span>Ajouter un Livre</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-sky-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur ou thème..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === 'ALL'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous ({books.length})
            </button>
            {CATEGORIES.slice(0, 3).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-sky-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-50 border border-dashed border-slate-300 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
              <Library className="h-6 w-6 text-sky-500" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-slate-900">
                {books.length === 0
                  ? 'Votre bibliothèque spirituelle est vide'
                  : 'Aucun livre ne correspond à votre recherche'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                {books.length === 0
                  ? 'Ajoutez votre premier livre manuellement ou importez un document (.txt, .md, .pdf) pour commencer votre lecture.'
                  : 'Essayez un autre mot-clé ou réinitialisez les filtres.'}
              </p>
            </div>
            {books.length === 0 && (
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4 text-sky-100" />
                <span>Ajouter un premier ouvrage</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-3xl bg-white border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between overflow-hidden group shadow-xs hover:shadow-md"
              >
                <div className="p-5 space-y-3">
                  {/* Category Pill & Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                      {book.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEdit(book, e)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                        title="Modifier l'ouvrage"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(book.id, book.title, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer l'ouvrage"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-cinzel text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-sky-600 font-medium mt-0.5">par {book.author}</p>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>
                </div>

                <div className="p-5 pt-0 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3 text-sky-500" />
                      <span>{book.pages} pages</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-sky-500" />
                      <span>~{book.readMinutes} min</span>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setCurrentChapterIndex(0);
                    }}
                    className="w-full py-2.5 bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white rounded-xl text-xs font-semibold border border-sky-200 hover:border-transparent transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Lire l'ouvrage</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: CREATE / EDIT BOOK (CRUD)                         */}
        {/* ======================================================== */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-xl rounded-3xl bg-white border border-sky-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <h3 className="font-cinzel text-base font-bold text-slate-900">
                  {editingBook ? 'Modifier l’Ouvrage' : 'Ajouter un Livre Spirituel'}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick file import option */}
              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-dashed border-sky-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Upload className="h-4 w-4 text-sky-500 shrink-0" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">Importer un fichier texte</span>
                    <p className="text-[10px] text-slate-500">Remplissage automatique du titre et texte</p>
                  </div>
                </div>
                <label className="cursor-pointer px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-xl text-xs font-semibold border border-sky-300 transition-colors">
                  <span>Choisir un fichier</span>
                  <input
                    type="file"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <form onSubmit={handleSaveBookSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Titre de l'ouvrage <span className="text-sky-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: La Puissance de la Prière Secrète"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Auteur
                    </label>
                    <input
                      type="text"
                      placeholder="Nom de l'auteur"
                      value={bookAuthor}
                      onChange={(e) => setBookAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catégorie
                    </label>
                    <select
                      value={bookCategory}
                      onChange={(e) => setBookCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description & Résumé
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Bref résumé de l'ouvrage et de son impact spirituel..."
                    value={bookDescription}
                    onChange={(e) => setBookDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contenu Intégral / Texte de lecture <span className="text-sky-500">*</span>
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Saisissez ou collez ici le texte du livre..."
                    value={bookContent}
                    onChange={(e) => setBookContent(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-serif leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold shadow cursor-pointer"
                  >
                    {editingBook ? 'Enregistrer les modifications' : 'Ajouter à la bibliothèque'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL: FULL E-READER VIEW                                */}
        {/* ======================================================== */}
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            <div
              className={`w-full max-w-4xl h-[92vh] rounded-2xl flex flex-col overflow-hidden border shadow-2xl transition-colors duration-300 ${
                readerTheme === 'sepia'
                  ? 'bg-[#F4EFE6] text-stone-900 border-stone-300'
                  : readerTheme === 'light'
                  ? 'bg-slate-50 text-slate-900 border-slate-300'
                  : 'bg-[#0E2442] text-slate-100 border-slate-700'
              }`}
            >
              {/* Reader Header */}
              <div
                className={`px-6 py-4 border-b flex items-center justify-between gap-4 ${
                  readerTheme === 'sepia'
                    ? 'bg-[#EAE4D7] border-stone-300'
                    : readerTheme === 'light'
                    ? 'bg-slate-100 border-slate-200'
                    : 'bg-[#0A192F] border-slate-800'
                }`}
              >
                <div>
                  <h3 className="font-cinzel text-base font-bold truncate max-w-md">
                    {selectedBook.title}
                  </h3>
                  <p className="text-xs opacity-70">par {selectedBook.author}</p>
                </div>

                {/* Reader Controls */}
                <div className="flex items-center gap-3">
                  {/* Font Size Adjuster */}
                  <div className="flex items-center gap-1 text-xs font-mono font-bold">
                    <button
                      onClick={() => setReaderFontSize((prev) => Math.max(14, prev - 2))}
                      className="px-2 py-1 rounded bg-black/10 hover:bg-black/20"
                    >
                      A-
                    </button>
                    <span className="px-1">{readerFontSize}px</span>
                    <button
                      onClick={() => setReaderFontSize((prev) => Math.min(28, prev + 2))}
                      className="px-2 py-1 rounded bg-black/10 hover:bg-black/20"
                    >
                      A+
                    </button>
                  </div>

                  {/* Theme toggles */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setReaderTheme('dark')}
                      className={`p-1.5 rounded ${
                        readerTheme === 'dark' ? 'bg-orange-500 text-white' : 'hover:bg-black/10'
                      }`}
                      title="Mode Sombre"
                    >
                      <Moon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setReaderTheme('sepia')}
                      className={`p-1.5 rounded ${
                        readerTheme === 'sepia' ? 'bg-amber-700 text-white' : 'hover:bg-black/10'
                      }`}
                      title="Mode Sépia"
                    >
                      <span className="text-xs font-bold font-serif">S</span>
                    </button>
                    <button
                      onClick={() => setReaderTheme('light')}
                      className={`p-1.5 rounded ${
                        readerTheme === 'light' ? 'bg-slate-700 text-white' : 'hover:bg-black/10'
                      }`}
                      title="Mode Clair"
                    >
                      <Sun className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-1.5 hover:bg-black/10 rounded"
                    title="Imprimer"
                  >
                    <Printer className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setSelectedBook(null)}
                    className="p-1.5 hover:bg-black/10 rounded"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Reader Body */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 font-serif leading-loose space-y-6">
                <div className="max-w-2xl mx-auto space-y-6" style={{ fontSize: `${readerFontSize}px` }}>
                  <div className="border-b pb-4 mb-6 opacity-60 text-xs uppercase tracking-widest font-cinzel">
                    {selectedBook.chapters[currentChapterIndex]?.title || 'Lecture intégrale'}
                  </div>

                  <div className="whitespace-pre-wrap select-text">
                    {selectedBook.chapters[currentChapterIndex]?.content || selectedBook.description}
                  </div>
                </div>
              </div>

              {/* Reader Footer */}
              <div
                className={`px-6 py-3 border-t text-xs flex items-center justify-between ${
                  readerTheme === 'sepia'
                    ? 'bg-[#EAE4D7] border-stone-300'
                    : readerTheme === 'light'
                    ? 'bg-slate-100 border-slate-200'
                    : 'bg-[#0A192F] border-slate-800'
                }`}
              >
                <span className="opacity-70">
                  {selectedBook.pages} pages • Lecture spirituelle
                </span>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-3 py-1 bg-orange-600 text-white font-semibold rounded-lg"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
