import { Link } from "react-router-dom";
import useTasks from "../hooks/useTasks";
import TaskFilter from "./TaskFilter";
import { useState, useEffect } from "react";

const TaskList = () => {
  const { tasksQuery, deleteTaskMutation } = useTasks();
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filters, setFilters] = useState({ priority: "", dueDate: "" });

  useEffect(() => {
    tasksQuery.refetch();
  }, []);

  useEffect(() => {
    if (tasksQuery.data) {
      applyFilters();
    }
  }, [tasksQuery.data, filters]);

  const applyFilters = () => {
    let tasks = tasksQuery.data || [];

    if (filters.priority) {
      tasks = tasks.filter((task) => task.priority === filters.priority);
    }

    if (filters.dueDate) {
      tasks = tasks.filter(
        (task) =>
          new Date(task.dueDate).toISOString().split("T")[0] === filters.dueDate
      );
    }

    setFilteredTasks(tasks);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getUTCDate()).padStart(2, "0")}-${String(
      date.getUTCMonth() + 1
    ).padStart(2, "0")}-${date.getUTCFullYear()}`;
  };

  const handleDelete = (id) => {
    deleteTaskMutation.mutate(id);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container-fluid px-3 px-md-5 mt-4">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3 className="mb-0">Task List</h3>
        <Link to="/tasks/add" className="btn btn-primary">
          Add New Task
        </Link>
      </div>

      {/* Task Filter Component */}
      <TaskFilter onFilter={handleFilterChange} />

      <div className="overflow-auto">
        <table className="table table-hover table-bordered align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Task Name</th>
              <th scope="col">Due Date</th>
              <th scope="col">Priority</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasksQuery.isLoading || tasksQuery.isError ? (
              // Show a blank table and a message below
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No tasks available.
                </td>
              </tr>
            ) : filteredTasks.length > 0 ? (
              filteredTasks?.map((task, index) => (
                <tr key={task._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{task.name}</td>
                  <td>{formatDate(task.dueDate)}</td>
                  <td>
                    <span
                      className={`badge text-bg-${
                        task.priority === "High" || task.priority === "Very High"
                          ? "danger"
                          : task.priority === "Medium"
                          ? "warning"
                          : "success"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <div className="d-grid d-sm-block d-md-inline-flex my-2">
                      <Link
                        to={`/tasks/${task._id}/edit`}
                        className="btn btn-sm btn-warning me-2 my-1"
                      >
                        <i className="bi bi-pencil"></i>
                        <span className="d-none d-sm-inline"> Edit</span>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger me-2 my-1"
                        onClick={() => handleDelete(task._id)}
                      >
                        <i className="bi bi-trash"></i>
                        <span className="d-none d-sm-inline"> Delete</span>
                      </button>
                      <Link
                        to={`/tasks/${task._id}`}
                        className="btn btn-sm btn-outline-secondary me-2 my-1"
                      >
                        <i className="bi bi-box-arrow-in-right"></i>
                        <span className="d-none d-sm-inline"> View</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {tasksQuery.isError && (
          <div className="text-center text-danger mt-3">
            Error fetching Tasks: {tasksQuery.error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;