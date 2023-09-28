const express = require("express");
const app = express();
const AWS = require("aws-sdk");
const { Firestore } = require("@google-cloud/firestore");
const path = require("path");
const admin = require('firebase-admin');
const fs = require('fs').promises;

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

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

app.get('/', (req, res) => {
    res.redirect('/team_home2');
  });
  

let globalTeamName;
let staticPlayerID;

app.get("/team_home2", async (req, res) => {

    let playerID = Number(req.query.playerID); // Get the team name from the global variable
        const userDocRef = firestore
          .collection("userData")
          .where("pid", "==", playerID)
          .limit(1);
        const snapshot = await userDocRef.get();
        staticPlayerID = playerID;
        if (snapshot.empty) {
          console.error(
            `User with PID ${staticPlayerID} not found in the userData collection.`
          );
          return res.status(404).send("User not found.");
        }
    
        const userDoc = snapshot.docs[0];
        
    let  teamName= userDoc.data().t_name; // Get this from your actual data source
    globalTeamName = teamName;
    
    console.log(`Team name for player with PID ${staticPlayerID} is ${globalTeamName}.`);
    // Fetch the team's statistics from Firestore
    let snapshotStats = await firestore
      .collection("t_stats")
      .where("t_name", "==", teamName)
      .get();
    if (snapshotStats.empty) {
      return res.status(404).send("Team stats not found");
    }
  
    let teamStats = snapshotStats.docs[0].data();
  
    // Calculate games lost
    let gamesLost = teamStats.games_played - teamStats.games_won;
  
    // Fetch the team's description from Firestore
    let snapshotTeams = await firestore
      .collection("teams")
      .where("t_name", "==", teamName)
      .get();
    if (snapshotTeams.empty) {
      return res.status(404).send("Team not found");
    }
  
    let teamDesc = snapshotTeams.docs[0].data().t_desc;
    // Fetch the team's admin from Firestore.
    let snapshotAdmin = await firestore.collection("teams").doc(teamName).get();
  
    //   if (snapshotAdmin.empty) {
    //     return res.status(404).send('Admin not found');
    //   }
    //   let adminData = snapshotAdmin.docs[0].data();
  
    // Now you can define teamAdmin and isAdmin.
    let teamAdmin;
    //   = adminData;
    let isAdmin = false;
  
    // Fetch the current player's name from Firestore
    let snapshotPlayer = await firestore
      .collection("userData")
      .where("pid", "==", playerID)
      .get();
    if (snapshotPlayer.empty) {
      return res.status(404).send("Player not found");
    }
  
    let playerName = snapshotPlayer.docs[0].data().firstName;
  
    // Fetch admin's firstName from 'userData' collection.
    //   let adminUserSnapshot = await firestore.collection('userData').where('pid', '==', teamAdmin.pid).get();
    //   let adminUser = adminUserSnapshot.docs[0].data().firstName;
  
    // Fetch all team members from Firestore.
    let snapshotMembers = await firestore.collection("teams").doc(teamName).get();
    let teamMembers = [];
    const tempData = snapshotMembers.data();
    for (let doc of tempData.team_members) {
      let memberData = doc;
      let userSnapshot = await firestore
        .collection("userData")
        .where("pid", "==", memberData.pid)
        .get();
      let user = null; // Initialize user
      if (userSnapshot.docs.length > 0) {
        user = userSnapshot.docs[0].data();
      }
      if (user) {
        if (doc.role == "member") {
          teamMembers.push({ pid: memberData.pid, firstName: user.firstName });
        } else {
          adminUser = user.firstName;
          teamAdmin = user;
          isAdmin = teamAdmin.pid === playerID;
        }
      }
    }
    res.render("team_home2", {
      teamName,
      playerID,
      playerName,
      teamStats,
      gamesLost,
      teamDesc,
      adminUser,
      teamMembers,
      staticPlayerID,
      globalTeamName,
      isAdmin,
    });
  });

  app.post("/delete-player", async (req, res) => {
    let playerIDToDelete = parseInt(req.body.pid, 10); // Parse to number
    console.log("Player ID to delete: ", playerIDToDelete);
    console.log("Team name: ", globalTeamName);
    let snapshotplayertodelte = await firestore
    .collection("teams")
    .doc(globalTeamName)
    .get();
    
      if (!snapshotplayertodelte.exists) {
        return res.status(404).send("Team not found");
      }
      
      let teamData = snapshotplayertodelte.data();
      let teamMembers = teamData.team_members;
     // Find the index of the player you want to delete
  let indexOfPlayerToDelete = teamMembers.findIndex(member => member.pid === playerIDToDelete);

  if (indexOfPlayerToDelete > -1) { // If the player is found
    teamMembers.splice(indexOfPlayerToDelete, 1); // Remove the player from the array

    // Update the Firestore document with the new array of team members
    await firestore
      .collection("teams")
      .doc(globalTeamName)
      .update({ team_members: teamMembers });

    let userSnapshot = await firestore
      .collection("userData")
      .where("pid", "==", playerIDToDelete)
      .get();
  
    if (!userSnapshot.empty) {
      let userDoc = userSnapshot.docs[0];
      await firestore
        .collection("userData")
        .doc(userDoc.id)
        .update({ t_name: "None" });
    }
    res.redirect(`/team_home2?playerID=${staticPlayerID}`); // Redirect as needed
  } else {
    return res.status(404).send("Player not found in team");
  }
});
    
  app.post("/promote-player", async (req, res) => {
    try {
        console.log(`Received PID: ${req.body.pid}`);
      let playerIDToPromote = parseInt(req.body.pid, 10);
      console.log(`Team name for player with PID ${playerIDToPromote} is ${globalTeamName}.`);
  
      let snapshotMembers = await firestore
        .collection("teams")
        .doc(globalTeamName)
        .get();
  
      if (!snapshotMembers.exists) {
        return res.status(404).send("Team not found");
      }
  
      let teamData = snapshotMembers.data();
      let teamMembers = teamData.team_members;
  
      let updatedTeamMembers = teamMembers.map(member => {
        if (member.pid === playerIDToPromote) {
          return { ...member, role: "admin" };
        } else {
          return { ...member, role: "member" };
        }
      });
  
      await firestore
        .collection("teams")
        .doc(globalTeamName)
        .update({ team_members: updatedTeamMembers });
        
        res.redirect(`/team_home2?playerID=${staticPlayerID}`);
    } catch (error) {
      // Handle the error here
      console.error("Error occurred:", error);
      res.status(500).send("Something went wrong on the server.");
    }
  });
  
  
  
  app.post("/leave-team", async (req, res) => {
    let playerIDToLeave = Number(req.body.pid);
    console.log("Player ID to leave: ", playerIDToLeave);

     // Find the player who is leaving
    let userSnapshot = await firestore
      .collection("userData")
      .where("pid", "==", playerIDToLeave)
      .get();
  
    if (userSnapshot.empty) {
      return res.status(404).send("Player not found");
    }
  
    let userDoc = userSnapshot.docs[0];
  
    // If the player is an admin, find another player to promote
    if (userDoc.data().role === "admin") {
      let memberSnapshot = await firestore
        .collection(teams)
        .where("role", "==", "member")
        .limit(1)
        .get();
  
      // If there's at least one member, promote the first one to admin
      if (!memberSnapshot.empty) {
        let memberDoc = memberSnapshot.docs[0];
        await firestore
          .collection(globalTeamName)
          .doc(memberDoc.id)
          .update({ role: "admin" });
      } else {
        // If there are no other members, you might want to handle the situation differently
        console.log("No members left in the team to promote to admin");
      }
    }
  
    // Update the player's t_name field in the userData collection to "None"
    await firestore
      .collection("userData")
      .doc(userDoc.id)
      .update({ t_name: "None" });
  
    // Delete the player from the team
    let teamSnapshot = await firestore
      .collection(globalTeamName)
      .where("pid", "==", playerIDToLeave)
      .get();
    if (!teamSnapshot.empty) {
      let playerDoc = teamSnapshot.docs[0];
      await firestore.collection(globalTeamName).doc(playerDoc.id).delete();
    }
  
    res.redirect("/team_home2");
  });
  
  app.get("/add_members", async (req, res) => {
    // Fetch online userData from Firestore
    let snapshot = await firestore
      .collection("p_status")
      .where("status", "==", "online")
      .get();
    let onlineUsers = snapshot.docs.map((doc) => doc.data());
  
    // Filter out the current player (staticPlayerID) from the list
    onlineUsers = onlineUsers.filter((user) => user.pid !== staticPlayerID);
  
    const baseUrl = 'https://team-home-aurm4bodaa-uc.a.run.app';

  res.render("add_members", { onlineUsers, baseUrl });
});
  
  app.post("/add_member/:id", async (req, res) => {
    // Fetch the user's data from Firestore
    let snapshot = await firestore
      .collection("p_status")
      .where("pid", "==", Number(req.params.id))
      .get();
    if (snapshot.empty) {
      return res.status(404).send("Player not found");
    }
  
    let user = snapshot.docs[0].data();
  
    // Trigger the Lambda function
    let params = {
      FunctionName: "url_generator",
      InvocationType: "Event",
      Payload: JSON.stringify({
        receiverId: req.params.id,
        senderId: staticPlayerID,
      }), // pass the receiver's ID to the Lambda function
    };
  
    await lambda.invoke(params).promise();
  
    res.redirect("/add_members");
  });
  
  app.listen(3005, async () => {
    console.log("Server is running on port 3005");
    const open = (await import("open")).default;
    await open("http://localhost:3005"); // This will open the genteam.html page as the first page
  });
  