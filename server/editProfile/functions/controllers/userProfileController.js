const admin = require("firebase-admin");
const serviceAccount = require("../dbConfig/service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

//path: edit-user-data
exports.editUserData = async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.set('Access-Control-Allow-Methods', 'POST, PUT');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  try {
    const { firstName, lastName, age, password } = req.body;

    // Check if the provided 'firstName' exists in the collection
    const userSnapshot = await db.collection("userData")
      .where("firstName", "==", firstName)
      .get();

    if (userSnapshot.empty) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // There should be only one document with the provided firstName as it should be unique
    const userDoc = userSnapshot.docs[0];
    const pid = userDoc.id; // Get the 'pid' of the document

    // Prepare the data to be updated
    const updatedData = {};
    if (lastName) updatedData.lastName = lastName;
    if (age) updatedData.age = age;
    if (password) updatedData.password = password;

    // Update the user data in Firestore
    await userDoc.ref.update(updatedData);

    res.json({ message: "User data updated successfully.", pid: pid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error.", error: error });
  }
};

//path:get-notifications
exports.fetchNotifications = (async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.set('Access-Control-Allow-Methods', 'POST, PUT');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  try {
    // Fetch data from the "notifications" collection in Firestore
    const notificationsSnapshot = await admin.firestore().collection("notifications").get();

    // Process the query snapshot and extract data
    const notifications = [];
    notificationsSnapshot.forEach((doc) => {
      const notification = doc.data();
      notification.id = doc.id;
      notifications.push(notification);
    });

    // Send the notifications data in the response
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

//fetch team affiliation: fetch-stats
exports.fetchTeamAffiliation = (async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.set('Access-Control-Allow-Methods', 'POST, PUT');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  try {
    console.log("entered fetching");
    // Check if the provided 't_name' exists in the collection "p_req"
    const pReqSnapshot = await admin.firestore().collection("p_req").get();

    const requests = [];
      pReqSnapshot.forEach((doc) => {
        const treq = doc.data();
        treq.id = doc.id;
        requests.push(treq);
      });
      res.status(200).json({ requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error.", error: "Failed to fetch team affiliations"});
  }
});

//stats
exports.fetchScores = (async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT');

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.set('Access-Control-Allow-Methods', 'POST, PUT');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  try {

    // Check if the provided 't_name' exists in the collection "t_stats"
    const tStatsSnapshot = await admin.firestore().collection("t_stats").get();

    // Extract the data from the snapshot
    const tdata = [];
    tStatsSnapshot.forEach((doc) => {
      const tStatsData = doc.data();
      tStatsData.id = doc.id;
      tdata.push(tStatsData);
    });

    res.status(200).json({ tdata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error.", error: "Failed to get scores"});
  }
});
