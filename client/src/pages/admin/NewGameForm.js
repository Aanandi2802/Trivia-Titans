import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './form.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';


const NewGameForm = () => {
   // Extract gameData from the location state
  const location = useLocation();

  const { gameData } = location.state || {};

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    difficulty: '',
    timeFrame: '',
    startTime:',',
    questions: [
      // Example initial question object
      {
        questionText: '',
        choices: ['', '', '', ''],
        correctAnswer: '',
        hint: '',
        explanation: '',
      },
    ],
  });
// Populate the form data if gameData is provided
  useEffect(() => {

    if (gameData) {
      console.log(gameData);
      setFormData({
        gameID: gameData.gameID || '',
        name: gameData.name || '',
        category: gameData.category || '',
        difficulty: gameData.difficulty || '',
        timeFrame: gameData.timeFrame || '',
        questions: gameData.questions || '',
        startTime: gameData.startTime || ''[{ /* initial question object */ }],
      });
    }
  }, [gameData]);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
//form validation
    if (!formData.name) {
      alert('Please enter a name');
      return;
    }
    if (!formData.category) {
      alert('Please enter a category');
      return;
    }
    if (!formData.difficulty) {
      alert('Please enter a difficulty');
      return;
    }
    if (!formData.timeFrame) {
      alert('Please enter a timeFrame');
      return;
    }
    if (!formData.questions) {
      alert('Please enter a questions');
      return;
    }
    if (!formData.startTime) {
      alert('Please enter a start time and date');
      return;
    }


    const timestamp = formData.startTime
      ? firebase.firestore.Timestamp.fromMillis(new Date(formData.startTime).getTime())
      : null;

    


    // Remove empty questions before submitting
    const cleanedQuestions = formData.questions.filter(
      (question) => question.questionText.trim() !== ''
    );
    setFormData({ ...formData, questions: cleanedQuestions });

    // Create a new game object to send to the API
    const updatedGame = {
      gameId: formData.gameID,
      name: formData.name,
      category: formData.category,
      difficulty: formData.difficulty,
      timeFrame: formData.timeFrame,
      questions: formData.questions,
      startTime : formData.startTime
    };

    console.log(updatedGame);

    // Determine the URL based on whether it's a new game or update
    const apiUrl = gameData
      ? `https://updategame-474s4an3qa-uc.a.run.app`
      : 'https://addgame-474s4an3qa-uc.a.run.app';

    // Determine the HTTP method based on whether it's a new game or update
    const httpMethod = gameData ? 'PUT' : 'POST';

    // Make the API request
    axios
      .request({
        method: httpMethod,
        url: apiUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        data: updatedGame,
      })
      .then((response) => {

        setShowSuccess(true); // Show success popup
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

// selecting options
  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const updatedQuestions = formData.questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        return {
          ...question,
          choices: question.choices.map((choice, cIndex) =>
            cIndex === choiceIndex ? value : choice
          ),
        };
      }
      return question;
    });
    setFormData({ ...formData, questions: updatedQuestions });
  };
