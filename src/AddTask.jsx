import { ThemeContext } from "./ThemeContext"
import darkstyles from "./MyToDoDark.module.css"
import lightstyles from "./MyToDoLight.module.css"
import React, {useContext, useState} from 'react'
import { useMutation } from "@tanstack/react-query"

function AddTask({setCurrentPage,addTaskStatus,setAddTaskStatus}){
    const {theme,toggleTheme}=useContext(ThemeContext)
    const file = theme === "dark" ? darkstyles : lightstyles;
    const [taskDetails,setTaskDetails]=useState({
        title:"",
        description:"",
        status:false,
        due_date:"",
        priority:"",
        user_id:""
    })
    const handleChange=(event)=>{
        setTaskDetails({...taskDetails,[event.target.name]:event.target.value})
        // console.log(taskDetails)
        // console.log(event.target.name.value)
    }
    const addTask=async ()=>{
        // console.log("Sending to backend: ",{
        //         title:taskDetails.title,
        //         description:taskDetails.description,
        //         due_date:taskDetails.due_date,
        //         priority:taskDetails.priority,
        //         user_id:taskDetails.user_id
        //     })
        const res = await fetch("http://127.0.0.1:8000/api/add-task",{
            method:"POST",
            headers: {
            "Content-Type": "application/json"
        },
            body:JSON.stringify({
                title:taskDetails.title,
                description:taskDetails.description,
                status:taskDetails.status,
                due_date:taskDetails.due_date,
                priority:taskDetails.priority,
                user_id:taskDetails.user_id
            })
        })
        const data= await res.json();
        console.log(data);
        if (!res.ok) {
            throw new Error(data.message || "Login failed");
        }
        return data

    }
    const mutation=useMutation({
        mutationFn:addTask,
        onSuccess:(data)=>{
            console.log(data?.message)
        }

    })
    const handleAddTask=()=>{
        if (taskDetails.title==="" || taskDetails.description==="" || taskDetails.due_date==="" || taskDetails.priority===""){
            // setPopStatus("open")
            console.log("Please fill all the details")
        }
        else{
            mutation.mutate();
            setCurrentPage("tasks")

        }
    }
    return (
        <div className={file.atContainer}>
            <div className={file.atAddTask}>
                <div className={file.atHeader}>
                    <img src="src/assets/left-arrow.png" alt="" onClick={()=>{
                        setCurrentPage("tasks")
                    }}/>
                    <span className={file.atHeadingSpan}>Add Task</span>
                </div>
                <div className={file.atTitle}>
                    <span className={file.atTitleSpan}>Title</span>
                    <input type="text" placeholder="Enter a title" name="title" value={taskDetails.title} onChange={handleChange}/>
                </div>
                <div className={file.atDescription}>
                    <span className={file.atDescriptionSpan}>Description</span>
                    <textarea type="text" placeholder="Enter a description" name="description" value={taskDetails.description} onChange={handleChange}/>

                </div>
                <div className={file.atDueDate}>
                    <span className={file.atDueDateSpan}>Due Date</span>
                    <input type="date" name="due_date" value={taskDetails.due_date} onChange={handleChange}/>
                </div>
                <div className={file.atPriority}>
                    <p>Priority</p>
                    <div className={file.atdiv}>
                        <label className={file.atlabel}>
                            <input type="radio" name="priority" value="Low" onChange={handleChange}/>
                            <div className={file.atldiv1}>Low</div>
                        </label>
                        <label className={file.atlabel}><input type="radio" name="priority" value="High" onChange={handleChange}/><div className={file.atldiv2}>High</div></label>
                    </div>
                </div>
                <button className={file.atAddTaskBtn} onClick={(e)=>{
                    e.preventDefault();
                    const id=localStorage.getItem("user_id")
                    console.log(id)
                    setTaskDetails({...taskDetails,["user_id"]:id})
                    handleAddTask();
                }}>Add Task</button>
            </div>
        </div>
    )
}
export default AddTask