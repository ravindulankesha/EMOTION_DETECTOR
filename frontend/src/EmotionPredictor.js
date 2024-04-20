import React, { useState, useEffect } from 'react';

const EmotionPredictor = () => {
  const [inputText, setInputText] = useState('');
  const [predictedEmotion, setPredictedEmotions] = useState();
  const [splittedSentences, setSentences] = useState([]);

  const handlePredict = async () => {
    // Make a request to API for emotion prediction
        const response = await fetch('predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
        });

        if (response.ok) {
        const result = await response.json();
        setPredictedEmotions(result.predicted_emotion);
        
        } else {
        console.error('Error predicting emotion');
        }
        
    };
  
  return (
    <div className='sub-Container'>
      <div className='search_box'>
        <div>
          <textarea
            className='textbar'
            placeholder="Enter your text..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
        <div>
          <button className="searchbtn" onClick={handlePredict}>Predict Emotion</button>
        </div>
      </div>
      <div className='content'>
        <b>Predicted Emotions:</b>
        <p>
          {predictedEmotion}
        </p>
      </div>     
    </div>
  );
};

export default EmotionPredictor;
