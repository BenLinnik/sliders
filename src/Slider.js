import React from 'react';
import './Slider.css';

function Slider({ title, min, max, step, value, onChange, unit }) {
  return (
    <div className="slider-container">
      <div className="slider-title">{title}</div>
      <div className="slider-wrapper">
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
          value={value.toFixed(1)}
          className="slider-value"
          onChange={onChange}
          min={min}
          max={max}
          step={step}
        />
        {unit}
      </div>
    </div>
  );
}

export default Slider;
