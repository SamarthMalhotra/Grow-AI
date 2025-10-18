import styles from "./Chat.module.css";
import { useContext, useState, useEffect } from "react";
import ReactMarkDown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { MyContext } from "./MyContext";
import "highlight.js/styles/github-dark.css";
function Chat() {
  const { newChat, reply, prevChats } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats?.length) return;

    const content = reply.split("");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(""));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [prevChats, reply]);
  return (
    <>
      {newChat && <h1>Start a new Chat</h1>}

      <div className={styles["chats"]}>
        {prevChats?.slice(0, -1).map((chat, id) => (
          <div
            className={
              chat.role === "user" ? styles["userDiv"] : styles["gptDiv"]
            }
            key={id}
          >
            {chat.role === "user" ? (
              <p className={styles["userMessage"]}>{chat.content}</p>
            ) : (
              <ReactMarkDown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkDown>
            )}
          </div>
        ))}
        {prevChats.length > 0 && (
          <>
            {latestReply === null ? (
              <div className={styles["gptDiv"]} key={"non-typing"}>
                <ReactMarkDown rehypePlugins={[rehypeHighlight]}>
                  {prevChats[prevChats.length - 1].content}
                </ReactMarkDown>
              </div>
            ) : (
              <div className={styles["gptDiv"]} key={"typing"}>
                <ReactMarkDown rehypePlugins={[rehypeHighlight]}>
                  {latestReply}
                </ReactMarkDown>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default Chat;
