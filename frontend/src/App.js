// Filename - App.js

// Importing modules
import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, useNavigate, Route, Routes } from 'react-router-dom';
import EmotionPredictor from './EmotionPredictor';
import MovieSearch from './MovieSearch';

const App = () => {
  const navigate = useNavigate();

  const Navigate_To_EmotionPredictor = () => {
    navigate('/EmotionPredictor');
  };

  const Navigate_To_MovieSearch = () => {
    navigate('/MovieSearch');
  };

  return (
    <div>
      <h1 className="heading">
        TEXT EMOTION DETECTOR
      </h1>
      
      <div className="main-container">
        <div>
          <button className="button" onClick={Navigate_To_EmotionPredictor}>DETECT EMOTION FOR A CUSTOM INPUT</button>
        </div>
        <div>
          <button className="button" onClick={Navigate_To_MovieSearch}>SEARCH FOR A FILM AND ANALYZE REVIEWS</button>
        </div>
      </div>
        <Routes>
          <Route path="/EmotionPredictor" element={<EmotionPredictor/>} />
          <Route path="/MovieSearch" element={<MovieSearch/>} />
        </Routes>
    </div>
  );
};

export default App;
