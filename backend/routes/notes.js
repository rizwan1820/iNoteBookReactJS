const express = require('express');
const router = express.Router()
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');



//ROUTE 1: GET all the notes using: GET"/api/auth/getuser" .Login Require


router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server error");
    }
})

//ROUTE 2: Add new  notes using: POST"/api/auth/addnotes" .Login Require

router.post('/addnotes', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be atleast 5 characters').isLength({ min: 5 }),

], async (req, res) => {
    try {

        //if there are errors return bad request and the errors
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save();
        res.json(savedNote)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server error");
    }
})

//ROUTE 3:Update an existing  notes using: POST"/api/auth/updatenote" .Login Require

router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //create new note object
        const newNote = {};
        if (description) {
            newNote.description = description;
        }
        if (title) {
            newNote.title = title;
        }
        if (tag) {
            newNote.tag = tag;
        }

        //find note to updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server error");
    }



})

//ROUTE 4:Delete  an existing  notes using: Delete"/api/auth/deletenote" .Login Require

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {

        //find note to delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found") }

        //Allo deletion if user own this note 
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interval server error");
    }

})

module.exports = router