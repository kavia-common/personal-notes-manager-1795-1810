import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
function NoteModal({ isOpen, mode, note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || "");
  const [body, setBody] = useState(note?.body || "");
  const firstInput = useRef();

  useEffect(() => {
    setTitle(note?.title || "");
    setBody(note?.body || "");
  }, [note, isOpen]);

  useEffect(() => {
    if (isOpen && firstInput.current) {
      firstInput.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!title.trim() && !body.trim()) {
      return;
    }
    onSave({ ...note, title: title.trim(), body });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} tabIndex={-1}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <form onSubmit={handleSubmit}>
          <h2>{mode === "edit" ? "Edit Note" : "New Note"}</h2>
          <div className="modal-fields">
            <input
              ref={firstInput}
              className="modal-title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={80}
            />
            <textarea
              className="modal-body"
              placeholder="Body"
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={8}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn-primary">{mode === "edit" ? "Save Changes" : "Add Note"}</button>
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

NoteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(["add", "edit"]).isRequired,
  note: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default NoteModal;
