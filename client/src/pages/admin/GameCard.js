// GameCard.js
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './card.css';
import { useNavigate } from 'react-router-dom';
 // Import custom CSS file for GameCard component

const GameCard = ({ game, onDelete }) => {
  const { gameID, name, category, difficulty, timeFrame, questions } = game;
  const navigate = useNavigate();

  return (
    
    <Card className="game-card">
   
      <Card.Body>
        <Card.Title className="card-title">{name}</Card.Title>
        
        <Card.Text className="card-text">
          Category: {category}
        </Card.Text>
        <Card.Text className="card-text">
          Difficulty: {difficulty}
        </Card.Text>
        <Card.Text className="card-text">
          Time Frame: {timeFrame}
        </Card.Text>
        
          <Button  className="edit mr-2" onClick={() => navigate("/form", { replace: true, state: {gameData : game } })}>
            Edit
          </Button>
        
        <Button    onClick={() => onDelete(gameID)}  className="delete">Delete</Button>
      </Card.Body>
    </Card>

  );
};

export default GameCard;
