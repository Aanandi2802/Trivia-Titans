const cors = require("cors");
const router = require("./Routes/userRoutes");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/user", router);

app.get("/hello", (req, res) => {
  res.send("This is working.");
});
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
