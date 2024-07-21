import React, { useState } from "react";
import noteContext from "./noteContext";
const NoteState = (props) => {
    const host = "https://inotebook-api.vercel.app"
    const notesInitial = []


    const [note, setNotes] = useState(notesInitial);

    const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'authtoken': localStorage.getItem('token')
            },
        });
        let data = await response.json();
        setNotes(data);

    }

    const addNote = async (title, description, tag) => {
        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'authtoken': localStorage.getItem('token')
            },
            body: JSON.stringify({
                title, description, tag
            })
        });

        const n = await response.json();
        setNotes(note.concat(n));
    }
    const deleteNote = async (id) => {

        const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'authtoken': localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    }
    const editNote = async (id, title, description, tag) => {

        const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'authtoken': localStorage.getItem('token')
            },
            body: JSON.stringify({
                title, description, tag
            })
        });
        const json = response.json()
        let newNotes = JSON.parse(JSON.stringify(note))
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes)
    }
    return (
        <noteContext.Provider value={{ note, addNote, deleteNote, editNote, getNotes }} >
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;
