import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import "./que.css";
import axios from "axios";
import ChatClient from "./chat";
import SocketContext from "../../components/sockets/SocketContext";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const TriviaQuiz = () => {
  console.log("Component mounted");
  const userData = useSelector((state) => state.loginStatus.userInfo);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [chatRows, setChatRows] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [individualScore, setIndividualScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // Set the initial time (in seconds)
  const [isTimeElapsed, setIsTimeElapsed] = useState(false); // Track if time has elapsed for the current question
  const [isGameOver, setIsGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const currentQuestionRef = useRef(currentQuestion);
  const [name, setName] = useState("");

  const data = useLocation();
  const triviaData = data.state.questions;
  const gameId = data.state.gameId;
  const teamId = userData.t_name;
  const userId = userData.firstName;

  useEffect(() => {
    // Update the ref whenever currentQuestion state changes
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);

  const URL =
    "wss://rs84vi8zt5.execute-api.us-east-1.amazonaws.com/production1";
  const socket = useContext(SocketContext);

  

  const onSocketMessage = (dataStr) => {
    const data = JSON.parse(dataStr);
    if (data.origin === "chat") {
      if (data.members) {
        // setMembers(data.members);
      } else if (data.publicMessage) {
        setChatRows((prevChatRows) => [
          ...prevChatRows,
          <span>
            <b>{data.publicMessage}</b>
          </span>,
        ]);
      } else if (data.privateMessage) {
        alert(data.privateMessage);
      } else if (data.systemMessage) {
        setChatRows((prevChatRows) => [
          ...prevChatRows,
          <span>
            <i>{data.systemMessage}</i>
          </span>,
        ]);
      }
      return;
    }
    const public_message = data["publicMessage"];

    const message_parts = public_message.split(":");
    const extracted_value = message_parts[1];

    handleAnswer(extracted_value.trim(), false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return; // Prevent sending empty messages

    // Send the public message to the WebSocket server
    socket.send(
      JSON.stringify({
        action: "sendPublic",
        message: newMessage,
        gameId: gameId,
      })
    );

    // Clear the input field after sending the message
    setNewMessage("");
  };

  useEffect(() => {
    
    if (socket) {
      setIsConnected(true);
      const name = userData.firstName;
      socket.send(JSON.stringify({ action: "setName", name }));
      socket.onmessage = (event) => {
        onSocketMessage(event.data);
      };
    }
  }, [socket]);

  const [hasAnswered, setHasAnswered] = useState(false); // Track if the user has attempted to answer the question

  const handleSelectedAnswer = (selectedAnswer) => {
    // Send the user's selected answer to the server via WebSocket
    socket.send(
      JSON.stringify({
        action: "answer",
        message: selectedAnswer,
        gameId: gameId,
      })
    );
    handleAnswer(selectedAnswer, true);
  };

  // Function to handle answering the question
  const handleAnswer = (selectedAnswer, flag) => {
    setHasAnswered(true); // Mark that the user has attempted to answer the question
    const currentQuestionValue = currentQuestionRef.current;

    if (selectedAnswer === triviaData[currentQuestionValue].correctAnswer) {
      // User gave the correct answer
      setIsCorrect(true);
      setScore((prevScore) => prevScore + 1);
      if (flag) {
        setIndividualScore((prevScore) => prevScore + 1);
      }
    } else {
      // User gave the wrong answer
      setIsCorrect(false);
      setIsTimeElapsed(true); // Set the time elapsed state to true
      // No need to call handleNextQuestion here
      return; // Return early if the answer is wrong
    }


    if (currentQuestionValue < triviaData.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      // All questions have been answered, end the game or show a summary
      setIsGameOver(true);
    }
    // Reset the states for the next question
    setIsCorrect(null);
    setIsTimeElapsed(false);
    setHasAnswered(false);
    setShowHint(false);
    
  };

  // Function to handle moving to the next question when the "Next Question" button is clicked
  const handleNextQuestionButtonClick = () => {
    if (currentQuestion < triviaData.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setIsGameOver(true);
    }
    // Reset the states for the next question
    setIsCorrect(null);
    setIsTimeElapsed(false);
    setHasAnswered(false);
    // Reset the timer for the next question
    setTimeLeft(60);
    // Hide the hint for the next question
    setShowHint(false);
  };

  // Function to toggle the hint visibility
  const toggleHint = () => {
    setShowHint((prevShowHint) => !prevShowHint);
  };

  const renderNextQuestionButton = () => {
    if (isTimeElapsed || hasAnswered) {
      return (
        <button className="btn-que" onClick={handleNextQuestionButtonClick}>
          Next Question
        </button>
      );
    }
    return null;
  };

  let timerInterval;

  const handleTimer = () => {
    // Exit if the game is over or the user has answered the question
    if (isGameOver || hasAnswered) {
      return;
    }

    // Decrease the time left by 1 second
    setTimeLeft((prevTimeLeft) => {
      // Ensure the timer stops when it reaches 0
      if (prevTimeLeft <= 1) {
        setIsCorrect(false);
        setIsTimeElapsed(true); // Set the answer to incorrect when time is up
        clearInterval(timerInterval); // Clear the timer interval
        return 0; // Stop the timer at 0
      }
      return prevTimeLeft - 1;
    });
  };

  useEffect(() => {
    // Set up the timer interval to call handleTimer every second
    const timerInterval = setInterval(handleTimer, 1000);

    // Clean up the timer interval when the component unmounts or the game is over
    return () => clearInterval(timerInterval);
  }, [isGameOver, hasAnswered]);

  return (
    <div>
      {!isGameOver ? (
        <div className="question">
          <h2>Question {currentQuestion + 1}</h2>
          <h3>{triviaData[currentQuestion].questionText}</h3>
          <div className="d-flex justify-content-center">
            <div className="row">
              <div className="col-md-6">
                <ul>
                  {triviaData[currentQuestion].choices
                    .slice(0, 2)
                    .map((choices, index) => (
                      <li key={index}>
                        <button
                          className={`btn-que`}
                          onClick={() => handleSelectedAnswer(choices)}
                          disabled={isCorrect !== null}
                        >
                          {choices}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="col-md-6">
                <ul>
                  {triviaData[currentQuestion].choices
                    .slice(2, 4)
                    .map((choices, index) => (
                      <li key={index}>
                        <button
                          className="btn-que"
                          onClick={() => handleSelectedAnswer(choices)}
                          disabled={isCorrect !== null}
                        >
                          {choices}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="score"> Team score : {score} </p>

          <p className="timer">Time Left: {timeLeft}</p>

          {/* Show the Chat component if isChatOpen is true */}
          {isChatOpen && <ChatClient />}

          {/* Show the "Correct!" or "Incorrect!" message */}
          {isCorrect !== null && (
            <div
              style={{
                textAlign: "center",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {isCorrect ? (
                <p style={{ color: "green" }}>Correct!</p>
              ) : (
                <p style={{ color: "red" }}>Incorrect!</p>
              )}
            </div>
          )}
          {/* Show the explanation when time is up or user selects a wrong answer */}
          {isTimeElapsed && !isCorrect && (
            <div
              style={{ textAlign: "center", fontSize: "16px", margin: "10px" }}
            >
              Time's up! The correct answer is:{" "}
              {triviaData[currentQuestion].correctAnswer}.
              <br />
              Explanation: {triviaData[currentQuestion].explanation}
              <br />
              {renderNextQuestionButton()}{" "}
              {/* Display the "Next Question" button */}
            </div>
          )}

          {/* Show the "Show Hint" button only if a hint is available */}
          {triviaData[currentQuestion].hint && !isCorrect && !isTimeElapsed && (
            <button className="btn-hint" onClick={toggleHint}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          )}
          {/* Show the hint when the "Show Hint" button is clicked */}
          {showHint && (
            <div
              style={{ textAlign: "center", fontSize: "16px", margin: "10px" }}
            >
              Hint: {triviaData[currentQuestion].hint}
            </div>
          )}
          <div className="chat-container">
            {/* <Chat /> Render the Chat component */}
            <div className="chat-container">
              <div className="chat-messages">
                {chatRows.map((message, index) => (
                  <div key={index} className="message">
                    {message}
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  style={{ fontSize: "16px" }}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h2>Game Over</h2>
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Your Score: {individualScore}
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Game Score: {score}
          </p>
          {(() => {
            const gameData = {
              name: name,
              individualScore: individualScore,
              score: score,
              userId: userId,
              gameId: gameId,
              teamId: teamId,
            };

            axios
              .post("https://storegamedata-474s4an3qa-uc.a.run.app", gameData)
              .then((response) => {
                console.log("Game data stored successfully:", response.data);
              })
              .catch((error) => {
                console.error("Error storing game data:", error);
              });
          })()}
        </div>
      )}
    </div>
  );
};
export default TriviaQuiz;
