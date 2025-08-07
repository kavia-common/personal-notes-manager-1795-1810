import React from "react";
import PropTypes from "prop-types";

const Sidebar = ({ notes, selectedId, onSelect, onAdd, searchValue, onSearchChange }) => (
  <aside className="sidebar">
    <div className="sidebar-header">
      <h2>Notes</h2>
      <button className="btn-accent" onClick={onAdd}>＋ New</button>
    </div>
    <input
      className="search-input"
      type="text"
      placeholder="Search notes..."
      value={searchValue}
      onChange={e => onSearchChange(e.target.value)}
    />
    <ul className="notes-list">
      {notes.length === 0 && (
        <li className="notes-list-empty">No notes found.</li>
      )}
      {notes.map(note => (
        <li
          key={note.id}
          className={`notes-list-item${note.id === selectedId ? " selected" : ""}`}
          onClick={() => onSelect(note.id)}
          tabIndex={0}
        >
          <div className="note-title">{note.title || <em>(Untitled)</em>}</div>
          <div className="note-date">{note.updatedAt ? (new Date(note.updatedAt)).toLocaleDateString() : ""}</div>
        </li>
      ))}
    </ul>
  </aside>
);

Sidebar.propTypes = {
  notes: PropTypes.array.isRequired,
  selectedId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
};

export default Sidebar;
