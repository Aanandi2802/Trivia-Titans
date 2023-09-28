
// AdminDashboard.js
import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import GameCard from './GameCard';
import './card.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';


const AdminDashboard = () => {
  

  const [games, setGames] = useState([]);
  const [totalgames, setTotalGames] = useState([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchDifficulty, setSearchDifficulty] = useState('');
  const [searchTimeFrame, setSearchTimeFrame] = useState('');

  // Function to delete a game
  const handleDeleteGame = (gameID) => {
    // Create the data object to send with the request
    const data = { gameId: gameID };
  
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: 'https://deletegame-474s4an3qa-uc.a.run.app',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
  
    // Make the axios request to delete the game from Firestore
    axios
      .request(config)
      .then((response) => {
        console.log('Game deleted successfully:', response.data);
  
        
        window.confirm('Game deleted successfully . Click OK.').then((result) => {
          if (result) {
            // Refresh the page
            window.location.reload();
          }
        });
      
       })
      .catch((error) => {
        console.log('Error deleting game:', error);
      });
  };


  const fetchAllGames = async () => {
    const axiosConfig = {
      method: 'get', // Change this to 'get' for fetching all games
      url: 'https://getallgames-474s4an3qa-uc.a.run.app',

      // Allow sending cookies with the request
    };

    axios
      .request(axiosConfig)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setGames(response.data); // Update the state with the fetched games
        setTotalGames(response.data); // Update the state with the fetched games
      })
      .catch((error) => {
        console.log(error);
      });

  };

  // Fetch all games when the component mounts for the first time
  useEffect(() => {
    fetchAllGames();
  }, []);

  // Function to handle search based on category, difficulty, and time frame
  const handleSearch = () => {
    const filteredGames = games.filter((game) => {
      const categoryMatch =
        searchCategory === '' || game.category.toLowerCase().includes(searchCategory.toLowerCase());
      const difficultyMatch =
        searchDifficulty === '' || game.difficulty.toLowerCase().includes(searchDifficulty.toLowerCase());
      const timeFrameMatch =
        searchTimeFrame === '' || game.timeFrame.toLowerCase().includes(searchTimeFrame.toLowerCase());

      return categoryMatch && difficultyMatch && timeFrameMatch;
    });

    // Update the games list with the filtered results
    setGames(filteredGames);
  };

  // Function to reset the search criteria and display all games
  const handleReset = () => {
    setSearchCategory('');
    setSearchDifficulty('');
    setSearchTimeFrame('');

    setGames(totalgames);
  };

  return (


    <div className='mx-5'>
      {/* <h2 className="text-center">Admin Dashboard</h2> */}



      {/* Search Form */}
      <div className="row my-5">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by difficulty"
            value={searchDifficulty}
            onChange={(e) => setSearchDifficulty(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by time frame"
            value={searchTimeFrame}
            onChange={(e) => setSearchTimeFrame(e.target.value)}
          />
        </div>
      </div>

      {/* Search and Reset Buttons */}
      <div className="text-center mb-5">
        <Button variant='secondary' size="sm" onClick={handleSearch} className="btn btn-xs" style={{ width: "100px", height: "40px", marginRight: "50px" }} >
          Search
        </Button>
        <Button variant="secondary" size="sm" onClick={handleReset} className="btn btn-sm" style={{ width: "100px", height: "40px", }} >
          Reset
        </Button>
      </div>

      <div className="row">
        {games.map((game) => (
          <div className="col-12 col-md-3 mb-4" key={game.gameID}>
           <Link to={{ pathname: '/form', state: { gameData: game } }}></Link>
            <GameCard game={game} onDelete={handleDeleteGame}/>
          </div>
        ))}
      </div>

    </div>


  );
};

export default AdminDashboard;
