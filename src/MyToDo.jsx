import { useNavigate } from "react-router-dom";
import darkstyles from "./MyToDoDark.module.css";
import lightstyles from "./MyToDoLight.module.css";
import NewTask from "./NewTask";
import { lazy, useState, Suspense, useContext, useEffect } from 'react';
import { ThemeContext } from "./ThemeContext";
import { useQuery } from "@tanstack/react-query";
function MyToDo({ setCurrentPage, setTaskID ,setViewTaskDetails, setViewTaskID }) {
  const navigate = useNavigate();
  const Filter = lazy(() => import("./Filter"));
  const [filterStatus, setFilterStatus] = useState("close");
  const { theme } = useContext(ThemeContext);
  const file = theme === "dark" ? darkstyles : lightstyles;

  // ✅ Get user_id and token
  const user_id = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user_id || !token) {
      navigate("/"); // redirect to login if not authenticated
    }
  }, [user_id, token, navigate]);

  // ✅ Fetch tasks with token
  const fetchTasks = async () => {
    const res = await fetch(`https://taskify-la02.onrender.com/api/tasks/${user_id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Failed to fetch tasks");
    }
    return res.json();
  };

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['tasks', user_id],
    queryFn: fetchTasks,
    enabled: !!user_id && !!token,
  });

  const [filters, setFilters] = useState({
    searchText: "",
    priority: [],
    status: "",
    fromDate: "",
    toDate: ""
  });

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchSearch =
      filters.searchText?.trim() === "" ||
      task.title?.toLowerCase().includes(filters.searchText.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.searchText.toLowerCase());

    const matchPriority =
      Array.isArray(filters.priority) && filters.priority.length > 0
        ? filters.priority.includes(task.priority)
        : true;

    const matchStatus =
      filters.status !== ""
        ? task.status === (filters.status === "completed")
        : true;

    const matchFromDate =
      filters.fromDate
        ? new Date(task.due_date) >= new Date(filters.fromDate)
        : true;

    const matchToDate =
      filters.toDate
        ? new Date(task.due_date) <= new Date(filters.toDate)
        : true;

    return (
      matchSearch &&
      matchPriority &&
      matchStatus &&
      matchFromDate &&
      matchToDate
    );
  });

  return (
    <div className={file.mytodoRoot}>
      <div className={file.appContainer}>
        <div className={file.midBar}>
          Task List
          <button className={file.addTask} onClick={() => {
            setCurrentPage("addTask");
          }}>+ Add Task</button>
        </div>

        <div className={file.filterDiv}>
          <button onClick={() => {
            setFilterStatus(prev => prev === "close" ? "open" : "close");
          }}>Filter</button>
        </div>

        <div style={{ color: "black" }} className={file.tasksBar}>
          {isLoading ? (
            <div className="loader"></div>
          ) : isError ? (
            <div className="error">Something went wrong: {error.message}</div>
          ) : (
            <div className="tasks">
              {filteredTasks.length === 0 ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ fontSize: "20px", fontWeight: "600" ,color:theme==="dark"?"white":"black"}}>No tasks found</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <NewTask
                    key={task._id}
                    taskID={task._id}
                    userID={user_id}
                    mode={theme}
                    theme={file}
                    title={task.title}
                    status={task.status}
                    body={task.description}
                    date={task.due_date}
                    priority={task.priority}
                    setCurrentPage={setCurrentPage}
                    setTaskID={setTaskID}
                    setViewTaskDetails={setViewTaskDetails}
                    setViewTaskID={setViewTaskID}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {filterStatus === "open" && (
          <Suspense fallback={<div>Loading...</div>}>
            <Filter
              theme={file}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onApplyFilters={handleFilterApply}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default MyToDo;
