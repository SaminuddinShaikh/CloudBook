import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const notesInitialList = [];

  const [notes, setNotes] = useState(notesInitialList);

  //get all notes
  const getNotes = async () => {
    //Api call
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    setNotes(json);
  };

  //Add note
  const addNote = async (title, description, tag) => {
    //Api call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    const note = await response.json();
    setNotes(notes.concat(note));
    // console.log("new note added");
    // const sampleNote = {
    //   _id: "631d7cb40197725be24bf9ab33",
    //   user: "6311e92ae36ade36a81406dc",
    //   title: title,
    //   description: description,
    //   tag: tag,
    //   date: "2022-09-11T06:14:08.810Z",
    //   __v: 0,
    // };
    // setNotes(notes.concat(sampleNote));
  };

  //Delete note
  const deleteNote = async (id) => {
    //Api Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json;
    // console.log(`deleting note with id: ${id}`);
    const newNotesList = notes.filter((note) => note._id !== id);
    setNotes(newNotesList);
  };

  //Edit note
  const editNote = async (id, title, description, tag) => {
    //Api Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
    });
    // const json = await response.json; // parses JSON response into native JavaScript objects
    let newNotes = JSON.parse(JSON.stringify(notes));

    //logic
    for (let i = 0; i < newNotes.length; i++) {
      const noteToUpdate = newNotes[i];
      if (noteToUpdate._id === id) {
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
