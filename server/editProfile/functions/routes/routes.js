const express = require("express");
const router = express.Router();
const UserProfile = require("../controllers/userProfileController");

//edit user data
router.post("/edit-user-data", UserProfile.editUserData);

//get all notifications
router.post("/get-notifications", UserProfile.fetchNotifications);

//fetch invite requests from teams
router.post("/fetch-team-a", UserProfile.fetchTeamAffiliation);

//fetch team affiliations
router.post("/compare-score", UserProfile.fetchScores);

//update req to accept
router.post("/accept-request", UserProfile.updateRequestAccept);

//update req to reject
router.post("/reject-request", UserProfile.updateRequestReject);

// router.post("/team-affiliation", UserProfile.fetchDataByTName);

// router.post("/validate-answer", QAController.validateVeficationAnswer);
// router.post("/store-user-data", QAController.storeUserData);
// router.post("/get-user-data-by-email", QAController.getUserDataByEmail);
// router.post("/get-answer-by-email", QAController.getAnswerByEmail);
// router.post("/get-all-user-email", QAController.getAllUserEmails);
// router.post("/update-user-password", QAController.updateUserPassword);
// router.post("/get-online-users-emails", QAController.getOnlineUsersEmails);
// router.post("/set-user-status-offline", QAController.setUserStatusOffline);
// router.post("/getTag", QAController.getTag);

module.exports = { router };
