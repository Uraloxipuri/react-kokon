// src/Circle.js
import React, { useState, useRef } from 'react';

function Circle() {
  const [name, setName] = useState('Enter Name');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPaleBlue, setIsPaleBlue] = useState(false);
  const [isBlinkingRed, setIsBlinkingRed] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleCircleClick = (e) => {
    if (e.target.classList.contains('circle-text')) {
      setIsEditingName(true);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleNameBlur = () => {
    if (name.trim() === '') {
      setName('Enter Name');
    }
    setIsEditingName(false);
    setIsPaleBlue(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  const handleSectorAction = (action) => {
    if (!isPaleBlue) return;

    switch (action) {
      case 'microphone':
        toggleMicrophone();
        break;
      case 'edit':
        alert('Edit action triggered');
        break;
      case 'generate':
        alert('Generate action triggered');
        break;
      case 'copy':
        alert('Copy action triggered');
        break;
      default:
        break;
    }
  };

  const toggleMicrophone = async () => {
    if (isBlinkingRed) {
      setIsBlinkingRed(false);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    } else {
      setIsBlinkingRed(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        setRecordedChunks([]);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'recording.webm';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        };

        mediaRecorder.start();
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setIsBlinkingRed(false);
        alert('Microphone access denied or not available.');
      }
    }
  };

  return (
    <div
      className={`circle ${isPaleBlue ? 'pale-blue' : ''} ${isBlinkingRed ? 'blinking-red' : ''}`}
      onClick={handleCircleClick}
    >
      {isEditingName ? (
        <input
          type="text"
          className="circle-input"
          value={name}
          onChange={handleNameChange}
          onBlur={handleNameBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="circle-text">{name}</span>
      )}
      {/* Sectors */}
      {isPaleBlue && (
        <>
          <div className="sector top-left" onClick={() => handleSectorAction('microphone')}>
            <span>Mic</span>
          </div>
          <div className="sector top-right" onClick={() => handleSectorAction('edit')}>
            <span>Edit</span>
          </div>
          <div className="sector bottom-left" onClick={() => handleSectorAction('generate')}>
            <span>Generate</span>
          </div>
          <div className="sector bottom-right" onClick={() => handleSectorAction('copy')}>
            <span>Copy</span>
          </div>
        </>
      )}
    </div>
  );
}

export default Circle;
