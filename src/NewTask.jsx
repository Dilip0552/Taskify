import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import editing from "./assets/editing.png"
import editingWhite from "./assets/editing-white.png"
import deleteicon from "./assets/delete.png"
function NewTask({ taskID, userID, theme, title, status, body, date, priority, mode, setCurrentPage, setTaskID ,setViewTaskDetails, setViewTaskID ,setSnackMessage,setOpenS}) {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");

    const deleteTask = async () => {
        try {
            const res = await fetch(`https://taskify-la02.onrender.com/api/task/${taskID}`, {
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

    const mutation = useMutation({
    mutationFn: async ({ taskId, newStatus }) => {
        const res = await fetch(`https://taskify-la02.onrender.com/api/task/${taskId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error("Failed to update task status");
        return res.json();
    },
    onMutate: async ({ taskId, newStatus }) => {
        await queryClient.cancelQueries(["tasks", userID]);

        const previousTasks = queryClient.getQueryData(["tasks", userID]);

        queryClient.setQueryData(["tasks", userID], (old) =>
            old?.map(task =>
                task._id === taskId ? { ...task, status: newStatus } : task
            )
        );

        return { previousTasks };
    },
    onError: (err, variables, context) => {
        // rollback to previous state on error
        queryClient.setQueryData(["tasks", userID], context.previousTasks);
        alert("Failed to update task status");
    },
    onSettled: () => {
        queryClient.invalidateQueries(["tasks", userID]);
    }
});
    const handleClickDiv=(e)=>{
        if (e.target.tagName!=="IMG" && e.target.tagName!=="INPUT" && e.target.id!=="exclude"){
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
                   onChange={() => mutation.mutate({ taskId: taskID, newStatus: !status })}
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
                            src={mode === "dark" ? editingWhite : editing}
                            alt="edit"
                            onClick={() => {
                                setTaskID(taskID);
                                setCurrentPage("editTask");
                            }}
                        />
                        <img
                            src={deleteicon}
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
