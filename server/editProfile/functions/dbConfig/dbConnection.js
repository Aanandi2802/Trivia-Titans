var admin = require("firebase-admin");

var serviceAccount = require("./service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

const QuestionsCollection = db.collection("Questions");
const UserResponseCollection = db.collection("UserResponses");

module.exports = db;
