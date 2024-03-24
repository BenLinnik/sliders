import React from 'react';
import './Slider.css';

function Slider({ title, min, max, step, value, onChange, unit }) {
  // Direkte Verwendung von 'value' und 'onChange' aus den Props

  return (
    <div className="slider-container">
      <label className="slider-label">
        <span>{title}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          className="slider"
          onChange={onChange}
        />
        <input
          type="number"
          value={value}
          className="slider-value"
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
        {unit}
      </label>
    </div>
  );
}

export default Slider;
