import React, { useState } from 'react';
import TextForm from './components/TextForm';
import Navbar from './components/navbar';
import Alert from './components/Alert';


function App() {
  const [mode, setMode] = useState('light');
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type

    })

    setTimeout(() => {
      setAlert(null);
    }, 2000);
  }
  /*  const toggleMode = () => {
      if (mode === 'light') 
      {
        setMode = ('dark');
      }
      else {
        setMode = ('light');
      }
    };*/

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#061944';
      showAlert("Dark mode has been enabled", "success");
    } else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
      showAlert("Light mode has been enabled", "success");
    }
  };

  return (
    <>

      <Navbar title="Textool" about="About" mode={mode} toggleMode={toggleMode} />
      <Alert alert={alert} />
      <div className="container">
        <TextForm heading="Enter the text to analyse" showAlert={showAlert} mode={mode} />

      </div>



    </>
  );
}

export default App;
