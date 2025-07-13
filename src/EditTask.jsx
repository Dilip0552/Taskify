import { ThemeContext } from "./ThemeContext";
import darkstyles from "./MyToDoDark.module.css";
import lightstyles from "./MyToDoLight.module.css";
import React, { useContext } from 'react';
import { useQuery } from "@tanstack/react-query";

function EditTask({ taskKey }) {
  const { theme } = useContext(ThemeContext);
  const file = theme === "dark" ? darkstyles : lightstyles;
  const user_id = localStorage.getItem('user_id');

  const fetchTask = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/task/${user_id}/${taskKey}`);
    const data = await res.json();

    console.log("API Response:", data); // ✅ log the actual JSON

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch task");
    }

    return data;
  };

  const {
    data: task = {},
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['task', taskKey],
    queryFn: fetchTask,
    enabled: !!taskKey,
  });

  return (
    <div className={file.container}>
      {isLoading && <p>Loading...</p>}
      {isError && <p style={{ color: "red" }}>{error.message}</p>}
      {!isLoading && !isError && (
        <div>
          <h2>{task.title}</h2>
          <p>ID: {task._id}</p>
          {/* Add more task details if needed */}
        </div>
      )}
    </div>
  );
}

export default EditTask;
