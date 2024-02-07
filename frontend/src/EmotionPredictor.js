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
    <div>
      <textarea
        placeholder="Enter your text..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={handlePredict}>Predict Emotion</button>
   
        <div>
          <h2>Predicted Emotions:</h2>
          <p>
            {predictedEmotion}
          
          </p>
         
        </div>
    
      
    </div>
  );
};

export default EmotionPredictor;
