import React, { useState } from "react";
import NoteContext from "./noteContext";
//import noteContext from "./noteContext";

const NoteState = (props) => {
    const notesInitial =
        [
            {
                "_id": "62f5775833be1621fbe9ae21",
                "user": "62f411329ef43204adee0fd9",
                "title": "my title",
                "description": "hello ",
                "tag": "personal",
                "date": "2022-08-11T21:40:40.770Z",
                "__v": 0
            },
            {
                "_id": "62f857e7641cd2871f132e41",
                "user": "62f411329ef43204adee0fd9",
                "title": "my title",
                "description": "hello ",
                "tag": "personal",
                "date": "2022-08-14T02:03:19.106Z",
                "__v": 0
            },
            {
                "_id": "62f85979641cd2871f132e45",
                "user": "62f411329ef43204adee0fd9",
                "title": "my title up[fsdat",
                "description": "hello ",
                "tag": "personal",
                "date": "2022-08-14T02:10:01.452Z",
                "__v": 0
            },
            {
                "_id": "62f884cbaddde6920698eada",
                "user": "62f411329ef43204adee0fd9",
                "title": "my title updtaed 2",
                "description": "hello updated 3 4",
                "tag": "personal updated",
                "date": "2022-08-14T05:14:51.452Z",
                "__v": 0
            }
        ]

    const [notes, setNotes] = useState(notesInitial)


    //add a note
    const addNote = (title, description, tag) => {
        //TODO API CALL
        console.log("adding a new note")
        const note = {
            "_id": "62f884cbaddde6920698eada",
            "user": "62f411329ef43204adee0fd95",
            "title": title,
            "description": description,
            "tag": tag,
            "date": "2022-08-14T05:14:51.452Z",
            "__v": 0
        }
        setNotes(notes.concat(note))

    }
    //delete a note

    const deleteNote = () => {

    }
    //edit a note 
    const editNote = () => {

    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;