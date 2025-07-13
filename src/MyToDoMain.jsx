import darkstyles from "./MyToDoDark.module.css";
import lightstyles from "./MyToDoLight.module.css";
import { useContext, useState } from "react";
import MyToDo from "./MyToDo";
import AddTask from "./AddTask";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "./ThemeContext";
import EditTask from "./EditTask";
function MyToDoMain() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const file = theme === "dark" ? darkstyles : lightstyles;

  const [currentPage, setCurrentPage] = useState("tasks");
  const [taskID,setTaskID]=useState("")

  const renderPage = () => {
    let PageComponent;
    switch (currentPage) {
      case "tasks":
        PageComponent = <MyToDo setCurrentPage={setCurrentPage} setTaskID={setTaskID}/>;
        break;
      case "addTask":
        PageComponent = <AddTask setCurrentPage={setCurrentPage} />;
        break;
      case "editTask":
        PageComponent= <EditTask taskKey={taskID} setCurrentPage={setCurrentPage}/>;
        break;
      default:
        PageComponent = <MyToDo setCurrentPage={setCurrentPage} />;
    }

    return (
      <motion.div
        key={currentPage}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={file.pageWrapper}
        style={{height:"100%"}}
      >
        {PageComponent}
      </motion.div>
    );
  };

  return (
    <div className={file.mytodoMainDiv}>
      <div className={file.topBar}>
        <div className={file.icoDiv}>
          <img src="src/assets/accountability.png" alt="icon" />
          Taskify
        </div>
        <button
          className={file.themeBtn}
          onClick={toggleTheme}
        >
          {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>

      <div className={file.mainContent}>
        <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
      </div>
    </div>
  );
}

export default MyToDoMain;
