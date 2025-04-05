import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

export default function TextForm(props) {

    
    const [text, settext] = useState("");
    const [summary, setSummary] = useState("");

    
    const [notes, setNotes] = useState([]);
    const [currentNoteId, setCurrentNoteId] = useState(null);

    useEffect(() => {
        loadNotes();
    }, []);


    const handleUpClick = () => {
        //   console.log("Uppercase was clicked " +text);
        let newText = text.toUpperCase();
        settext(newText);
        props.showAlert("Converted to Uppercase", "success");
    };

    const handleLoClick = () => {
        //   console.log("Lowercase was clicked " +text);
        let newText = text.toLowerCase();
        settext(newText);
        props.showAlert("Converted to Lowercase", "success");
    };

    const handleOnChange = (event) => {
        //   console.log("On Change");
        settext(event.target.value);
    };

    const copyText = () => {
        navigator.clipboard.writeText(text);
        props.showAlert("Text copied to clipboard", "success");
    };

    function textToSpeech() {
        const Speech = new SpeechSynthesisUtterance();
        const message = document.getElementById("myBox").value;
        Speech.lang = 'eng';
        Speech.text = message;
        window.speechSynthesis.speak(Speech);
        props.showAlert("Reading your text", "success");
    }

    const clearText = () => {
        settext("");
    };

    // const handleInputChange = (e) => {
    //   setInputValue(e.target.value);
    // };

    const handleSearch = async () => {
        setSummary('');

        const options = {
            method: 'POST',
            url: 'https://article-extractor-and-summarizer.p.rapidapi.com/summarize-text',
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-key': '42107871a3mshf78a808322b9993p1a53f2jsn58b9bfc6e18a',
                'x-rapidapi-host': 'article-extractor-and-summarizer.p.rapidapi.com'
            },
            data: {
                lang: 'en',
                text: text
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data.summary);
            const finalData = response.data.summary;
            setSummary(finalData);
        } catch (error) {
            console.log(error);
            props.showAlert("Failed to summarize: " + error.message, "danger");
        }
    };



    const handleSavePDF = () => {
        const pdf = new jsPDF();
        pdf.text("Texttool App", 100, 20);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 10;
        const maxLineWidth = pageWidth - margin * 2;

        const lines = pdf.splitTextToSize(text, maxLineWidth);
        pdf.text(lines, margin, 30);

        pdf.save("text.pdf");
    };


    const createNewNote = () => {
        const newNote = {
            id: Date.now(),
            content: "",
            title: `Note ${notes.length + 1}`
        };
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        setCurrentNoteId(newNote.id);
        settext("");
        localStorage.setItem('savedNotes', JSON.stringify(updatedNotes));
        props.showAlert("New note created", "success");
    };

    const syncNotes = () => {
        try {
            if (currentNoteId) {
                const updatedNotes = notes.map(note =>
                    note.id === currentNoteId ? { ...note, content: text } : note
                );
                setNotes(updatedNotes);
                localStorage.setItem('savedNotes', JSON.stringify(updatedNotes));
                props.showAlert("Notes synced successfully", "success");
            }
        } catch (error) {
            props.showAlert("Failed to sync notes: " + error.message, "danger");
        }
    };

    const loadNotes = () => {
        try {
            const savedNotes = localStorage.getItem('savedNotes');
            if (savedNotes) {
                const parsedNotes = JSON.parse(savedNotes);
                setNotes(parsedNotes);
                if (parsedNotes.length > 0) {
                    setCurrentNoteId(parsedNotes[0].id);
                    settext(parsedNotes[0].content);
                }
            }
        } catch (error) {
            props.showAlert("Failed to load notes: " + error.message, "danger");
        }
    };

    const selectNote = (noteId) => {
        const note = notes.find(n => n.id === noteId);
        if (note) {
            setCurrentNoteId(noteId);
            settext(note.content);
        }
    };

    const deleteNote = (noteId) => {
        const updatedNotes = notes.filter(note => note.id !== noteId);
        setNotes(updatedNotes);
        localStorage.setItem('savedNotes', JSON.stringify(updatedNotes));
        if (noteId === currentNoteId) {
            if (updatedNotes.length > 0) {
                selectNote(updatedNotes[0].id);
            } else {
                setCurrentNoteId(null);
                settext("");
            }
        }
        props.showAlert("Note deleted successfully", "success");
    };


    return (
        <>
            <div className="mb-3 my-3" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
                <h1>{props.heading}</h1>

                
                <div className="notes-list mb-3">
                    <button className="btn btn-success mx-1 my-1" onClick={createNewNote}>New Note</button>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                        {notes.map(note => (
                            <div key={note.id} className="d-flex align-items-center">
                                <button
                                    className={`btn ${currentNoteId === note.id ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                                    onClick={() => selectNote(note.id)}
                                >
                                    {note.title}
                                </button>
                                <button
                                    className="btn btn-danger btn-sm ms-1"
                                    onClick={() => deleteNote(note.id)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                
                <form>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            value={text}
                            placeholder='Enter Your Text Here'
                            style={{
                                backgroundColor: props.mode === 'dark' ? 'grey' : 'white',
                                color: props.mode === 'dark' ? 'white' : 'black'
                            }}
                            onChange={handleOnChange}
                            id="myBox"
                            rows="8"
                        ></textarea>
                    </div>
                </form>

                {/* Action Buttons */}
                <div className="my-3">
                    <button className="btn btn-primary my-1" onClick={handleUpClick}>Convert to Uppercase</button>
                    <button className="btn btn-primary mx-1 my-1" onClick={handleLoClick}>Convert to Lowercase</button>
                    <button className="btn btn-primary mx-1 my-1" onClick={copyText}>Copy Text</button>
                    <button className="btn btn-primary mx-1 my-1" onClick={textToSpeech}>Text to Speech</button>
                    <button className="btn btn-primary mx-1 my-1" onClick={clearText}>Clear</button>
                    <button className="btn btn-primary mx-1 my-1" onClick={handleSearch} disabled={!text}>Summarize Text</button>
                    <button className="btn btn-primary mx-1 my-1" onClick={handleSavePDF}>Save Text as PDF</button>
                    <button className="btn btn-success mx-1 my-1" onClick={syncNotes}>Save Note</button>
                </div>
            </div>

            
            <div className="container my-3" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
                <h2>About Your Text</h2>
                <p>{text.trim().split(/\s+/).filter(Boolean).length} Words and {text.length} Characters</p>
                <p>{0.008 * text.trim().split(/\s+/).filter(Boolean).length} Minutes to Read</p>

                {summary && (
                    <>
                        <h3>Text Summary:</h3>
                        <br />
                        <p>{summary}</p>
                    </>
                )}
            </div>
        </>
    );
}
