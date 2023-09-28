const express = require("express");
const router = express.Router();
const QAController = require("../controllers/authController");

// Store the users security question answer into the firestore collection.
router.post("/store-user-response", QAController.storeVerificationAnswer);

// Validate one answer when user sucssessfully login.
router.post("/validate-answer", QAController.validateVeficationAnswer);

// Store the user data into the collection for further use.
router.post("/store-user-data", QAController.storeUserData);

// Get particullar user data from the firstore collection.
router.post("/get-user-data-by-email", QAController.getUserDataByEmail);

// Get the security question answer for the update.
router.post("/get-answer-by-email", QAController.getAnswerByEmail);

// Get all registerd user email ID.
router.post("/get-all-user-email", QAController.getAllUserEmails);

// Update the passord in collection.
router.post("/update-user-password", QAController.updateUserPassword);

// Give all the users email which status is online.
router.post("/get-online-users-emails", QAController.getOnlineUsersEmails);

// Set user status online when they do logout.
router.post("/set-user-status-offline", QAController.setUserStatusOffline);

// Generate the question tag automatically.
router.post("/getTag", QAController.getTag);

module.exports = { router };
