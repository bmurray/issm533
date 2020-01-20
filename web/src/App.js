import React from 'react';
import './App.css';
import Tabs from './Tabs/Tabs';
import Caesar from './Modules/Caesar/Caesar'
import Substitution from './Modules/Substitution/Substitution'
import Vigenere from './Modules/Vigenere/Vigenere'
import Hashcat from './Modules/Hashcat/Hashcat'
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"


function App() {


  var loc = window.location, host, secure;
  if (loc.protocol === "https:") {
    secure = true;
  } else {
    secure = false;
  }



  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    console.log("Development")
    host = "localhost:8080"
  } else {
    // production code
    console.log("Production")
    host = loc.host
  }

  const wk1 = [
    { name: "Caesar", tab: (<Caesar alphabet={alphabet} />) },
    { name: "Substitition", tab: (<Substitution alphabet={alphabet} />) },
    { name: "Vigenère", tab: (<Vigenere alphabet={alphabet} />) },
  ]

  const wk3 = [
    { name: "Hashcat", tab: (<Hashcat secure={secure} host={host} />) }
  ]

  const tabs = [
    { name: "Week 1", tab: (<Tabs tabs={wk1} />) },
    { name: "Week 3", tab: (<Tabs tabs={wk3} />) },
  ]
  return (
    <div className="App">
      <Tabs tabs={tabs} defaultValue="Week 3" />
    </div>
  );
}

export default App;
