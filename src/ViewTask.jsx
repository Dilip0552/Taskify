import { ThemeContext } from "./ThemeContext"
import { useContext } from "react"
import darkstyles from "./MyToDoDark.module.css"
import lightstyles from "./MyToDoLight.module.css"
import { div } from "framer-motion/client"
function ViewTask({title,description,priority,due_date,setCurrentPage,viewTaskID, setTaskID}){
    const {theme,setTheme}=useContext(ThemeContext)
      const file = theme === "dark" ? darkstyles : lightstyles;
    return (
        <div className={file.vtContainer}>

        <div className={file.vtMain}>
            <div className={file.vtTop}><img src="src/assets/left-arrow.png" alt="back" onClick={() => setCurrentPage("tasks")}/><input readOnly={theme==="light"} value={title}/></div>
            <div className={`${file.vtPriority} ${priority==="Low"?file.low:file.high}`}>{priority}</div>
            <div className={file.vtDescription}>
                <span>Description</span>
                <p>{description}</p>
            </div>
            <div className={file.vtDueDate}>
                <span>Due Date</span>
                <p>{due_date}</p>
            </div>
            <div className={file.vtMoreOptions}>
                <button className={file.vtEditBtn} onClick={()=>{setCurrentPage("editTask")
                    setTaskID(viewTaskID)
                }}>Edit</button >
                <button className={file.vtDeleteBtn}>Delete</button>
            </div>
        </div>
        </div>
    )
}
export default ViewTask