import bcrypt from "bcrypt";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /@/,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must be 8 character long"],
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});
userSchema.pre("save", async function (next) {
  const person = this;
  try {
    if (!person.isModified("password")) {
      return next();
    }
    let newPassword = await bcrypt.hash(person.password, 10);
    console.log(newPassword);
    person.password = newPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};
const User = mongoose.model("User", userSchema);
export default User;
