import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import darkstyles from "./MyToDoDark.module.css";
import lightstyles from "./MyToDoLight.module.css";
import NewTask from "./NewTask";
import AddTask from "./AddTask";
import { lazy, useState, Suspense, useContext, useEffect } from 'react';
import { ThemeContext } from "./ThemeContext";
import { useQuery } from "@tanstack/react-query";

function MyToDo({ setCurrentPage, setTaskID }) {
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
        const res = await fetch(`http://127.0.0.1:8000/api/tasks/${user_id}`, {
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
                            {tasks.length === 0 ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <p style={{ fontSize: "20px", fontWeight: "600" }}>No tasks found</p>
                                </div>
                            ) : (
                                tasks.map(task => (
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
                        />
                    </Suspense>
                )}
            </div>
        </div>
    );
}

export default MyToDo;
