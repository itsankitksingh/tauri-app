import React, { useState } from 'react'

export default function TextForm(props) {
    const handleUpClick = () => {
        //   console.log("Uppercase was clicked " +text);
        let newText = text.toUpperCase();
        settext(newText);
        props.showAlert("Converted to Uppercase","success");
    }
    const handleLoClick = () => {
        //   console.log("Uppercase was clicked " +text);
        let newText = text.toLowerCase();
        settext(newText);
        props.showAlert("Converted to Lowercase","success");
    }
    const handleOnChange = (event) => {
        //   console.log("On Change");
        settext(event.target.value);
    }
    const copyText = () => {
        navigator.clipboard.writeText(text);
        props.showAlert("Text copied to clipboard","success");
    }
    function textToSpeech(){
        const Speech= new SpeechSynthesisUtterance();
        const message= document.getElementById("myBox").value;
        Speech.lang='eng';
        Speech.text= message;
        window.speechSynthesis.speak(Speech);
        props.showAlert("Reading your text","success");
    }
    const clearText = ()=>{
       settext("");
    }
    const [text, settext] = useState("");
    
    return (
        <>
            <div className="mb-3 my-3" style={{ color: props.mode === 'dark' ? 'white' : 'black' }}>
                <h1>{props.heading}</h1>
                <form>
                    <div className="form-group">
                        <textarea className="form-control" value={text} placeholder='Enter Your Text Here' style={{ backgroundColor: props.mode === 'dark' ? 'grey' : 'white', color: props.mode === 'dark' ? 'white' : 'black' }} onChange={handleOnChange} id="myBox" rows="8"></textarea>
                    </div>
                </form>
                <div className="my-3">
                <button className="btn btn-primary my-1" onClick={handleUpClick}>Convert to Uppercase</button>
                <button className="btn btn-primary mx-1 my-1" onClick={handleLoClick}>Convert to Lowercase</button>
                <button className="btn btn-primary mx-1 my-1" onClick={copyText}>Copy Text</button>
                <button className="btn btn-primary mx-1 my-1" onClick={textToSpeech}>Text to Speech</button>
                <button className="btn btn-primary mx-1 my-1" onClick={clearText}>Clear</button>
                </div>
                
            </div>
            <div className="conatiner my-3" style={{ color: props.mode === 'dark' ? 'white' : 'black' }} >
                <h2>About Your Text</h2>
                <p>{text.split(" ").length} Words and {text.length} Characters</p>
                <p>{0.008 * text.split(" ").length} Minutes to Read </p>
            </div>
        </>
    )

}
