const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");
const app = express();

// Configuration of the AWS Cognito
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: "us-east-1",
  apiVersion: "2016-04-18",
});
app.use(bodyParser.json());

// Create new account in cognito userpool
const CreateAccount = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log(req.body);
    return res
      .status(400)
      .json({ message: "some required fields is not available." });
  }

  const parameters = {
    ClientId: process.env.CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };

  const createUser = (params, callback) => {
    cognito.signUp(params, (err, data) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      const userId = data.UserSub;
      return callback(null, userId);
    });
  };

  createUser(parameters, (err, userId) => {
    if (err) {
      return res.status(500).json({ message: "registration failed" });
    }
    return res.status(200).json({
      userId,
      message: "user created succesfully.",
    });
  });
};

// Verification of the new account using verification code.
const VerifyAccount = (req, res) => {
  const { userId, verificationCode } = req.body;

  const parameters = {
    ClientId: process.env.CLIENT_ID,
    Username: userId,
    ConfirmationCode: verificationCode,
  };

  const verifyUser = (params, callback) => {
    cognito.confirmSignUp(params, (err, data) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      const userId = data.UserSub;
      return callback(null, userId);
    });
  };

  verifyUser(parameters, (err) => {
    if (err) {
      return res.status(500).json({ message: "verification failed" });
    }
    return res.status(200).json({ message: "verification successful" });
  });
};

// Login in to account with valide credentials
const userLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Some required fields are missing." });
  }

  const parameters = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.CLIENT_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };

  const loginUser = (params, callback) => {
    cognito.initiateAuth(params, (err, data) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      const accessToken = data.AuthenticationResult.AccessToken;
      const idToken = data.AuthenticationResult.IdToken;
      const refreshToken = data.AuthenticationResult.RefreshToken;
      const tokens = {
        accessToken,
        idToken,
        refreshToken,
      };
      return callback(null, tokens);
    });
  };

  loginUser(parameters, (err, loginData) => {
    if (err) {
      return res.status(500).json({ message: "Login failed" });
    }
    return res.status(200).json({
      message: "Login successful.",
      email,
      token: loginData,
    });
  });
};

// Logout (Change the status into cognito to logout)
const logoutUser = (req, res) => {
  const { accessToken } = req.body;

  const parameters = {
    AccessToken: accessToken,
  };

  const logoutUser = (params, callback) => {
    cognito.globalSignOut(params, (err, data) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      return callback(null);
    });
  };

  logoutUser(parameters, (err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    return res.status(200).json({ message: "Logout successful" });
  });
};

// Password reset request
const passwordReset = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email is required for password reset." });
  }

  const parameters = {
    ClientId: process.env.CLIENT_ID,
    Username: email,
  };

  const initiatePasswordReset = (params, callback) => {
    cognito.forgotPassword(params, (err, data) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      return callback(null, data.CodeDeliveryDetails);
    });
  };

  initiatePasswordReset(parameters, (err, codeDeliveryDetails) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to initiate password reset" });
    }
    return res.status(200).json({
      codeDeliveryDetails,
      message: "Password reset initiated",
    });
  });
};

// confirm password verification using valide confirmation code
const ConfirmPasswordReset = (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  if (!email || !verificationCode || !newPassword) {
    return res
      .status(400)
      .json({ message: "Some required fields are missing." });
  }

  const parameters = {
    ClientId: process.env.CLIENT_ID,
    Username: email,
    ConfirmationCode: verificationCode,
    Password: newPassword,
  };

  const confirmPasswordReset = (params, callback) => {
    cognito.confirmForgotPassword(params, (err, data) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      return callback(null);
    });
  };

  confirmPasswordReset(parameters, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to confirm password reset" });
    }
    return res.status(200).json({ message: "Password reset successful" });
  });
};

// create new account and verify that account (google account option)
const CreateAndVerifyAccount = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log(req.body);
    return res
      .status(400)
      .json({ message: "some required fields are not available." });
  }

  const parameters = {
    ClientId: process.env.CLIENT_ID,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  };

  const createUser = (params, callback) => {
    cognito.signUp(params, (err, data) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      const userId = data.UserSub;
      return callback(null, userId);
    });
  };

  createUser(parameters, (err, userId) => {
    if (err) {
      return res.status(500).json({ message: "registration failed" });
    }

    // Automatically confirm the user registration (no verification code required)
    const confirmParams = {
      UserPoolId: "us-east-1_sImIA4ZSL",
      Username: email,
    };

    cognito.adminConfirmSignUp(confirmParams, (err, confirmData) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "verification failed" });
      }

      return res.status(200).json({
        userId,
        message: "user created and verified successfully.",
      });
    });
  });
};

// exporting all the methods.
module.exports = {
  CreateAccount,
  VerifyAccount,
  userLogin,
  logoutUser,
  passwordReset,
  ConfirmPasswordReset,
  CreateAndVerifyAccount,
};
