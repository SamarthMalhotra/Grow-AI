import styles from "./Sidebar.module.css";
import { v4 as uuidv4 } from "uuid";
import { RiCloseLine } from "react-icons/ri";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { useNavigate } from "react-router-dom";
import server from "./environment.js";

function Sidebar() {
  // Context
  const {
    allThread,
    setAllThread,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setSidebar,
    setPrevChats,
    sidebar,
    removeTokenIfExpired,
  } = useContext(MyContext);

  const navigate = useNavigate();
  //Delete Thread
  const deleteThread = async (threadId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${server}/api/thread/${threadId}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();

      //Update Thread re-render
      setAllThread((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (e) {
      console.log(err);
    }
  };
  //get all thread
  const getAllThread = async () => {
    try {
      const removeExpToken = removeTokenIfExpired();
      const token = localStorage.getItem("token");
      if (!token && !removeExpToken) {
        let aler = true;
        setTimeout(() => {
          if (aler) {
            alert("Please Login first.");
            aler = false;
          }
          navigate("/auth/login");
        }, 4000);
        return; // Stop if token is missing
      }
      const response = await fetch(`${server}/api/thread`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const res = await response.json();
        const filterData = res.map((thread) => ({
          threadId: thread.threadId,
          title: thread.title,
        }));
        setAllThread(filterData);
      } else {
        // Handle backend error messages
        const errorText = await response.json();
        //console.log("Hello", errorText.message);
      }
    } catch (e) {
      console.log("Fetch error:", e);
    }
  };

  useEffect(() => {
    getAllThread();
  }, [currThreadId]);

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${server}/api/thread/${newThreadId}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: undefined,
      });
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]);
  };
  return (
    <>
      <section className={`${styles.sidebar} ${sidebar ? styles.active : ""}`}>
        <button onClick={createNewChat}>
          <img
            src="https://res.cloudinary.com/duryxhwcp/image/upload/v1760851422/Logo_yx3jib.jpg"
            className={styles["logo"]}
            alt="gpt logo"
          ></img>
          <span>
            {" "}
            <i className="fa-solid fa-pen-to-square"></i>
          </span>
        </button>
        <ul className={styles["history"]}>
          {allThread?.map((thread, idx) => (
            <li
              onClick={() => changeThread(thread.threadId)}
              key={idx}
              className={
                thread.threadId === currThreadId ? styles["highlighted"] : ""
              }
            >
              {thread.title}
              <i
                className={`fa-solid fa-trash ${styles["fa-trash"]}`}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>
        <div className={styles["sign"]}>
          <p>By Grow AI &hearts;</p>
        </div>
        {sidebar && (
          <span
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              zIndex: "2000",
              fontSize: "2.5rem",
            }}
          >
            <RiCloseLine onClick={() => setSidebar((prev) => !prev)} />
          </span>
        )}
      </section>
    </>
  );
}
export default Sidebar;
