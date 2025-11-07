import express from "express";
import User from "../models/signup.js";
import passport from "passport";
import { generateToken } from "../jwt.js";
import { jwtAuthMiddleware } from "../jwt.js";
const router = express.Router();

//This is signup route
router.post("/signup", async (req, res) => {
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
    res
      .status(400)
      .json({ success: false, message: "Input fields are missing." });
  }
  try {
    username = username.trim();
    email = email.trim();
    password = password.trim();
    const token = generateToken({ email: email, password: password });
    const newUser = new User({
      username,
      email,
      password,
    });
    const userdata = await newUser.save();
    res
      .status(200)
      .json({ success: "You signup is done successfully", token: token });
  } catch (e) {
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern)[0];
      res
        .status(400)
        .json({ success: false, message: `Error ${field} already exist` });
    } else {
      res.status(400).json({ success: false, message: ` Server Error ${e}` });
    }
  }
});

//This is login route
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Server error",
        });
      }
      // Wrong email or password
      if (!user) {
        return res.status(400).json({
          success: false,
          message: info?.message || "Invalid credentials",
        });
      }
      // Successful login
      try {
        const token = generateToken({
          email: user.email,
          password: user.password,
        });
        return res.status(200).json({ success: true, token });
      } catch (e) {
        return res.status(500).json({
          success: false,
          message: "Token generation failed",
        });
      }
    }
  )(req, res, next); //this executes passport.authenticate
});

router.post("/logout", jwtAuthMiddleware, async (req, res) => {
  let userData = req.user.userData;
  try {
    const userInfo = await User.findOne({ email: userData.email });
    if (userInfo == null) {
      return res.status(401).json("User not found");
    }
    return res.status(200).json("Logout");
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
});

export default router;
