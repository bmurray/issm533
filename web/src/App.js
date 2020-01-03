import React from 'react';
import './App.css';
import Tabs from './Tabs/Tabs';
import Caesar from './Modules/Caesar/Caesar'
import Substitution from './Modules/Substitution/Substitution'
import Vigenere from './Modules/Vigenere/Vigenere'

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function App() {


  const tabs = [
    { name: "Caesar", tab: (<Caesar alphabet={alphabet} />) },
    { name: "Substitition", tab: (<Substitution alphabet={alphabet} />) },
    { name: "Vigenère", tab: (<Vigenere alphabet={alphabet} />) },

  ]

  return (
    <div className="App">
      <Tabs tabs={tabs} />
    </div>
  );
}

export default App;
