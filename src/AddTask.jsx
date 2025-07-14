import { ThemeContext } from "./ThemeContext";
import darkstyles from "./MyToDoDark.module.css";
import lightstyles from "./MyToDoLight.module.css";
import React, { useContext, useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import Snackbar from '@mui/material/Snackbar';

function AddTask({ setCurrentPage, addTaskStatus, setAddTaskStatus }) {
  const { theme } = useContext(ThemeContext);
  const file = theme === "dark" ? darkstyles : lightstyles;

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    status: false,
    due_date: "",
    priority: "",
    user_id: ""
  });

  const token = localStorage.getItem("token");

  // ✅ Get user_id once on component load
  useEffect(() => {
    const id = localStorage.getItem("user_id");
    if (id) {
      setTaskDetails(prev => ({ ...prev, user_id: id }));
    }
  }, []);

  const handleChange = (event) => {
    setTaskDetails({ ...taskDetails, [event.target.name]: event.target.value });
  };

  // 🔐 Add Task with JWT Token
  const addTask = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/add-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(taskDetails)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Add Task failed");
    return data;
  };

  const mutation = useMutation({
    mutationFn: addTask,
    onSuccess: (data) => {
      console.log("✅", data.message);
      setOpenS(true)
    //   setCurrentPage("tasks");
    }
  });

  const handleAddTask = () => {
    const { title, description, due_date, priority, user_id } = taskDetails;
    if (!title || !description || !due_date || !priority || !user_id) {
      console.log("Please fill all the details");
      return;
    }
    mutation.mutate();
  };
const [openS,setOpenS]=useState(false)
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenS(false); // 👋 Snackbar disappears
  };

  return (
    <div className={file.atContainer}>
      <div className={file.atAddTask}>
        <div className={file.atHeader}>
          <img src="src/assets/left-arrow.png" alt="back" onClick={() => setCurrentPage("tasks")} />
          <span className={file.atHeadingSpan}>Add Task</span>
        </div>

        <div className={file.atTitle}>
          <span className={file.atTitleSpan}>Title</span>
          <input type="text" placeholder="Enter a title" name="title" value={taskDetails.title} onChange={handleChange} />
        </div>

        <div className={file.atDescription}>
          <span className={file.atDescriptionSpan}>Description</span>
          <textarea placeholder="Enter a description" name="description" value={taskDetails.description} onChange={handleChange} />
        </div>

        <div className={file.atDueDate}>
          <span className={file.atDueDateSpan}>Due Date</span>
          <input type="date" name="due_date" value={taskDetails.due_date} onChange={handleChange} />
        </div>

        <div className={file.atPriority}>
          <p>Priority</p>
          <div className={file.atdiv}>
            <label className={file.atlabel}>
              <input type="radio" name="priority" value="Low" checked={taskDetails.priority === "Low"} onChange={handleChange} />
              <div className={file.atldiv1}>Low</div>
            </label>
            <label className={file.atlabel}>
              <input type="radio" name="priority" value="High" checked={taskDetails.priority === "High"} onChange={handleChange} />
              <div className={file.atldiv2}>High</div>
            </label>
          </div>
        </div>

        <button
          className={file.atAddTaskBtn}
          onClick={(e) => {
            e.preventDefault();
            handleAddTask();
          }}
        >
          Add Task
        </button>
        <Snackbar
            open={openS}
            autoHideDuration={3000}
            onClose={handleClose}
            message="Task added Successfully!"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </div>
    </div>
  );
}

export default AddTask;
