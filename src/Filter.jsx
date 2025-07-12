function Filter({theme,filterStatus,setFilterStatus}){
    return (
        <div className={theme.filterPop}>
            <div className={theme.closeDiv}><img src="src/assets/remove.png" alt="" onClick={()=>setFilterStatus("close")}/></div>
            <div className={theme.filterMain}>
                <h2>Filter</h2>
                <div className={theme.fSearch}>
                    <input type="text" placeholder="Search"/>
                </div>
                <div className={theme.atPriority}>                    
                    <p>Priority</p>
                    <div className={theme.fpdiv}>
                        <label className={theme.fplabel}>
                            <input type="checkbox" />
                            <div className={theme.fpldiv}>Low</div>
                        </label>
                        <label className={theme.fplabel}><input type="checkbox" /><div className={theme.fpldiv}>High</div></label>
                    </div>
                </div>
                <div className={theme.fStatus}>
                    <p>Status</p>
                    <div className={theme.fsdiv}>
                        <label className={theme.fslabel}><input type="radio" name="status" /><div className={theme.fsldiv}>Completed</div></label>
                        <label className={theme.fslabel}><input type="radio" name="status" /><div className={theme.fsldiv}>Pending</div></label>
                    </div>

                </div>
                <div className={theme.fDueDate}>
                    <p>Due Date</p>
                    <div className={theme.fdDiv}>
                        <input type="date" /> -
                        <input type="date" />
                    </div>
                </div>
                <div className={theme.fbtnOptions}>
                    <div className={theme.fbtnClear}>Clear</div>
                    <div className={theme.fbtnApply}>Apply</div>
                </div>
                
            </div>

        </div>
    )
}
export default Filter