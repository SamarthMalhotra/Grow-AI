import "./App.css";
import { MyContextProvider } from "./MyContext.jsx";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
      <MyContextProvider>
        <Outlet />
      </MyContextProvider>
    </>
  );
}

export default App;
