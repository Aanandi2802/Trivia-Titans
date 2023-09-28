const express = require("express");

const UserController = require("../controllers/userController");

const router = express.Router();
// Create new account in cognito userpool
router.post("/createAccount", UserController.CreateAccount);

// verify the accoud
router.post("/verifyAccount", UserController.VerifyAccount);

// Login in to account
router.post("/login", UserController.userLogin);

// Send reset passowrd request
router.post("/resetPassword", UserController.passwordReset);

// Verify pin for password reset
router.post("/verifyReset", UserController.ConfirmPasswordReset);

// logout user mease change status in congnito
router.post("/logout", UserController.logoutUser);

// creat account for google
router.post("/CreateAndVerifyAccount", UserController.CreateAndVerifyAccount);

module.exports = router;
