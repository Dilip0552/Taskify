import { useState } from "react";

function Filter({ theme, filterStatus, setFilterStatus, onApplyFilters }) {
  const [searchText, setSearchText] = useState("");
  const [priority, setPriority] = useState({ Low: false, High: false });
  const [status, setStatus] = useState(""); // "completed" | "pending"
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleApply = () => {
    const filters = {
      searchText,
      priority: Object.entries(priority)
        .filter(([_, val]) => val)
        .map(([key]) => key),
      status,
      fromDate,
      toDate,
    };
    onApplyFilters(filters); // ⬅️ send filter values to parent
    setFilterStatus("close");
  };

  const handleClear = () => {
    const emptyFilters = {
      searchText: "",
      priority: [],
      status: "",
      fromDate: "",
      toDate: ""
    };
    setSearchText("");
    setPriority({ Low: false, High: false });
    setStatus("");
    setFromDate("");
    setToDate("");
    onApplyFilters(emptyFilters);
    setFilterStatus("close");
  };

  return (
    <div className={theme.filterPop}>
      <div className={theme.closeDiv}>
        <img src="src/assets/remove.png" alt="" onClick={() => setFilterStatus("close")} />
      </div>
      <div className={theme.filterMain}>
        <h2>Filter</h2>

        {/* 🔍 Search */}
        <div className={theme.fSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* ⚡ Priority */}
        <div className={theme.atPriority}>
          <p>Priority</p>
          <div className={theme.fpdiv}>
            {["Low", "High"].map((level) => (
              <label key={level} className={theme.fplabel}>
                <input
                  type="checkbox"
                  checked={priority[level]}
                  onChange={() =>
                    setPriority((prev) => ({
                      ...prev,
                      [level]: !prev[level],
                    }))
                  }
                />
                <div className={theme.fpldiv}>{level}</div>
              </label>
            ))}
          </div>
        </div>

        {/* 🏁 Status */}
        <div className={theme.fStatus}>
          <p>Status</p>
          <div className={theme.fsdiv}>
            <label className={theme.fslabel}>
              <input
                type="radio"
                name="status"
                checked={status === "completed"}
                onChange={() => setStatus("completed")}
              />
              <div className={theme.fsldiv}>Completed</div>
            </label>
            <label className={theme.fslabel}>
              <input
                type="radio"
                name="status"
                checked={status === "pending"}
                onChange={() => setStatus("pending")}
              />
              <div className={theme.fsldiv}>Pending</div>
            </label>
          </div>
        </div>

        {/* 📅 Due Date */}
        <div className={theme.fDueDate}>
          <p>Due Date</p>
          <div className={theme.fdDiv}>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            -
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={theme.fbtnOptions}>
          <div className={theme.fbtnClear} onClick={handleClear}>
            Clear
          </div>
          <div className={theme.fbtnApply} onClick={handleApply}>
            Apply
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filter;
