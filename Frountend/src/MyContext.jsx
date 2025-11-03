import { createContext } from "react";
import { useState, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
export const MyContext = createContext("");
export function MyContextProvider({ children }) {
  const [prevChats, setPrevChats] = useState([]); //Store All chats of Current Thread
  const [newChat, setNewChat] = useState(true); //Check that it is new chat or old chat
  const [prompt, setPrompt] = useState("");
  const [allThread, setAllThread] = useState([]);
  const [reply, setReply] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
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

  function removeTokenIfExpired() {
    const token = localStorage.getItem("token");
    //console.log("Hello1");
    if (!token) return false;
    //console.log("Step 2");
    try {
      // Decode the JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));

      // `exp` comes in seconds → convert to milliseconds
      const expiryTime = payload.exp * 1000;
      // console.log(expiryTime);

      // Check if expired
      if (Date.now() > expiryTime) {
        localStorage.removeItem("token");
        //console.log("Token removed: expired");
        return false;
      }
    } catch (err) {
      // If token is corrupted, remove it
      localStorage.removeItem("token");
      console.log("Invalid token removed");
      return false;
    }
  }
  const providerValues = useMemo(
    () => ({
      prompt,
      setPrompt,
      reply,
      setReply,
      currThreadId,
      setCurrThreadId,
      newChat,
      setNewChat,
      prevChats,
      setPrevChats,
      allThread,
      setAllThread,
      sidebar,
      setSidebar,
      removeTokenIfExpired,
    }),
    [prompt, reply, currThreadId, newChat, prevChats, allThread, sidebar]
  );
  return (
    <MyContext.Provider value={providerValues}>{children}</MyContext.Provider>
  );
}
