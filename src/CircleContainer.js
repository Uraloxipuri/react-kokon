// src/CircleContainer.js

import React, { useState } from 'react';
import Circle from './Circle';

function CircleContainer() {
  const [circles, setCircles] = useState([{}]);

  const addCircle = () => {
    setCircles([...circles, {}]);
  };

  return (
    <div id="circle-container">
      {circles.map((_, index) => (
        <Circle key={index} />
      ))}
      <button id="add-circle" onClick={addCircle}>
        +
      </button>
    </div>
  );
}

export default CircleContainer;
