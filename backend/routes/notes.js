const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");

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
module.exports = router;
