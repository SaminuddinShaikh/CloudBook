const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const {
  toHaveDescription,
} = require("@testing-library/jest-dom/dist/matchers");

//ROUTE 1: Get all the notes : GET api end point : /api/notes/fetchnotes login required
router.get("/fetchnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error, "Internal server error");
  }
});
//ROUTE 2: Get add a new note : POST api end point : /api/notes/addnote login required
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a validate Title").isLength({ min: 3 }),
    body("description", "Pass must be at least 5 words").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Notes({ title, description, tag, user: req.user.id });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error, "Internal server error");
    }
  }
);

//ROUTE 3: update note : put api end point : /api/notes/updatenote login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  //Update note
  try {
    const updatedNote = {};
    if (title) {
      updatedNote.title = title;
    }
    if (toHaveDescription) {
      updatedNote.description = description;
    }
    if (tag) {
      updatedNote.tag = tag;
    }

    //fins the note to be update
    let note = await Notes.findById(req.params.id); //params.is is the id in the end point
    if (!note) {
      res.status(400).send("Not Found");
    }
    //Allow if the user has accesses
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: updatedNote },
      { new: true } //new:true is use to add new notes
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error, "Internal server error");
  }
});

//ROUTE 4: Delete note : delete api end point : /api/notes/deletenote login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  //delete note
  try {
    //find the note to be deleted
    let note = await Notes.findById(req.params.id); //params.is is the id in the end point
    if (!note) {
      res.status(400).send("Not Found");
    }

    //Allow if the user has accesses
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error, "Internal server error");
  }
});

module.exports = router;
