import React, { useState, useEffect } from "react";
import { Dropdown, Alert } from "react-bootstrap";
import UserProfileNavbar from "../user-profile/UserProfileNavbar";
import axios from "axios";
import { useSelector } from "react-redux";

export default function CompareScores() {
  const lemail = localStorage.getItem("loginEmail");
  const [userData, setUserData] = useState({});
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameScores, setGameScores] = useState({
    selectedGame: [],
    userGame: [],
  });

  useEffect(() => {
    // Fetch user data from the backend when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "https://app-3gx7kxu67q-uc.a.run.app/get-user-data-by-email",
          {
            email: lemail,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        const { userData } = response.data;
        console.log("Fetched User Data Successfully.", userData);
        setUserData(userData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [lemail]);

  useEffect(() => {
    // Fetch game scores for the selected game and user's selected game
    const fetchGameScores = async () => {
      try {
        if (selectedGame) {
          // Fetch scores for the selected game
          const responseSelectedGame = await axios.post(
            "https://app-474s4an3qa-uc.a.run.app/compare-score",
            {
              gameName: selectedGame,
            }
          );
          const { tdata: selectedGameScores } = responseSelectedGame.data;

          // Fetch scores for the user's selected game
          const responseUserGame = await axios.post(
            "https://app-474s4an3qa-uc.a.run.app/compare-score",
            {
              gameName: selectedGame, // Use selectedGame instead of userData.t_name
            }
          );
          const { tdata: userGameScores } = responseUserGame.data;

          // Set the game scores for comparison
          setGameScores({
            selectedGame: selectedGameScores,
            userGame: userGameScores,
          });
        }
      } catch (error) {
        console.error("Error fetching game scores:", error);
      }
    };

    fetchGameScores();
  }, [selectedGame]);

  return (
    <>
      <UserProfileNavbar />
      <div className="compare-scores">
        <div className="main-section">
          <h2>Compare Scores</h2>
          {/* Dropdown for selecting the game */}
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="game-dropdown">
              {selectedGame || "Select a Game"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {gameScores.selectedGame.map((item, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setSelectedGame(item.t_name)}
                >
                  {item.t_name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          {/* Display scores for the selected game and user's selected game */}
          {selectedGame &&
            gameScores.selectedGame.length > 0 &&
            gameScores.userGame.length > 0 && (
              <div className="mt-3">
                <h4>
                  Scores for {selectedGame} vs. {selectedGame}
                </h4>
                <div className="score-comparison">
                  {/* Display selected game scores */}
                  <div className="game-score">
                    <h5>{selectedGame}</h5>
                    {gameScores.selectedGame.map((score, index) => (
                      <Alert key={index} variant="info">
                        Games Played: {score.games_played}, Games Won:{" "}
                        {score.games_won}, Total Points: {score.total_pts}
                      </Alert>
                    ))}
                  </div>
                  {/* Display user's selected game scores */}
                  <div className="game-score">
                    <h5>{selectedGame}</h5>
                    {gameScores.userGame.map((score, index) => (
                      <Alert key={index} variant="info">
                        Games Played: {score.games_played}, Games Won:{" "}
                        {score.games_won}, Total Points: {score.total_pts}
                      </Alert>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
}
