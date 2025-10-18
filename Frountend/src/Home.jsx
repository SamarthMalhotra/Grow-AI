import Sidebar from "./Sidebar.jsx"
import ChatWindow from "./ChatWindow.jsx"
import "./Home.css"
function Home(){

return(<>
<div className='app'>
          <Sidebar></Sidebar>
         <ChatWindow></ChatWindow>
      </div>
</>)
}
export default Home;