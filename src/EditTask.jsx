import { ThemeContext } from "./ThemeContext";
import darkstyles from "./MyToDoDark.module.css";
import lightstyles from "./MyToDoLight.module.css";
import React, { useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";

import Snackbar from '@mui/material/Snackbar';
import leftArrow from "./assets/left-arrow.png"
function EditTask({ setCurrentPage, taskKey }) {
  const { theme } = useContext(ThemeContext);
  const file = theme === "dark" ? darkstyles : lightstyles;
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');
  const [openS,setOpenS]=useState(false)
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    status: false,
    due_date: "",
    priority: "",
    user_id: user_id
  });

  // 🔐 Fetch existing task with token
  const fetchTask = async () => {
    const res = await fetch(`https://taskify-la02.onrender.com/api/task/${user_id}/${taskKey}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Task fetch failed");
    return data;
  };

  const { data: taskData, isLoading } = useQuery({
    queryKey: ['task', taskKey],
    queryFn: fetchTask,
    enabled: !!taskKey && !!user_id && !!token
  });

  // 📝 Pre-fill form with fetched task
  useEffect(() => {
    if (taskData) {
      setTaskDetails({
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || false,
        due_date: taskData.due_date || "",
        priority: taskData.priority || "",
        user_id: taskData.user_id || user_id
      });
    }
  }, [taskData]);

  const handleChange = (event) => {
    setTaskDetails({ ...taskDetails, [event.target.name]: event.target.value });
  };

  // 🔐 Update task with token
  const updateTask = async () => {
    const res = await fetch(`https://taskify-la02.onrender.com/api/update-task/${user_id}/${taskKey}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(taskDetails)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Task update failed");
    return data;
  };

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      console.log("Task updated successfully");
      setOpenS(true)
      // setCurrentPage("tasks");
    }
  });

  const handleUpdateTask = () => {
    const { title, description, due_date, priority } = taskDetails;
    if (!title || !description || !due_date || !priority) {
      console.log("Please fill all the details");
    } else {
      mutation.mutate();
    }
  };

  if (isLoading) return <p>Loading...</p>;
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenS(false); // 👋 Snackbar disappears
  };
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;
  return (
    <div className={file.etContainer}>
      <div className={file.etEditTask}>
        <div className={file.etHeader}>
          <img src={leftArrow} alt="Back" onClick={() => setCurrentPage("tasks")} />
          <span className={file.etHeadingSpan}>Edit Task</span>
        </div>

        <div className={file.etTitle}>
          <span className={file.etTitleSpan}>Title</span>
          <input type="text" placeholder="Enter a title" name="title" value={taskDetails.title} onChange={handleChange} />
        </div>

        <div className={file.etDescription}>
          <span className={file.etDescriptionSpan}>Description</span>
          <textarea placeholder="Enter a description" name="description" value={taskDetails.description} onChange={handleChange} />
        </div>

        <div className={file.etDueDate}>
          <span className={file.etDueDateSpan}>Due Date</span>
          <input type="date" name="due_date" value={taskDetails.due_date} onChange={handleChange} min={minDate}/>
        </div>

        <div className={file.etPriority}>
          <p>Priority</p>
          <div className={file.etdiv}>
            <label className={file.etlabel}>
              <input type="radio" name="priority" value="Low" checked={taskDetails.priority === "Low"} onChange={handleChange} />
              <div className={file.etldiv1}>Low</div>
            </label>
            <label className={file.etlabel}>
              <input type="radio" name="priority" value="High" checked={taskDetails.priority === "High"} onChange={handleChange} />
              <div className={file.etldiv2}>High</div>
            </label>
          </div>
        </div>

        <Snackbar
        open={openS}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Task updated Successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
        <button className={file.etEditTaskBtn} onClick={(e) => {
          e.preventDefault();
          handleUpdateTask();
        }}>
          Update Task
        </button>
      </div>
    </div>
  );
}

export default EditTask;
