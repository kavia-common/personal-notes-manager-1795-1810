import { useState, useCallback } from "react";

// Backend endpoint or integration point (example, to be configured in .env)
const API_BASE = process.env.REACT_APP_NOTES_API_URL || ""; // e.g. "http://localhost:5000/api"

// PUBLIC_INTERFACE
export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notes (stub; replace this with backend integration)
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    // TODO: Replace with API call (GET /notes)
    // For now, we use localStorage for demo/offline
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem("notes") || "[]");
    } catch (e) {
      stored = [];
    }
    setNotes(
      stored
        .map(n => ({
          ...n,
          updatedAt: n.updatedAt || new Date().toISOString(),
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    );
    setLoading(false);
  }, []);

  // PUBLIC_INTERFACE: Add or edit note
  const saveNote = async note => {
    let updatedNote;
    if (note.id) {
      // Edit
      let localNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      localNotes = localNotes.map(n => n.id === note.id ? { ...n, ...note, updatedAt: new Date().toISOString() } : n);
      localStorage.setItem("notes", JSON.stringify(localNotes));
      updatedNote = localNotes.find(n => n.id === note.id);
    } else {
      // New
      const id = Math.random().toString(36).slice(2, 10);
      updatedNote = { ...note, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      const localNotes = [...(JSON.parse(localStorage.getItem("notes") || "[]")), updatedNote];
      localStorage.setItem("notes", JSON.stringify(localNotes));
    }
    await fetchNotes();
    return updatedNote;
  };

  // PUBLIC_INTERFACE: Delete note
  const deleteNote = async (id) => {
    let localNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    localNotes = localNotes.filter(n => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(localNotes));
    await fetchNotes();
  };

  return {
    notes,
    loading,
    fetchNotes,
    saveNote,
    deleteNote
  };
}
