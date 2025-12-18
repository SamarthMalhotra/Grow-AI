import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRouter from "./routes/authentication.js";
import passport from "passport";
import "./authSetup.js";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const app = express();

//It convert json data  into request body.
//We didnot need to install separate body parser middleware
app.use(express.json());
//It extend the json string data into js objet
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;

// app.use(cors(corsOptions));
// This ensures preflight requests are handled
app.use("/api", cors());
app.use(passport.initialize());
app.use("/api", chatRoutes);
app.use("/api/auth", authRouter);
app.listen(port, () => {
  console.log(`Server is running on the Port ${port}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected with database");
  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
};
//
