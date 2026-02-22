const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/connectDB");

dotenv.config();
connectDB();

const app = express();

app.listen(5000, () => console.log("Server running"));