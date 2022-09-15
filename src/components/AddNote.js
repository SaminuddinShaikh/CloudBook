import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

export const AddNote = () => {
  const notesContext = useContext(noteContext);
  const { addNote } = notesContext;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("");

  //   const newNote = { title, desc, tag };

  const handleAddNote = (e) => {
    e.preventDefault();
    addNote(title, desc, tag);
    setTitle("");
    setDesc("");
    setTag("");
  };

  return (
    <div>
      <div className="container my-3">
        <h1>Add a Note</h1>
        <form onSubmit={handleAddNote}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="desc" className="form-label">
              Description
            </label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              type="text"
              className="form-control"
              id="desc"
              name="desc"
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="desc" className="form-label">
              Tag
            </label>
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              type="text"
              className="form-control"
              id="desc"
              name="desc"
            />
          </div>
          <button
            disabled={title.length < 5 || desc.length < 5}
            type="submit"
            className="btn btn-primary"
          >
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};
