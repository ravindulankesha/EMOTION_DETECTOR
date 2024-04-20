import React, { useState, useEffect } from 'react';
import axios, {isCancel, AxiosError} from 'axios';
import Chart from 'chart.js/auto';
import "./MovieSearch.css";
  
const MovieSearch = () => {

    const [searchText, setSearchText] = useState('');
    const [movies, setNames] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [data, setData] = useState([]);
    const [viewClickedMovie, setClickedMovie] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);
      
    const positiveEmotions=["impressed","joyful","proud","caring","confident","content","excited","faithful","grateful","hopeful","trusting","prepared"];
    const neutralEmotions=["jealous","nostalgic","anticipating","sentimental","surprised"];
    const handleReviewClick = (review) => {
        setSelectedReview(review);
    };

    const handleMovieSearch = async () => {
            const api_key="9ddcffeadcf5e38cb5e4a2a131cf2a1d";
            
            let resp= await axios.get("https://api.themoviedb.org/3/search/movie?query="+searchText+"&api_key="+api_key);

            const formattedData = resp.data.results.map((item) => ({
                id: item.id,
                name: item.title,
                image: item.poster_path,
              }));
          
            setNames(formattedData);
       
    };

    const handleNameClick = async (id,title) => {
            document.getElementById('chartContainer').removeChild(document.getElementById("sentimentChart"));
            document.getElementById('chartContainer').innerHTML+='<canvas id="sentimentChart"></canvas>';
            setReviews([]);
            setClickedMovie(title);
            const api_key="9ddcffeadcf5e38cb5e4a2a131cf2a1d";
            let movieId=id;
            
            let resp= await axios.get("https://api.themoviedb.org/3/movie/"+movieId+"/reviews?&api_key="+api_key);

            let predictedEmotions=[];
            
            const formattedData = await Promise.all(
                resp.data.results.map(async (item) => ({
                  reviewItem: item.content,
                  name: item.author,
                  emotion: await handleEmotion(item.content), // Await the result of handleEmotion
                }))
              );
        
            setReviews(formattedData);
            let positive=0;
            let negative=0;
            let neutral=0;
            const result = formattedData.map(item => {
                const variableName = item.emotion;
                if (positiveEmotions.includes(variableName)) {
                    positive+=1;
                } 
                else if(neutralEmotions.includes(variableName)){
                    neutral+=1;
                }
                else {
                    negative+=1;
                }
            });
            let dataChart=new Chart(document.getElementById('sentimentChart'),{
                type: 'doughnut',
                data:{
                    labels: [
                        'Positive',
                        'Negative',
                        'Neutral'
                    ],
                    datasets: [{
                        label: 'Feedback',
                        data: [positive,negative,neutral],
                        backgroundColor: [
                        'rgb(0, 255, 0)',
                        'rgb(255, 0, 0)',
                        'rgb(255, 255, 0)'
                        ],
                        hoverOffset: 4,
                        borderWidth: 0
                    }],
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'
                            }
                        }
                    }
                }
            });
    };

      const handleEmotion = async (reviewItem) => {
    // Make a request to API for emotion prediction
        const response = await fetch('predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: reviewItem }),
        });

        if (response.ok) {
        const result = await response.json();
        return result.predicted_emotion;
        
        } else {
        console.error('Error predicting emotion');
        }
        
    };

    return (
        <div className='sub-Container'>
            <div>
                <div className='search_box'>
                    <div>
                        <textarea
                            className='textbar'
                            placeholder="Search Film..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className="searchbtn" onClick={handleMovieSearch}>Search</button>
                    </div>
                </div>
                <div id="chartContainer">
                    <canvas id="sentimentChart"></canvas>
                </div>
                <div className='searchResults'>
                    {viewClickedMovie} Feedback Summary
                    {reviews.map((review) => (
                        <li key={review.reviewItem} onClick={() => handleReviewClick(review.reviewItem)}>
                            <strong>Viewer name:</strong> {review.name}<br />
                            <strong>Feedback summary:</strong> {review.emotion}
                            {selectedReview === review.reviewItem && (
                                <p><strong>Feedback:</strong> {review.reviewItem}</p>
                            )}
                             <hr />
                        </li>
                    ))}
                   
                </div>
            </div>
            <div className="grid-container">
                {movies.map((movie) => (
                    <div className="grid-item" key={movie.id} onClick={() => handleNameClick(movie.id, movie.name)}>
                        <img src={`https://image.tmdb.org/t/p/w300/${movie.image}`}  alt={`${movie.name}`}/>
                        <div className='click-text'>Click to get viewers' feedback for this movie</div>
                        <p className="movie-name">
                        {movie.name}
                        </p>
                    </div>        
                ))}
            </div>
            
      
        </div>
    );
};

export default MovieSearch;