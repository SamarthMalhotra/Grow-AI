/* The code you provided is a React component called `ChatWindow`. Here is a breakdown of what the code
is doing: */
import styles from "./ChatWindow.module.css";
import { MyContext } from "./MyContext.jsx";
import Chat from "./Chat.jsx";
import { useContext, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { BiExit } from "react-icons/bi";
import server from "./environment.js";
function ChatWindow() {
  const {
    prompt,
    setPrompt,
    setReply,
    currThreadId,
    setSidebar,
    checkAuth,
    handleLogout,
  } = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [contrast, setContrast] = useState(false);

  //IT is a function whic  is used to  get the reply from API
  const getReply = async () => {
    if (prompt.length > 0) {
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
    }
    setLoader(false);
  };
  // // This function is use to handleLogout
  // const handleLogout = async () => {
  //   setContrast(true);
  //   let token = localStorage.getItem("token");
  //   const options = {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   try {
  //     const data = await fetch(`${server}/api/auth/logout`, options);
  //     if (data.ok) {
  //       localStorage.removeItem("token");
  //       window.location.reload();
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
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
          {checkAuth && (
            <span>
              {" "}
              <Link to="/auth/login" style={{ textDecoration: "none" }}>
                Login
              </Link>
            </span>
          )}
          {checkAuth && (
            <span>
              {" "}
              <Link to="/auth/signup" style={{ textDecoration: "none" }}>
                {" "}
                SignUp{" "}
              </Link>
            </span>
          )}
          {!checkAuth && (
            <span>
              {" "}
              <Link onClick={handleLogout} style={{ textDecoration: "none" }}>
                {" "}
                Logout{" "}
              </Link>
            </span>
          )}
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
          <div
            className={
              !contrast ? styles["dropDownItem"] : styles["dropDownItemActive"]
            }
            onClick={handleLogout}
          >
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (!loader) {
                  getReply();
                }
              }
            }}
          ></input>
          <div
            className={styles["submit"]}
            onClick={() => {
              if (!loader) {
                getReply();
              }
            }}
          >
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
