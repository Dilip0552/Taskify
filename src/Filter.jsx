import { useState, useRef } from "react";
import remove from "./assets/remove.png"
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
  const fromRef = useRef(null);
  const toRef = useRef(null);

  return (
    <div className={theme.filterPop}>
      <div className={theme.closeDiv}>
        <img src={remove} alt="" onClick={() => setFilterStatus("close")} />
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
              ref={fromRef}
              type={fromDate ? "date" : "text"}
              placeholder="From date"
              value={fromDate}
              onFocus={(e) => {
                e.target.type = "date";
                // trigger the calendar immediately
                setTimeout(() => {
                  fromRef.current?.showPicker?.(); // modern way
                  fromRef.current?.click(); // fallback
                }, 0);
              }}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
              onChange={(e) => setFromDate(e.target.value)}
            />

            -
            <input
              ref={toRef}
              type={toDate ? "date" : "text"}
              placeholder="To date"
              value={toDate}
              onFocus={(e) => {
                e.target.type = "date";
                setTimeout(() => {
                  toRef.current?.showPicker?.();
                  toRef.current?.click();
                }, 0);
              }}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "text";
              }}
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
