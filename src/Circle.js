// src/Circle.js

import React, { useState, useRef } from 'react';

function Circle() {
  const [name, setName] = useState('Enter Name');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPaleBlue, setIsPaleBlue] = useState(false);
  const [isBlinkingRed, setIsBlinkingRed] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]); // Use ref instead of state

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
        const options = { mimeType: 'audio/webm;codecs=opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.warn(`${options.mimeType} is not supported. Falling back to default.`);
          delete options.mimeType; // Use default MIME type
        }
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        recordedChunksRef.current = []; // Reset the recordedChunks

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
            console.log('Data available:', event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          console.log('MediaRecorder stopped. Processing data...');
          const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
          console.log('Blob created:', blob);
          if (blob.size === 0) {
            console.error('Blob is empty. No audio data recorded.');
            alert('No audio data was recorded. Please try again.');
            return;
          }
          const base64Audio = await blobToBase64(blob);
          if (!base64Audio) {
            console.error('Failed to convert blob to base64.');
            alert('Failed to process audio recording.');
            return;
          }
          uploadToAPIGateway(base64Audio);
        };

        mediaRecorder.start();
        console.log('MediaRecorder started.');
      } catch (err) {
        console.error('Error accessing microphone:', err);
        setIsBlinkingRed(false);
        alert('Microphone access denied or not available.');
      }
    }
  };

  // Helper function to convert Blob to base64 string
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (result) {
          const base64 = result.split(',')[1];
          resolve(base64);
        } else {
          resolve('');
        }
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  };

  const uploadToAPIGateway = (base64Audio) => {
    const filename = `audio-${Date.now()}.webm`;
    const patientId = name !== 'Enter Name' ? name : 'default-patient-id'; // Replace with appropriate logic

    // Log the data being sent for debugging
    console.log('Uploading Audio with the following details:');
    console.log('Filename:', filename);
    console.log('Patient ID:', patientId);
    console.log('Base64 Audio:', base64Audio ? 'Present' : 'Empty'); // Indicate if base64Audio is present

    fetch(`${process.env.REACT_APP_API_GATEWAY_URL}/upload-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`, // Use access token
      },
      body: JSON.stringify({
        filename,
        fileContent: base64Audio,
        patientId, // Include patientId in the request body
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Unknown error');
        }
        return response.json();
      })
      .then((data) => {
        console.log('File uploaded successfully:', data);
        alert('Recording uploaded to S3 successfully.');
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        alert(`Failed to upload recording: ${error.message}`);
      });
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
