import darkstyles from "./MyToDoDark.module.css";
import lightstyles from "./MyToDoLight.module.css";
import { useContext, useEffect, useState } from "react";
import MyToDo from "./MyToDo";
import AddTask from "./AddTask";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "./ThemeContext";
import EditTask from "./EditTask";
import ViewTask from "./ViewTask";
import { useNavigate } from "react-router-dom";
import accountability from "./assets/accountability.png"
import logout from "./assets/logout.png"
import Snackbar from '@mui/material/Snackbar';
import leftArrow from "./assets/left-arrow.png"
function MyToDoMain() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const file = theme === "dark" ? darkstyles : lightstyles;
  const [snackMessage,setSnackMessage]=useState("")
    const [openS,setOpenS]=useState(false)
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenS(false); // 👋 Snackbar disappears
  };
  const [currentPage, setCurrentPage] = useState("tasks");
  const [taskID, setTaskID] = useState("");
  const [viewTaskID, setViewTaskID] = useState("");
  const [viewTaskDetails, setViewTaskDetails]=useState({
    title:"",
    description:"",
    priority:"",
    due_date:""
  })
  const navigate = useNavigate();

  // ✅ Redirect if token not present
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // go back to login
    }
  }, [navigate]);

  const renderPage = () => {
    let PageComponent;
    switch (currentPage) {
      case "tasks":
        PageComponent = <MyToDo setCurrentPage={setCurrentPage} setTaskID={setTaskID} setViewTaskDetails={setViewTaskDetails} setViewTaskID={setViewTaskID} setSnackMessage={setSnackMessage} openS={openS} setOpenS={setOpenS}/>;
        break;
      case "addTask":
        PageComponent = <AddTask setCurrentPage={setCurrentPage} setSnackMessage={setSnackMessage} openS={openS} setOpenS={setOpenS}/>;
        break;
      case "editTask":
        if (taskID){

          PageComponent = <EditTask taskKey={taskID} setCurrentPage={setCurrentPage} setSnackMessage={setSnackMessage} openS={openS} setOpenS={setOpenS}/>;
        }
        break;
      case "viewTask":
        PageComponent = <ViewTask  title={viewTaskDetails.title} description={viewTaskDetails.description} due_date={viewTaskDetails.due_date} priority={viewTaskDetails.priority} setCurrentPage={setCurrentPage} viewTaskID={viewTaskID}  setTaskID={setTaskID} setSnackMessage={setSnackMessage} openS={openS} setOpenS={setOpenS}/>;
        break;
      default:
        PageComponent = <MyToDo setCurrentPage={setCurrentPage} setTaskID={setTaskID} />;
    }

    return (
      <motion.div
        key={currentPage}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={file.pageWrapper}
        style={{ height: "100%" }}
      >
        {PageComponent}
      </motion.div>
    );
  };
  const handleLogout = () => {
  // 🧹 Clear JWT token
  localStorage.removeItem("token"); // or sessionStorage.removeItem("token")
    localStorage.removeItem("user_id")
  // 🚀 Redirect to login page
  window.location.href = "/login";
};

  return (
    <div className={file.mytodoMainDiv}>
      <div className={file.topBar}>
        <div className={file.icoDiv}>
          <img src={accountability} alt="icon" />
          Taskify
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* <button className={file.themeBtn} onClick={toggleTheme}>
            {theme === "dark" ? "Light" : "Dark"} Mode
          </button> */}

        <label className="switch">
        <span className="sun"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r={5} cy={12} cx={12} /><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z" /></g></svg></span>
        <span className="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" /></svg></span>   
        <input type="checkbox" className="input" checked={theme === "dark"} onClick={toggleTheme}/>
        <span className="slider" />
      </label>
          <img src={logout} alt="logout" style={{width:"27px",height:"27px",filter:theme==="dark"?"invert()":null}} onClick={handleLogout}/>
        </div>

      </div>

      <div className={file.mainContent}>
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </div>
      <Snackbar
        open={openS}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
}

export default MyToDoMain;
