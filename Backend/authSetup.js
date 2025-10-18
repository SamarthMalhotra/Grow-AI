import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/signup.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        if (!email || !password)
          return done(null, false, { message: "Input field is required" });
        const userInfo = await User.findOne({ email: email });
        console.log("User", userInfo);
        if (userInfo === null) {
          return done(null, false, {
            message: "You are not existing user Go for Signup",
          });
        }
        const isPasswordMatch = await userInfo.comparePassword(password);
        if (isPasswordMatch) {
          return done(null, userInfo);
        } else {
          return done(null, false, { message: "Incorrect Password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
export default passport;
