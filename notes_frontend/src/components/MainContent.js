import React from "react";
import PropTypes from "prop-types";

const MainContent = ({ note, onEdit, onDelete }) => {
  if (!note) {
    return (
      <main className="main-content-empty">
        <p>Select a note to view details.</p>
      </main>
    );
  }
  return (
    <main className="main-content">
      <h1 className="note-title-main">{note.title}</h1>
      <div className="note-dates">
        <span>
          Updated: {note.updatedAt ? (new Date(note.updatedAt)).toLocaleString() : ""}
        </span>
      </div>
      <div className="note-body">
        {note.body ? note.body.split("\n").map((line, i) => <p key={i}>{line}</p>) : <p><em>(Empty note)</em></p>}
      </div>
      <div className="main-content-actions">
        <button className="btn-primary" onClick={onEdit}>Edit</button>
        <button className="btn-danger" onClick={onDelete}>Delete</button>
      </div>
    </main>
  );
};

MainContent.propTypes = {
  note: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MainContent;
