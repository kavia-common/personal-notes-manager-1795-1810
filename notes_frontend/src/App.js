import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import NoteModal from "./components/NoteModal";
import ConfirmModal from "./components/ConfirmModal";
import useNotes from "./hooks/useNotes";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");
  const {
    notes,
    loading,
    fetchNotes,
    saveNote,
    deleteNote,
  } = useNotes();

  // UI state
  const [selectedId, setSelectedId] = useState(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteModalMode, setNoteModalMode] = useState("add"); // "add"|"edit"
  const [noteModalNote, setNoteModalNote] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // THEME
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  // NOTES LIFECYCLE
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSelectNote = useCallback(
    (id) => setSelectedId(id),
    []
  );

  const handleAddNote = useCallback(() => {
    setNoteModalMode("add");
    setNoteModalNote(null);
    setNoteModalOpen(true);
  }, []);

  const handleEditNote = useCallback(() => {
    const note = notes.find(n => n.id === selectedId);
    setNoteModalMode("edit");
    setNoteModalNote(note);
    setNoteModalOpen(true);
  }, [notes, selectedId]);

  const handleSaveNote = async (edited) => {
    await saveNote(edited);
    setNoteModalOpen(false);
    fetchNotes();
    if (!edited.id) { // If created, select it
      setTimeout(() => {
        const stored = JSON.parse(localStorage.getItem("notes") || "[]");
        const sorted = stored.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setSelectedId(sorted[0]?.id || null);
      }, 100);
    }
  };

  const handleDeleteNote = () => setConfirmOpen(true);

  const handleConfirmDelete = async () => {
    if (selectedId) {
      await deleteNote(selectedId);
      setSelectedId(null);
      setConfirmOpen(false);
      fetchNotes();
    }
  };

  const handleCancelDelete = () => setConfirmOpen(false);

  // SEARCH filter
  const filteredNotes = notes.filter(
    n =>
      (n.title || "").toLowerCase().includes(searchValue.toLowerCase()) ||
      (n.body || "").toLowerCase().includes(searchValue.toLowerCase())
  );
  const currentNote = filteredNotes.find(n => n.id === selectedId) || null;

  return (
    <div className="App notes-app-root">
      <button 
        className="theme-toggle" 
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <div className="app-container">
        <Sidebar
          notes={filteredNotes}
          selectedId={selectedId}
          onSelect={handleSelectNote}
          onAdd={handleAddNote}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
        <div className="main">
          {loading ? (
            <main className="main-content-empty" style={{ textAlign: "center", marginTop: "2rem" }}>
              <p>Loading notes...</p>
            </main>
          ) : (
            <MainContent
              note={currentNote}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          )}
        </div>
      </div>
      <NoteModal
        isOpen={noteModalOpen}
        mode={noteModalMode}
        note={noteModalNote}
        onSave={handleSaveNote}
        onCancel={() => setNoteModalOpen(false)}
      />
      <ConfirmModal
        isOpen={confirmOpen}
        message="Delete this note? This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <footer className="app-footer">
        <span>
          Notes App &copy; {new Date().getFullYear()} &mdash; <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">React</a>
        </span>
      </footer>
    </div>
  );
}

export default App;
