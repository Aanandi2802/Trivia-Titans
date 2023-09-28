const admin = require("firebase-admin");
const serviceAccount = require("../dbConfig/service-account-key.json");
const language = require("@google-cloud/language");
const client = new language.LanguageServiceClient();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// store the security answer into the firebase collection which name is "verificationAnswers"
exports.storeVerificationAnswer = async (req, res) => {
  try {
    // getting userId (email) from the client (frontend)
    const userId = req.body.userID;

    // save answer in collection with q1, q2 and q3
    const data = {
      q1: req.body.q1,
      q2: req.body.q2,
      q3: req.body.q3,
      email: req.body.userID,
    };
    await db.collection("verificationAnswers").doc(userId).set(data);
    res.json({
      message: "User response added",
      isAdded: true,
      email: userId,
    });
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

// After succesfully login, validate one randum quetion from the user
exports.validateVeficationAnswer = async (req, res) => {
  try {
    // getting one question answer with the quetion numer alogn with the login email.
    const email = req.body.email;
    const questionId = req.body.questionId;
    const userAnswer = req.body.answer;

    const responseRef = db.collection("verificationAnswers").doc(email);
    const responseDoc = await responseRef.get();
    // If the user not found.
    if (!responseDoc.exists) {
      return res.json({
        message: "User response not found",
        isFound: false,
      });
    }

    const expectedAnswers = responseDoc.data();

    if (!(questionId in expectedAnswers)) {
      return res.json({
        message: "Question not found for the user",
        isValid: false,
      });
    }

    const expectedAnswer = expectedAnswers[questionId];

    // Anser match successfully menas validation pass.
    if (userAnswer === expectedAnswer) {
      return res.json({
        message: "Validation successful",
        isValid: true,
      });
    } else {
      return res.json({
        message: "Validation unsuccessful",
        isValid: false,
      });
    }
  } catch (error) {
    const errorMessage = {
      message: "Internal Server Error.",
      error: error,
    };
    res.send(errorMessage);
  }
};

// After the successul signup (registration) store the user data into the firebase collection which name is "userData"
exports.storeUserData = async (req, res) => {
  try {
    const { firstName, lastName, email, age, password } = req.body;

    // Generate a random numeric player ID (pid) with five digits
    const pid = Math.floor(10000 + Math.random() * 90000);

    const data = {
      firstName: firstName,
      lastName: lastName,
      age: age,
      email: email,
      password: password,
      pid: pid,
      t_name: "None",
      admin: false,
    };

    await db.collection("userData").doc(firstName).set(data);

    const statusData = {
      email: email,
      pid: pid,
      status: "online",
      firstName: firstName,
    };

    await db.collection("p_status").doc(email).set(statusData);

    res.json({
      message: "New User Data added.",
      isAdded: true,
      email: email,
    });
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

// get all the user details by user email ID.
exports.getUserDataByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const snapshot = await db
      .collection("userData")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      res.json({
        message: "User not found.",
        isFound: false,
        email: email,
      });
    } else {
      let userData;
      snapshot.forEach((doc) => {
        userData = doc.data();
      });

      res.json({
        message: "User found.",
        isFound: true,
        userData: userData,
      });
    }
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

// Get user security question answers for the update
exports.getAnswerByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is provided in the request parameters
    if (!email) {
      return res.status(400).json({
        message: "Email ID not provided.",
      });
    }

    // Fetch verification answers from the "verificationAnswers" collection based on the email ID
    const snapshot = await db
      .collection("verificationAnswers")
      .where("email", "==", email)
      .get();

    // Check if there are any documents with the provided email in the database
    if (snapshot.empty) {
      return res.status(404).json({
        message: "No verification answers found for the given email.",
        email: email,
      });
    }
    const verificationAnswers = [];

    snapshot.forEach((doc) => {
      verificationAnswers.push(doc.data());
    });

    res.json({
      message: "Verification answers found.",
      verificationAnswers: verificationAnswers,
    });
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

// To get the all registered users email ID.
exports.getAllUserEmails = async (req, res) => {
  try {
    const snapshot = await db.collection("userData").get();

    if (snapshot.empty) {
      res.json({
        message: "No users found.",
        userEmails: [],
      });
    } else {
      const userEmails = [];
      snapshot.forEach((doc) => {
        const userData = doc.data();
        userEmails.push(userData.email);
      });

      res.json({
        message: "Registered user emails retrieved successfully.",
        userEmails: userEmails,
      });
    }
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

// Get users which status is online:
exports.getOnlineUsersEmails = async (req, res) => {
  try {
    // Fetch all documents from the "p_status" collection with status set to "online"
    const snapshot = await db
      .collection("p_status")
      .where("status", "==", "online")
      .get();

    // Initialize an array to store the email IDs of online users
    const onlineUserEmails = [];

    // Loop through the snapshot and extract the email from each document
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email) {
        onlineUserEmails.push(data.email);
      }
    });

    res.json({
      message: "List of online user emails.",
      onlineUserEmails: onlineUserEmails,
    });
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

// when the user logout change the user status to "offline"
exports.setUserStatusOffline = async (req, res) => {
  try {
    const { email } = req.body;

    // Fetch the user document from the "p_status" collection based on the email
    const userDocRef = db.collection("p_status").doc(email);
    const snapshot = await userDocRef.get();

    // Check if the user exists in the database
    if (!snapshot.exists) {
      return res.status(404).json({
        message: "User not found.",
        email: email,
      });
    }

    // Update the status to "offline" in the user document
    await userDocRef.update({
      status: "offline",
    });

    res.json({
      message: "User status set to offline.",
      email: email,
    });
  } catch (error) {
    console.log(error);

    res.json({
      message: "Internal Server Error.",
      error: error,
    });
  }
};

// Get automatic question tagging by just giving the question and some hint or addition information
exports.getTag = async (req, res) => {
  const text = req.body.question;

  // Prepare a document to be analyzed
  const document = {
    content: text,
    type: "PLAIN_TEXT",
  };

  try {
    // Detect the categories
    const [classification] = await client.classifyText({ document });

    // Extract the name of the first category, if any
    const categoryFullPath =
      classification.categories.length > 0
        ? classification.categories[0].name
        : "General";

    const category = categoryFullPath.split("/").pop();

    res.json({ tag: category });
  } catch (error) {
    console.error(`Failed to classify text: ${error}`);
    res.status(500).send({ error: "Failed to classify text" });
  }
};
