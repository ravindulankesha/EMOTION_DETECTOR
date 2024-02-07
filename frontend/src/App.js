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

        <button onClick={Navigate_To_EmotionPredictor}>Enter a custom input</button>
        <button onClick={Navigate_To_MovieSearch}>Search for a Film and analyze</button>

        <Routes>
          <Route path="/EmotionPredictor" element={<EmotionPredictor/>} />
          <Route path="/MovieSearch" element={<MovieSearch/>} />
        </Routes>
      </div>
  );
};

export default App;
