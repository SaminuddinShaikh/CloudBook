import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

export default function Noteitem({ note, updateNote }) {
  const notesContext = useContext(noteContext);
  const { deleteNote } = notesContext;

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <FontAwesomeIcon
              className="icon-cursor mx-2"
              icon={faTrash}
              onClick={() => {
                deleteNote(note._id);
              }}
            />
            <FontAwesomeIcon
              className="icon-cursor mx-2"
              icon={faPenToSquare}
              onClick={() => {
                updateNote(note);
              }}
            />
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
}
