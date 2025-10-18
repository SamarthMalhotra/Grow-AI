import styles from "./ChatWindow.module.css";
import { MyContext } from "./MyContext.jsx";
import Chat from "./Chat.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { BiExit } from "react-icons/bi";
import server from "./environment.js";
function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setSidebar,
  } = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const getReply = async () => {
    setLoader(true);
    const token = localStorage.getItem("token");
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch(`${server}/api/chat`, options);
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoader(false);
  };
  //Append new Chat to prevChats
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          role: "user",
          content: prompt,
        },
        {
          role: "assistant",
          content: reply,
        },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={styles["chatWindow"]}>
      <div className={styles["navbar"]}>
        <span className={styles["sideBarIcon"]}>
          <BiExit onClick={() => setSidebar((prev) => !prev)} />
        </span>
        <span>
          Grow AI<i className="fa-solid fa-chevron-down"></i>
        </span>

        <div className={styles["userIconDiv"]} onClick={handleProfileClick}>
          <span className={styles["userIcon"]}>
            <i className="fa-solid fa-user"></i>
          </span>
          <span>
            {" "}
            <Link to="/auth/login" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </span>
          <span>
            {" "}
            <Link to="/auth/signup" style={{ textDecoration: "none" }}>
              {" "}
              SignUp{" "}
            </Link>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className={styles["dropDown"]}>
          <div className={styles["dropDownItem"]}>
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          <div className={styles["dropDownItem"]}>
            <i className="fa-solid fa-gear"></i> Setting{" "}
          </div>
          <div className={styles["dropDownItem"]}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
          </div>
        </div>
      )}
      <Chat></Chat>
      <ScaleLoader loading={loader} color={"white"}></ScaleLoader>
      <div className={styles["chatInput"]}>
        <div className={styles["inputBox"]}>
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          ></input>
          <div className={styles["submit"]} onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className={styles["info"]}>
          Grow AI can make mistakes.Check important info.See{" "}
          <a href="#">Cookies Preferences</a>
        </p>
      </div>
    </div>
  );
}
export default ChatWindow;
