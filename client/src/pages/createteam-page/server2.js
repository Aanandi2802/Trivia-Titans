const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const admin = require('firebase-admin');
const fs = require('fs').promises;

const serviceAccountKeyPath = path.join(__dirname, 'serviceAccountKey.json');
let firestore
// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  fs.readFile(serviceAccountKeyPath, 'utf8')
    .then((fileContent) => {
      const serviceAccount = JSON.parse(fileContent);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      firestore = admin.firestore();
    })
    .catch((error) => {
      console.error('Failed to initialize admin:', error);
    });
}


//const firestore = new Firestore({ projectId: "serverless-project-392613" });

AWS.config.update({
  accessKeyId: "ASIASAWFVLWS5F4HXMVR",
  secretAccessKey: "+a9krPLJu7gdWJZ7TWBSKcqipX+OWtfBr9n0s++8",
  sessionToken:
    "FwoGZXIvYXdzELT//////////wEaDEjUtMcNQawi95CThSLAAVfi8O7Eh8rHI6illWwNu5TYGDXgJ0zZEbW2TXu/y461G5cZuGwen37uA/okpjt+FpRoQnutVAXOrCVimQWqkdwRb1mjhM97jeLD+InqIMGAt5Ao7FdmItNk6/fzA6/Y05KE/8KVK5S4KaxjvY/rXOhwUb294+q/nHfgTqnhOWqKndm5pd+/JPQ3uHpftB5dxcj9xX6jNVYbaa/d+/jb0XrREWyyyhQrGDCvynAc1jHlOjZBNyODt8iSjFxXrL908ii3trqmBjIthWaVY/yxdhS1vnYGcan8oFdsMZh5KaYy9ki9yCgBsKqWgTTIu+lS9SyqFeb0",
  region: "us-east-1",
});


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const lambda = new AWS.Lambda();
// Set the views directory to serve static files
app.use(express.static(path.join(__dirname, "views")));


let globalTeamName;
let staticPlayerID;

// Serve genteam.html with the Generate Team button
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "genteam.html"));
});

// Set EJS as view engine
app.set("view engine", "ejs");

// Function to generate a random team name
function generateTeamName() {
  const adjectives = [
    "Awesome",
    "Spectacular",
    "Fantastic",
    "Incredible",
    "Magical",
  ];
  const nouns = ["Dragons", "Tigers", "Wolves", "Phoenix", "Knights"];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective}${randomNoun}`; // no space between adjective and noun
}

// Function to check if a team name exists in Firestore
async function checkTeamNameExists(teamName) {
  const teamsCollectionRef = firestore.collection("teams");
  const snapshot = await teamsCollectionRef
    .where("t_name", "==", teamName)
    .get();
  return !snapshot.empty;
}

// Route to render the genteam.ejs page with the Player ID
app.get("/genteam", (req, res) => {
  res.render("genteam", { playerID: staticPlayerID });
});

async function addTeamMember(teamName, playerData) {
  try {
    // Reference to the teams collection
    const teamsCollection = firestore.collection("teams");
    console.log("1");
    // Reference to the document with the team name
    const teamDocument = teamsCollection.doc(teamName);

    console.log("01");
    // Check if the document exists
    const docSnapshot = await teamDocument.get();
    if (docSnapshot.exists) {
      const docData = docSnapshot.data();
      if (
        docData.team_members !== undefined &&
        docData.team_members.length > 0
      ) {
        console.log("19");
        await teamDocument.update({
          team_members: firestore.FieldValue.arrayUnion({
            pid: playerData.pid,
            firstName: playerData.firstName,
            email: playerData.email,
            role: "admin",
          }),
        });
      } else {
        await teamDocument.update({
          team_members: [
            {
              pid: playerData.pid,
              firstName: playerData.firstName,
              email: playerData.email,
              role: "admin",
            },
          ],
        });
      }
    }

    console.log(
      `Player data added to '${teamName}' in the 'teams' collection.`
    );
  } catch (error) {
    console.error(`Error adding player data to team: ${error}`);
  }
}

app.use(bodyParser.json());
// Route to handle Generate Team button click

app.post("/generate_team", async (req, res) => {
  let teamName = generateTeamName();
  staticPlayerID = Number(req.body.playerID);
  let exists = await checkTeamNameExists(teamName);
  // Regenerate the team name if it already exists in Firestore
  while (exists) {
    teamName = generateTeamName();
    exists = await checkTeamNameExists(teamName);
  }
  globalTeamName = teamName;
  // Store the generated team name in Firestore teams collection
  try {
    const teamDocRef = firestore.collection("teams").doc(teamName);
    await teamDocRef.set({ t_name: teamName, t_desc: "None" });

    // Fetch the user's data from Firestore
    const userDocRef = firestore
      .collection("userData")
      .where("pid", "==", staticPlayerID)
      .limit(1);
    const snapshot = await userDocRef.get();

    if (snapshot.empty) {
      console.error(
        `User with PID ${staticPlayerID} not found in the userData collection.`
      );
      return res.status(404).send("User not found.");
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    await userDoc.ref.update({ t_name: teamName });

    // Add the user to the team using the provided function
    await addTeamMember(teamName, userData);

    // Add the new fields to the t_stats collection for the generated team
    const tStatsCollectionRef = firestore.collection("t_stats");
    await tStatsCollectionRef.add({
      games_played: 0,
      games_won: 0,
      total_pts: 0,
      t_name: teamName,
    });
    console.log("asd");
    debugger;

    // Return only the success message without any additional error message
    res.send(
      `Team name "${teamName}" has been generated and stored in the database.`
    );
  } catch (error) {
    console.error("Error generating and storing team name:", error);
    res
      .status(500)
      .send("An error occurred while generating and storing the team name.");
  }
});

console.log("Value of staticPlayerID is:", staticPlayerID);
app.get("/genteamdetails", async (req, res) => {
  let teamName = globalTeamName; // Get the team name from the global variable
  let playerID = staticPlayerID; // Get this from your actual data source.

  res.render("genteamdetails", { teamName, playerID });
});

// Handle POST request from genteamdetails.ejs form
app.post("/submit_team_details", async (req, res) => {
  // Assuming you have a form field named "teamDescription" in genteamdetails.ejs
  const teamDescription = req.body.teamDescription;

  // Get the team name from the global variable
  const teamName = globalTeamName;

  // Query the teams collection in Firestore
  const teamsCollectionRef = firestore.collection("teams");

  // Get the snapshot of the document whose t_name matches with the teamName
  const snapshot = await teamsCollectionRef
    .where("t_name", "==", teamName)
    .get();

  if (!snapshot.empty) {
    // If such a document exists, update the t_desc field
    const doc = snapshot.docs[0]; // Since we're querying by team name, there should be only one matching document
    await doc.ref.update({ t_desc: teamDescription }); // Update the t_desc field with teamDescription

    console.log(
      `Team description for "${teamName}" has been updated successfully.`
    );
      // Redirect to the specific URL including the staticPlayerID query parameter
  res.redirect(`https://team-home-aurm4bodaa-uc.a.run.app/team_home2?playerID=${staticPlayerID}`);
} else {
  // If no such document exists, send an error message
  console.error(
    `Team with name "${teamName}" not found in the teams collection.`
  );
  res.status(404).send("Team not found.");
}
});

app.listen(3050, async () => {
  console.log("Server is running on port 3050");
  const open = (await import("open")).default;
  await open("http://localhost:3050"); // This will open the genteam.html page as the first page
});
