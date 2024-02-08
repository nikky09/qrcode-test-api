// imports

const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const registerRoute = require("./routes/User");
dotenv.config();

// app configs

const app = express();
const port = process.env.Port || 8800;

const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

// middlewares

app.use(express.json());
app.use(cors(corsOptions));

// Db config

const mongo_url = process.env.Mongo_Url;
mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// db connection
const db = mongoose.connection;

db.once("open", () => {
  console.log("connected to mongo and we are set!!");
});

// api endpoint

// home page
app.get("/api/v1", (req, res) =>
  res.status(200).json({
    message: "Welcome to my app",
  })
);

// register
app.use("/api/v1/auth", registerRoute);

// port listen
app.listen(port, console.log(`hey am connected to port: ${port}`));
