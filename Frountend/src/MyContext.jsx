import { createContext } from "react";
import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
export const MyContext = createContext("");
export function MyContextProvider({ children }) {
  const [prevChats, setPrevChats] = useState([]); //Store All chats of Current Thread
  const [newChat, setNewChat] = useState(true); //Check that it is new chat or old chat
  const [prompt, setPrompt] = useState("");
  const [allThread, setAllThread] = useState([]);
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
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
    }),
    [prompt, reply, currThreadId, newChat, prevChats, allThread]
  );
  return (
    <MyContext.Provider value={providerValues}>{children}</MyContext.Provider>
  );
}
