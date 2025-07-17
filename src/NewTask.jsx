import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

function NewTask({ taskID, userID, theme, title, status, body, date, priority, mode, setCurrentPage, setTaskID ,setViewTaskDetails, setViewTaskID}) {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const deleteTask = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/task/${taskID}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                alert("Task deleted Successfully");
                queryClient.invalidateQueries(["tasks", userID]);
            } else {
                console.error(data.detail || "Failed to delete task");
            }
        } catch (error) {
            console.error("Error deleting task: ", error);
        }
    };

    const handleCheckBox = async (taskId, currentStatus) => {
        try {
            const res = await fetch(`http://localhost:8000/api/task/${taskId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: !currentStatus }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            queryClient.invalidateQueries(["tasks", userID]);
        } catch (err) {
            console.error("Error updating task status:", err);
        }
    };
    const handleClickDiv=(e)=>{
        if (e.target.tagName!=="IMG" && e.target.tagName!=="INPUT" && e.target.id!=="exclude"){
            // console.log("Clicked the div",e.target.tagName)
            setViewTaskDetails({
                title:title,
                description:body,
                priority:priority,
                due_date:date
            })
            setCurrentPage("viewTask");
            setViewTaskID(taskID)
        }
    }
    return (
        <div className={theme.task} onClick={handleClickDiv}>
            <label className={theme.roundCheckbox}>
                <input
                    type="checkbox"
                    checked={status}
                    onChange={() => handleCheckBox(taskID, status)}
                />
                <span className={theme.checkmark} id="exclude"></span>
            </label>
            <div className={theme.taskSide}>
                <div className={theme.taskTop}>
                    <span className={theme.truncate}>{title}</span>
                    <div className={priority === "High" ? theme.high : theme.low}>{priority}</div>
                </div>
                <div className={theme.taskMid}>
                    <span className={theme.truncate}>{body}</span>
                </div>
                <div className={theme.taskBottom}>
                    <div className={theme.moreOptions}>
                        <img
                            src={mode === "dark" ? "src/assets/editing-white.png" : "src/assets/editing.png"}
                            alt="edit"
                            onClick={() => {
                                setTaskID(taskID);
                                setCurrentPage("editTask");
                            }}
                        />
                        <img
                            src="src/assets/delete.png"
                            alt="delete"
                            onClick={(e) => {
                                e.preventDefault();
                                deleteTask();
                            }}
                        />
                    </div>
                    <span>Due <span>{date}</span></span>
                </div>
            </div>
        </div>
    );
}

export default NewTask;
