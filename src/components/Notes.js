import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import noteContext from "../context/notes/noteContext";
import { AddNote } from "./AddNote";
import Noteitem from "./Noteitem";

export default function Notes() {
  const notesContext = useContext(noteContext);
  const { notes, getNotes, editNote } = notesContext;
  let navigate = useNavigate();

  const [note, setNote] = useState({
    id: "",
    newTitle: "",
    newDescription: "",
    newTag: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      newTitle: currentNote.title,
      newDescription: currentNote.description,
      newTag: currentNote.tag,
    });
  };

  const handleUpdateNote = (e) => {
    // console.log("Updating the note", note);
    editNote(note.id, note.newTitle, note.newDescription, note.newTag);
    refClose.current.click();
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      <AddNote />
      {/* EDIT NOTE MODAL STARTS */}
      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="newTitle" className="form-label">
                    New Title
                  </label>
                  <input
                    onChange={onChange}
                    value={note.newTitle}
                    type="text"
                    className="form-control"
                    id="newTitle"
                    name="newTitle"
                    aria-describedby="emailHelp"
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newDescription" className="form-label">
                    New Description
                  </label>
                  <input
                    onChange={onChange}
                    value={note.newDescription}
                    type="text"
                    className="form-control"
                    id="newDescription"
                    name="newDescription"
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newTag" className="form-label">
                    New Tag
                  </label>
                  <input
                    onChange={onChange}
                    value={note.newTag}
                    type="text"
                    className="form-control"
                    id="newTag"
                    name="newTag"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdateNote}
                disabled={note.newTitle.length < 5 || note.newDescription.length < 5}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* EDIT NOTE MODAL ENDS*/}
      {/* {console.log(notes)} */}
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className="container">{notes.length === 0 && "You have no notes"}</div>
        {notes.map((note) => {
          return <Noteitem key={note._id} note={note} updateNote={updateNote} />;
        })}
      </div>
    </>
  );
}
