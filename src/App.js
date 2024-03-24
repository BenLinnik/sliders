import React, { useState } from 'react';
import Slider from './Slider';
import './App.css';

function App() {
  const MIN_JAHRESTAGESINVEST = 50;
  const MAX_JAHRESTAGESINVEST = 210;
  const MIN_GEWINNBETEILIGUNG = 1;
  const MAX_GEWINNBETEILIGUNG = 10;
  const MIN_STUNDENSATZ = 0;
  const MAX_STUNDENSATZ = 120;

  const [jahrestagesinvest, setJahrestagesinvest] = useState(100);
  const [gewinnbeteiligung, setGewinnbeteiligung] = useState(5);
  const [stundensatz, setStundensatz] = useState(50.65);

  const [fixJahrestagesinvest, setFixJahrestagesinvest] = useState(false);
  const [fixGewinnbeteiligung, setFixGewinnbeteiligung] = useState(false);
  const [fixStundensatz, setFixStundensatz] = useState(false);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const calculateG = (J, S) => clamp((10100 + 36 * J - 153 * S) / 1190, MIN_GEWINNBETEILIGUNG, MAX_GEWINNBETEILIGUNG);
  const calculateJ = (G, S) => clamp((10100 - 1190 * G - 153 * S) / -36, MIN_JAHRESTAGESINVEST, MAX_JAHRESTAGESINVEST);
  const calculateS = (J, G) => clamp((10100 + 36 * J - 1190 * G) / 153, MIN_STUNDENSATZ, MAX_STUNDENSATZ);

  const isValidOnPlane = (J, G, S) => Math.abs(-36 * J + 1190 * G + 153 * S - 10100) < 0.1;

  function adjustValuesToPlane(J, G, S, fixJ, fixG, fixS) {
    if (!fixJ && !fixG && !fixS) {
      return { J, G, S };
    }

    if (fixJ && fixG) {
      S = calculateS(J, G);
    } else if (fixJ && fixS) {
      G = calculateG(J, S);
    } else if (fixG && fixS) {
      J = calculateJ(G, S);
    } else if (fixJ) {
      G = calculateG(J, S);
      S = calculateS(J, G);
    } else if (fixG) {
      J = calculateJ(G, S);
      S = calculateS(J, G);
    } else if (fixS) {
      J = calculateJ(G, S);
      G = calculateG(J, S);
    }

    return {
      J: clamp(J, MIN_JAHRESTAGESINVEST, MAX_JAHRESTAGESINVEST),
      G: clamp(G, MIN_GEWINNBETEILIGUNG, MAX_GEWINNBETEILIGUNG),
      S: clamp(S, MIN_STUNDENSATZ, MAX_STUNDENSATZ)
    };
  }


  // Similar structure for handleJahrestagesinvestChange, handleGewinnbeteiligungChange, handleStundensatzChange
  const handleJahrestagesinvestChange = (newValue) => {
    if (!fixJahrestagesinvest) {
      newValue = Number(newValue);
      let { J, G, S } = adjustValuesToPlane(newValue, gewinnbeteiligung, stundensatz, true, fixGewinnbeteiligung, fixStundensatz);

      if (isValidOnPlane(J, G, S)) {
        setJahrestagesinvest(J);
        if (!fixStundensatz) setStundensatz(S);
        if (!fixGewinnbeteiligung) setGewinnbeteiligung(G);
      }
    }
  };

  const handleGewinnbeteiligungChange = (newValue) => {
    if (!fixGewinnbeteiligung) {
      newValue = Number(newValue);
      let { J, G, S } = adjustValuesToPlane(jahrestagesinvest, newValue, stundensatz, fixJahrestagesinvest, true, fixStundensatz);

      if (isValidOnPlane(J, G, S)) {
        setGewinnbeteiligung(G);
        if (!fixStundensatz) setStundensatz(S);
        if (!fixJahrestagesinvest) setJahrestagesinvest(J);
      }
    }
  };

  const handleStundensatzChange = (newValue) => {
    if (!fixStundensatz) {
      newValue = Number(newValue);
      let { J, G, S } = adjustValuesToPlane(jahrestagesinvest, gewinnbeteiligung, newValue, fixJahrestagesinvest, fixGewinnbeteiligung, true);

      if (isValidOnPlane(J, G, S)) {
        setStundensatz(S);
        if (!fixGewinnbeteiligung) setGewinnbeteiligung(G);
        if (!fixJahrestagesinvest) setJahrestagesinvest(J);
      }
    }
  };


  return (
    <div className="App">
      <h1>Meine Schieberegler</h1>
      <div>
        <Slider
          title="Jahrestagesinvest"
          min={MIN_JAHRESTAGESINVEST}
          max={MAX_JAHRESTAGESINVEST}
          step={1}
          value={jahrestagesinvest}
          onChange={e => handleJahrestagesinvestChange(e.target.value)}
          unit=" Tage"
        />
        <input
          type="checkbox"
          checked={fixJahrestagesinvest}
          onChange={() => setFixJahrestagesinvest(!fixJahrestagesinvest)}
        />
        Jahrestagesinvest fixieren
      </div>
      <div>
      <Slider
        title="Gewinnbeteiligung"
        min={MIN_GEWINNBETEILIGUNG}
        max={MAX_GEWINNBETEILIGUNG}
        step={0.1}
        value={gewinnbeteiligung}
        onChange={e => handleGewinnbeteiligungChange(e.target.value)}
        unit="%"
      />
        <input
          type="checkbox"
          checked={fixGewinnbeteiligung}
          onChange={() => setFixGewinnbeteiligung(!fixGewinnbeteiligung)}
        />
        Gewinnbeteiligung fixieren
      </div>
      <div>
      <Slider
        title="Stundensatz"
        min={MIN_STUNDENSATZ}
        max={MAX_STUNDENSATZ}
        step={0.01}
        value={stundensatz}
        onChange={e => handleStundensatzChange(e.target.value)}
        unit=" Euro"
      />
        <input
          type="checkbox"
          checked={fixStundensatz}
          onChange={() => setFixStundensatz(!fixStundensatz)}
        />
        Stundensatz fixieren
      </div>
    </div>
  );
}

export default App;
