import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRouter from "./routes/authentication.js";
import passport from "passport";
import "./authSetup.js";
import { useCallback } from "react";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const app = express();
//
app.use(express.json());
const origins = [
  "http://localhost:8080",
  "https://grow-aibackend.onrender.com",
];
//
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT;
app.use(
  cors({
    origin: (origin, callback) => {
      if (origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by cors"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(passport.initialize());
app.use("/api", chatRoutes);
//console.log("Hello");
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
