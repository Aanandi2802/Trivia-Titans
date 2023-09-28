const functions = require("@google-cloud/functions-framework");
const firestore = require("./db");
const gamesCollection = firestore.collection("testgames");
const teamsCollection = firestore.collection("teams");
const PAGE_SIZE = 2;
functions.http("registerGame", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    return;
  }

  try {
    const { teamId, gameId } = req.body;

    // Retrieve the game document
    const gameRef = gamesCollection.doc(gameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return res.status(404).json({ message: "Game not found." });
    }

    // Check if the team is already enrolled in the game
    if (gameDoc.data().teamScores && Array.isArray(gameDoc.data().teamScores)) {
      const isTeamEnrolled = gameDoc
        .data()
        .teamScores.some((teamScore) =>
          teamScore.teamId.isEqual(teamsCollection.doc(teamId))
        );

      if (isTeamEnrolled) {
        return res
          .status(400)
          .json({ message: "Team is already enrolled in the game." });
      }
    }

    // Create a new teamScore object with the team ID
    const teamScore = {
      score: 0, // Set the initial score as needed
      teamId: firestore.doc(`teams/${teamId}`),
    };

    // Add the new teamScore to the game's teamScores array
    let updatedTeamScores;

    if (gameDoc.data().teamScores && Array.isArray(gameDoc.data().teamScores)) {
      updatedTeamScores = [...gameDoc.data().teamScores, teamScore];
    } else {
      updatedTeamScores = [teamScore];
    }

    // Update the game document with the updated teamScores array
    await gameRef.update({ teamScores: updatedTeamScores });
    let gameData = gameDoc.data();
    gameData.teamScores = updatedTeamScores;
    gameData.startTime = gameData.startTime.toDate();
    return res
      .status(200)
      .json({ data: gameData, message: "Team added to game successfully." });
  } catch (error) {
    console.error("Error adding team to game:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
