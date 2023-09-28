const firestore = require("@google-cloud/firestore");

//creating a new firestore object using the credential file
const db = new firestore({
  projectId: "serverless-project-392613",
  keyFilename: "./key.json",
});

module.exports = db;
