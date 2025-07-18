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
import accountability from "./assets/left-arrow.png"
function MyToDoMain() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const file = theme === "dark" ? darkstyles : lightstyles;

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
        PageComponent = <MyToDo setCurrentPage={setCurrentPage} setTaskID={setTaskID} setViewTaskDetails={setViewTaskDetails} setViewTaskID={setViewTaskID}/>;
        break;
      case "addTask":
        PageComponent = <AddTask setCurrentPage={setCurrentPage} />;
        break;
      case "editTask":
        PageComponent = <EditTask taskKey={taskID} setCurrentPage={setCurrentPage} />;
        break;
      case "viewTask":
        PageComponent = <ViewTask  title={viewTaskDetails.title} description={viewTaskDetails.description} due_date={viewTaskDetails.due_date} priority={viewTaskDetails.priority} setCurrentPage={setCurrentPage} viewTaskID={viewTaskID}  setTaskID={setTaskID}/>;
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className={file.themeBtn} onClick={toggleTheme}>
            {theme === "dark" ? "Light" : "Dark"} Mode
          </button>
          <img src="src/assets/logout.png" alt="logout" style={{width:"30px",height:"30px",filter:theme==="dark"?"invert()":null}} onClick={handleLogout}/>
        </div>

      </div>

      <div className={file.mainContent}>
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </div>
    </div>
  );
}

export default MyToDoMain;
