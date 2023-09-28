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

    // Check if the team is enrolled in the game
    if (gameDoc.data().teamScores && Array.isArray(gameDoc.data().teamScores)) {
      const teamIndex = gameDoc
        .data()
        .teamScores.findIndex((teamScore) =>
          teamScore.teamId.isEqual(teamsCollection.doc(teamId))
        );

      if (teamIndex === -1) {
        return res
          .status(400)
          .json({ message: "Team is not enrolled in the game." });
      }

      // Remove the teamScore from the game's teamScores array
      const updatedTeamScores = [...gameDoc.data().teamScores];
      updatedTeamScores.splice(teamIndex, 1);

      // Update the game document with the updated teamScores array
      await gameRef.update({ teamScores: updatedTeamScores });
      let gameData = gameDoc.data();
      gameData.teamScores = updatedTeamScores;
      gameData.startTime = gameData.startTime.toDate();
      return res
        .status(200)
        .json({
          data: gameData,
          message: "Team removed from game successfully.",
        });
    }

    return res
      .status(400)
      .json({ message: "Team is not enrolled in the game." });
  } catch (error) {
    console.error("Error adding team to game:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
