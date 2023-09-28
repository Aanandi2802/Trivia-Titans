

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");



const admin = require('firebase-admin');
admin.initializeApp();



exports.addGame = onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');

  if (request.method === "OPTIONS") {
    // stop preflight requests here
    response.set('Access-Control-Allow-Methods', 'POST');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
    return;
  }
  const nanoid = await import("nanoid");

  const generatedId = nanoid.customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyz",
    10
  );

  
  const { name, category, difficulty, timeFrame, questions, startTime } = request.body;

  // Check if all required fields are provided
  if (!name || !category || !difficulty || !timeFrame || !questions || !startTime) {
    response.status(400).send("Missing required fields");
    return;
  }

  try {
    // Save the game data to the database
    const startTimeTimestamp = admin.firestore.Timestamp.fromDate(new Date(startTime));

    // Create the game object
    const game = {
      gameId : generatedId(),
      name,
      category,
      difficulty,
      timeFrame,
      questions,
      startTime: startTimeTimestamp,
      teamScores: [] // Use the converted Timestamp
    };
    const db = admin.firestore();
    const docRef = await db.collection('testgames').doc(game.gameId).set(game);

    response.status(201).send(`Game added with ID: ${docRef.id}`);
  } catch (error) {
    console.error("Error adding game: ", error);
    response.status(500).send("Error adding game");
  }
});

exports.updateGame = onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, PUT');

  if (request.method === "OPTIONS") {
    // stop preflight requests here
    response.set('Access-Control-Allow-Methods', 'POST, PUT');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
    return;
  }
  const { gameId, name, category, difficulty, timeFrame, questions, startTime } = request.body;


  // Check if gameId is provided
  if (!gameId) {
    response.status(400).send("Missing gameId");
    return;
  }
  const startTimeTimestamp = admin.firestore.Timestamp.fromDate(new Date(startTime));

  // Create the updated game object
  const updatedGame = {
    name,
    category,
    difficulty,
    timeFrame,
    questions,
    startTime : startTimeTimestamp
  };

  try {

    // Update the game data in the database
    const db = admin.firestore();
    const gameRef = db.collection('testgames').doc(gameId);
    await gameRef.update(updatedGame);

    response.status(200).send(`Game with ID ${gameId} updated successfully`);
  } catch (error) {
    console.error("Error updating game: ", error);
    response.status(500).send("Error updating game");
  }
});


exports.deleteGame = onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST, DELETE');


  if (request.method === "OPTIONS") {
    // stop preflight requests here
    response.set('Access-Control-Allow-Methods', 'POST, DELETE');
    response.set('Access-Control-Allow-Headers', 'Content-Type');

    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
    return;
  }
  const { gameId } = request.body;


  // Check if gameId is provided
  if (!gameId) {
    response.status(400).send("Missing gameId");
    return;
  }

  try {
    // Delete the game document from the database
    const db = admin.firestore();
    const gameRef = db.collection('testgames').doc(gameId);
    await gameRef.delete();

    response.status(200).send(`Game with ID ${gameId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting game: ", error);
    response.status(500).send("Error deleting game");
  }
});

exports.getAllGames = onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');

  if (request.method === "OPTIONS") {
    // stop preflight requests here
    response.set('Access-Control-Allow-Methods', 'POST');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
    return;
  }

  try {
    // Get all game documents from the database
    const db = admin.firestore();
    const gamesSnapshot = await db.collection('testgames').get();

    if (gamesSnapshot.empty) {
      response.status(404).send("No games found");
      return;
    }

    const games = [];
    gamesSnapshot.forEach((doc) => {
      const gameData = doc.data();
      const { name, category, difficulty, timeFrame, questions, startTime } = gameData;
      const gameID = doc.id;
      // const backTime = startTime.toDate();
      games.push({ gameID, name, category, difficulty, timeFrame, questions, startTime  });
    });

    response.status(200).json(games);
  } catch (error) {
    console.error("Error getting games: ", error);
    response.status(500).send("Error getting games");
  }
});



exports.storeGameData = onRequest(async (request, response) => {
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'GET, POST');

  if (request.method === "OPTIONS") {
    // stop preflight requests here
    response.set('Access-Control-Allow-Methods', 'POST');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Max-Age', '3600');
    response.status(204).send('');
    return;
  }

  const { name, individualScore, score, teamId, userId , gameId} = request.body;

  const teamScore = score;
  
    const gameData = {
      name,
      individualScore,
      score,
      teamId,
      userId,
      gameId
      
    };
    try {
      const db = admin.firestore();
      console.log(name);

    const testGameDetailsRef = db.collection("testgames").where("gameId", "==", gameId)
    const testGameDetails = await testGameDetailsRef.get();
    const gameDocRef = testGameDetails.docs[0].ref;
    const updatedData = testGameDetails.docs[0].data().teamScores.map((item)=> {
      if(item.teamId.isEqual(db.collection("teams").doc(teamId))){
        return {...item, score: item.score + teamScore}
      }
    })
    // Create a new teamScore object with the team ID
    const indiScore = {
      score: individualScore, // Set the initial score as needed
      userId: db.doc(`userData/${userId}`),
    };

    // Add the new teamScore to the game's teamScores array
    let updatedTeamScores;
    
    
    // Update the game document with the updated individualScores array
    await gameDocRef.update({ individualScores: admin.firestore.FieldValue.arrayUnion({
      score: individualScore, // Set the initial score as needed
      userId: db.doc(`userData/${userId}`) })
    });

    await gameDocRef.update({teamScores:updatedData})
  
      // response.status(201).send(`record added with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error adding game: ", error);
      response.status(500).send("Error adding game");
    }
});
