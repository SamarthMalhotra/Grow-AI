import express from "express";
import getOpenAIAPIResponse from "../utils/openai.js";
import Thread from "../models/thread.js";
import User from "../models/signup.js";
import { jwtAuthMiddleware } from "../jwt.js";
const router = express.Router();

// This route is used to get the previous store thread history of that user
router.get("/thread", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user.userData;
    const userInfo = await User.findOne({ email: userData.email });
    // const threads = await Thread.find({}).sort({ updatedAt: -1 });
    const userThread = await userInfo.populate({
      path: "threads",
      options: { sort: { updatedAt: -1 } },
    });
    //desending of updateAt ...most recent data on to
    res.json(userThread.threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to fetch threads" });
  }
});

//Route to get particular thread of user on the bases of threadId
router.get("/thread/:threadId", jwtAuthMiddleware, async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    const userData = req.user.userData;
    const userInfo = await User.findOne({ email: userData.email });
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
    } else if (
      userInfo.threads.find((element) => element._id.equals(thread._id))
    ) {
      res.json(thread.messages);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "failed to fetch chat" });
  }
});

//Route for delete the thread of user
router.delete("/thread/:threadId", jwtAuthMiddleware, async (req, res) => {
  const { threadId } = req.params;
  const data = req.user.userData;
  try {
    const userInfo = await User.findOne({ email: data.email });
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      res.status(404).json({ error: "Thread not found" });
    }
    userInfo.threads = userInfo.threads.filter(
      (element) => !element._id.equals(deletedThread._id)
    );
    userInfo.save();
    res.status(200).json({ success: "Thread Deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete Thread" });
  }
});

// IT is route to get the prompt of user and threadId and send the response
router.post("/chat", jwtAuthMiddleware, async (req, res) => {
  const { threadId, message } = req.body;
  let userDate = req.user.userData;
  if (!threadId || !message || !userDate) {
    res.status(400).json({ error: "Missing required field" });
  }
  try {
    let userinfo = await User.findOne({ email: userDate.email });
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      //create a new thread
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
      userinfo.threads.push(thread._id);
      userinfo.save();
    } else if (
      userinfo.threads.find((element) => element._id.equals(thread._id))
    ) {
      thread.messages.push({ role: "user", content: message });
    } else {
      res.status(401).json("Something  Wrong");
    }
    const assistantReply = await getOpenAIAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

//
export default router;
