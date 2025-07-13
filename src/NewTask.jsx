
import {useState} from 'react'
function NewTask({taskID,theme,title,body,date,priority,mode,setCurrentPage,setTaskID}){

    // console.log(mode)

    return (
        <div className={theme.task}>
            <label className={theme.roundCheckbox}>
                    <input type="checkbox" />
                    <span className={theme.checkmark}></span>
            </label>
            <div className={theme.taskSide}>
            <div className={theme.taskTop}>
                
                <span className={theme.truncate}>{title}</span>
                <div className={priority==="High" ? theme.high: theme.low}>{priority}</div>
            </div>
            <div className={theme.taskMid}>
                <span className={theme.truncate}>{body}</span>
            </div>
            <div className={theme.taskBottom}>
                <div className={theme.moreOptions}>
                    <img src={mode==="dark"?"src/assets/editing-white.png":"src/assets/editing.png"} alt="edit" onClick={()=>{
                        setTaskID(taskID)
                        setCurrentPage("editTask")}}/>
                    <img src="src/assets/delete.png" alt="delete" />
                </div>
                <span>Due <span>{date}</span></span>
            </div>
            </div>
            
        </div>
    )
}
export default NewTask