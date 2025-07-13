import { ThemeContext } from "./ThemeContext";
import darkstyles from "./MyToDoDark.module.css";
import lightstyles from "./MyToDoLight.module.css";
import React, { useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";

function EditTask({ setCurrentPage, taskKey }) {
  const { theme } = useContext(ThemeContext);
  const file = theme === "dark" ? darkstyles : lightstyles;
  const user_id = localStorage.getItem('user_id');

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    status: "pending",
    due_date: "",
    priority: "",
    user_id: user_id
  });

  // Fetch existing task
  const fetchTask = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/task/${user_id}/${taskKey}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Task fetch failed");
    }
    return data;
  };

  const { data: taskData, isLoading } = useQuery({
    queryKey: ['task', taskKey],
    queryFn: fetchTask,
    enabled: !!taskKey
  });

  // Pre-fill form with fetched task
  useEffect(() => {
    if (taskData) {
      setTaskDetails({
        title: taskData.title || "",
        description: taskData.description || "",
        status: taskData.status || "pending",
        due_date: taskData.due_date || "",
        priority: taskData.priority || "",
        user_id: taskData.user_id || user_id
      });
    }
  }, [taskData]);

  const handleChange = (event) => {
    setTaskDetails({ ...taskDetails, [event.target.name]: event.target.value });
  };

  const updateTask = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/update-task/${taskKey}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(taskDetails)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Task update failed");
    }
    return data;
  };

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: (data) => {
      console.log(data?.message || "Task updated!");
      setCurrentPage("tasks");
    }
  });

  const handleUpdateTask = () => {
    if (taskDetails.title === "" || taskDetails.description === "" || taskDetails.due_date === "" || taskDetails.priority === "") {
      console.log("Please fill all the details");
    } else {
      mutation.mutate();
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className={file.etContainer}>
      <div className={file.etEditTask}>
        <div className={file.etHeader}>
          <img src="src/assets/left-arrow.png" alt="" onClick={() => setCurrentPage("tasks")} />
          <span className={file.etHeadingSpan}>Edit Task</span>
        </div>

        <div className={file.etTitle}>
          <span className={file.etTitleSpan}>Title</span>
          <input type="text" placeholder="Enter a title" name="title" value={taskDetails.title} onChange={handleChange} />
        </div>

        <div className={file.etDescription}>
          <span className={file.etDescriptionSpan}>Description</span>
          <textarea type="text" placeholder="Enter a description" name="description" value={taskDetails.description} onChange={handleChange} />
        </div>

        <div className={file.etDueDate}>
          <span className={file.etDueDateSpan}>Due Date</span>
          <input type="date" name="due_date" value={taskDetails.due_date} onChange={handleChange} />
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
