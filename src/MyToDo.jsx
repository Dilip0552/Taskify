import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import darkstyles from "./MyToDoDark.module.css"
import lightstyles from "./MyToDoLight.module.css"
import NewTask from "./NewTask"
import AddTask from "./AddTask"
import { lazy, useState, Suspense, useContext } from 'react'
import { ThemeContext } from "./ThemeContext"
import { useQuery } from "@tanstack/react-query"
import { div } from "framer-motion/client"

function MyToDo({ setCurrentPage }) {
    const navigate = useNavigate()
    const Filter = lazy(() => import("./Filter"))

    const [filterStatus, setFilterStatus] = useState("close")
    const { theme, toggleTheme } = useContext(ThemeContext)
    const file = theme === "dark" ? darkstyles : lightstyles;

    // ✅ Get user_id
    const user_id = localStorage.getItem('user_id');

    // ✅ Fetch function
    const fetchTasks = async () => {
        const res = await fetch(`http://127.0.0.1:8000/api/tasks/${user_id}`);
        return res.json();  // ✅ important: parse response as JSON
    };

    // ✅ useQuery here directly
    const {
        data: tasks = [], // default to empty array if undefined
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['tasks', user_id],
        queryFn: fetchTasks,
        enabled: !!user_id,
    });

    return (
        <div className={file.mytodoRoot}>
            <div className={file.appContainer}>
                <div className={file.midBar}>
                    Task List
                    <button className={file.addTask} onClick={() => {
                        setCurrentPage("addTask")
                    }}>+ Add Task</button>
                </div>

                <div className={file.filterDiv}>
                    <button onClick={() => {
                        setFilterStatus(filterStatus === "close" ? "open" : "close")
                    }}>Filter</button>
                </div>

                <div style={{ color: "black" }} className={file.tasksBar}>
                    {/* ✅ Show loading or error inside tasks section */}
                    {isLoading ? (
                        <div className="loader">Loading tasks...</div>
                    ) : isError ? (
                        <div className="error">Something went wrong: {error.message}</div>
                    ) : (
                        <div className="tasks">
                            {tasks.length === 0 ? (
                                <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{fontSize:"20px", fontWeight:"600"}}>No tasks found</p></div>
                            ) : (
                                tasks.map(task => (
                                    <NewTask
                                        key={task._id}
                                        mode={theme}
                                        theme={file}
                                        title={task.title}
                                        body={task.description}
                                        date={task.due_date}
                                        priority={task.priority}
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
    )
}

export default MyToDo;
