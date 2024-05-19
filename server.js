const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Built-in middleware for parsing JSON bodies

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Define Note model
const NoteSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now }
});

const Note = mongoose.model("Note", NoteSchema);

// Routes
app.get("/", (req, res) => {
    res.send("Hello, this is the root of notes app backend!");
});

// Get All Notes Route
app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Specific Note By ID
app.get("/api/notes/:id", async (req, res) => {
    const noteId = req.params.id;

    try {
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update Note By ID
app.put("/api/notes/:id", async (req, res) => {
    const { title, content, date } = req.body;
    const noteId = req.params.id;

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            noteId,
            { title, content, date },
            { new: true }
        );
        res.json(updatedNote);
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});


// Delete Note By ID
app.delete("/api/notes/:id", async (req, res) => {
    const noteId = req.params.id;

    try {
        await Note.findByIdAndDelete(noteId);
        res.json({ message: "Note deleted sucessfully" });
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
});

// Create Note
app.post("/api/notes", async (req, res) => {
    const { title, content } = req.body

    const note = new Note({ title, content });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
