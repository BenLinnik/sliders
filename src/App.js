import React, { useState } from 'react';
import Slider from './Slider';
import './App.css';

function App() {
  const MIN_JAHRESTAGESINVEST = 40;
  const MAX_JAHRESTAGESINVEST = 200;
  const MIN_GEWINNBETEILIGUNG = 0.5;
  const MAX_GEWINNBETEILIGUNG = 10;
  const MIN_STUNDENSATZ = 0;
  const MAX_STUNDENSATZ = 120;

  const FAKTOR_JAHRESAUFWAND = 9;  // x
  const FAKTOR_BETEILIGUNG = 860;  // y
  const FAKTOR_STUNDENSATZ = 70;  // z
  const KONSTANTE = -9660;

  const [jahrestagesinvest, setJahrestagesinvest] = useState(140);
  const [gewinnbeteiligung, setGewinnbeteiligung] = useState(6);
  const [stundensatz, setStundensatz] = useState(46.3);

  const [fixJahrestagesinvest, setFixJahrestagesinvest] = useState(false);
  const [fixGewinnbeteiligung, setFixGewinnbeteiligung] = useState(false);
  const [fixStundensatz, setFixStundensatz] = useState(false);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const calculateG = (J, S) => clamp((-KONSTANTE - FAKTOR_JAHRESAUFWAND * J - FAKTOR_STUNDENSATZ * S) / FAKTOR_BETEILIGUNG, MIN_GEWINNBETEILIGUNG, MAX_GEWINNBETEILIGUNG);
  const calculateJ = (G, S) => clamp((-KONSTANTE - FAKTOR_BETEILIGUNG * G - FAKTOR_STUNDENSATZ * S) / FAKTOR_JAHRESAUFWAND, MIN_JAHRESTAGESINVEST, MAX_JAHRESTAGESINVEST);
  const calculateS = (J, G) => clamp((-KONSTANTE - FAKTOR_JAHRESAUFWAND * J - FAKTOR_BETEILIGUNG * G) / FAKTOR_STUNDENSATZ, MIN_STUNDENSATZ, MAX_STUNDENSATZ);

  const isValidOnPlane = (J, G, S) => Math.abs(FAKTOR_JAHRESAUFWAND * J + FAKTOR_BETEILIGUNG * G + FAKTOR_STUNDENSATZ * S + KONSTANTE) < 0.1;

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
          title="Jahrestagesinvest (um Beiteiligung zu erhalten)"
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
      <p></p>
      <div>
      <Slider
        title="Beteiligung"
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
      <p></p>
      <div>
      <Slider
        title="Stundensatz"
        min={MIN_STUNDENSATZ}
        max={MAX_STUNDENSATZ}
        step={1}
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