// Adding new question
  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: '',
          choices: ['', '', '', ''],
          correctAnswer: '',
          hint: '',
          explanation: '',
        },
      ],
    });
  };

  const handleExplanationChange = (questionIndex, value) => {
    const updatedQuestions = formData.questions.map((question, qIndex) => {
      if (qIndex === questionIndex) {
        return {
          ...question,
          explanation: value,
        };
      }
      return question;
    });
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      difficulty: '',
      timeFrame: '',
      startTime:'',
      questions: [
        // Example initial question object
        {
          questionText: '',
          choices: ['', '', '', ''],
          correctAnswer: '',
          hint: '',
          explanation: '',
        },
      ],
    });
  };


  const handleStartTimeChange = (e) => {
    const selectedTime = e.target.value;
    setFormData({ ...formData, startTime: selectedTime });
  };


  return (
    <div className="container">
      <h2>Create New Game</h2>
      {showSuccess && (
        <div className="popup">
          <div className="popup-content">
            <h3>{gameData ? 'Game updated successfully' : 'Game added successfully'}</h3>
            <button onClick={() => setShowSuccess(false)}>OK</button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Existing form elements */}
        {/* ... */}
        <div className="form-group col-md-12 mb-6">
          <label htmlFor="name">Game Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter game name"
            required
          />
        </div>
        <div className="form-group col-md-12 mb-4">
          <label htmlFor="category">Category</label>
          <select
            className="form-control"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="sports">Sports</option>
            <option value="history">History</option>
            <option value="mathematics">Mathematics</option>
            <option value="coding">Coding</option>
          </select>
        </div>
        <div className="form-group col-md-12 mb-6">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            className="form-control"
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            required
          >
            <option value="0">Easy</option>
            <option value="1">Medium</option>
            <option value="2">Hard</option>
          </select>
        </div>
        <div className="form-group col-md-12 mb-4">
          <label htmlFor="timeFrame">Time Frame</label>
          <select
            className="form-control"
            id="timeFrame"
            value={formData.timeFrame}
            onChange={(e) => setFormData({ ...formData, timeFrame: e.target.value })}
            required
          >
            <option value="30">30 mins</option>
            <option value="45">45 mins</option>
            <option value="60">1 hour</option>
            {/* Add more time frame options as needed */}
          </select>
        </div>
        <div className="form-group col-md-12 mb-6">
          <label htmlFor="name">Start date time</label>
          <input
            type="datetime-local"
            className="form-control"
            id="startTime"
            value={formData.startTime}
            onChange={handleStartTimeChange}
            placeholder="Enter start time"
            required
          />
        </div>

        {formData.questions.map((question, index) => (
          <div key={index}>
            <div className="form-group col-md-12 mb-4">
              <label htmlFor={`questionText-${index}`}>Question {index + 1}</label>
              <input
                type="text"
                required
                className="form-control"
                id={`questionText-${index}`}
                value={question.questionText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    questions: formData.questions.map((q, qIndex) =>
                      qIndex === index ? { ...q, questionText: e.target.value } : q
                    ),
                  })
                }
                placeholder="Enter the question"
              />
            </div>
            <div className="form-group col-md-12 mb-4">
              <label>Choices</label>
              {question.choices.map((choice, choiceIndex) => (
                <input
                  key={choiceIndex}
                  type="text"
                  className="form-control"
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, choiceIndex, e.target.value)}
                  placeholder={`Choice ${choiceIndex + 1}`}
                  style={{ marginBottom: '10px' }}
                  required
                />
              ))}
            </div>
            <div className="form-group col-md-12 mb-6">
              <label htmlFor={`correctAnswer-${index}`}>Correct Answer</label>
              <input
                type="text"
                className="form-control"
                id={`correctAnswer-${index}`}
                value={question.correctAnswer}
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    questions: formData.questions.map((q, qIndex) =>
                      qIndex === index ? { ...q, correctAnswer: e.target.value } : q
                    ),
                  })
                }
                placeholder="Enter the correct answer"
              />
            </div>
            <div className="form-group col-md-12 mb-6">
              <label htmlFor={`hint-${index}`}>Hint</label>
              <input
                type="text"
                className="form-control"
                id={`hint-${index}`}
                value={question.hint}
                required
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    questions: formData.questions.map((q, qIndex) =>
                      qIndex === index ? { ...q, hint: e.target.value } : q
                    ),
                  })
                }
                placeholder="Enter a hint"
              />
            </div>
            <div className="form-group col-md-12 mb-6">
              <label htmlFor={`explanation-${index}`}>Explanation</label>
              <input
                type="text"
                className="form-control"
                id={`explanation-${index}`}
                value={question.explanation}
                required
                onChange={(e) => handleExplanationChange(index, e.target.value)}
                placeholder="Enter the explanation"
              />
            </div>
            <hr />
          </div>
        ))}
        <div class="add-container">
          <button type="button" className="addcreate" onClick={handleAddQuestion}>
            Add Question
          </button>
          <button
            type="submit"
            className="addcreate"
            onClick={handleSubmit}
          >
            {gameData ? 'Update Game' : 'Create Game'}
          </button>
        </div>
      </form>

    </div>
  );
};

export default NewGameForm;
