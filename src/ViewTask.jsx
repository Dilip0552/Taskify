import { ThemeContext } from "./ThemeContext"
import { useContext } from "react"
import darkstyles from "./MyToDoDark.module.css"
import lightstyles from "./MyToDoLight.module.css"
import { useQueryClient } from '@tanstack/react-query';
import leftArrow from "./assets/left-arrow.png"
function ViewTask({title,description,priority,due_date,setCurrentPage,viewTaskID, setTaskID,setSnackMessage,setOpenS}){
    const {theme,setTheme}=useContext(ThemeContext)
    const file = theme === "dark" ? darkstyles : lightstyles;
    const queryClient=useQueryClient()
    const userID = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    const deleteTask = async () => {
        try {
            const res = await fetch(`https://taskify-la02.onrender.com/api/task/${viewTaskID}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                setSnackMessage("Task deketed Successfully");
                setOpenS(true)
                queryClient.invalidateQueries(["tasks", userID]);
                setCurrentPage("tasks")
            } else {
                console.error(data.detail || "Failed to delete task");
            }
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    };
    return (
        <div className={file.vtContainer}>

        <div className={file.vtMain}>
            <div className={file.vtTop}><img src={leftArrow} alt="back" onClick={() => setCurrentPage("tasks")}/><input readOnly={theme==="light"} value={title}/></div>
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
                <button className={file.vtDeleteBtn} onClick={(e)=>{
                    e.preventDefault();
                    deleteTask();
                }}>Delete</button>
            </div>
        </div>
        </div>
    )
}
export default ViewTask