import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useTasks from "../hooks/useTasks";

const TaskForm = () => {
  const { id } = useParams();
  const { tasksQuery, createTaskMutation, updateTaskMutation } = useTasks();
  const navigate = useNavigate();

  const [task, setTask] = useState({
    name: "",
    dueDate: "",
    priority: "Low",
  });
  const [errors, setErrors] = useState({});

  const isEditing = !!id;

  React.useEffect(() => {
    if (isEditing && tasksQuery.data) {
      const existingTask = tasksQuery.data.find((t) => t._id == id);
      if (existingTask) {
        setTask({
          name: existingTask.name,
          dueDate: existingTask.dueDate,
          priority: existingTask.priority,
        });
      }
    }
  }, [id, isEditing, tasksQuery.data]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  
    // Perform validation on the current field being updated
    const fieldName = e.target.name;
    let newErrors = { ...errors };
  
    if (fieldName === "name") {
      if (e.target.value.length < 3) {
        newErrors.name = "Task name must have minimum 3 characters.";
      } else if (e.target.value.length > 20) {
        newErrors.name = "Task name should not have more than 20 characters.";
      } else {
        delete newErrors.name; // Remove error if field is valid
      }
    }
  
    if (fieldName === "dueDate") {
      const today = new Date().toISOString().split("T")[0];
      if (e.target.value < today) {
        newErrors.dueDate = "Due date cannot be in the past.";
      } else {
        delete newErrors.dueDate;
      }
    }
  
    setErrors(newErrors); // Update errors state
  };

  const validateTask = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (task.name.length < 3) {
      newErrors.name = "Task name must have minimum 3 characters.";
    }
    if (task.name.length > 20) {
      newErrors.name = "Task name should not have more than 20 characters.";
    }

    if (task.dueDate < today) {
      newErrors.dueDate = "Due date cannot be in the past.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateTask();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const handleServerError = (error) => {
      // You can access error response from the server here
      const serverError = error.response?.data?.message || "Something went wrong. Please try again.";
      setErrors({ server: serverError });
    };
  
    if (isEditing) {
      updateTaskMutation.mutate(
        { id: id, updatedTask: task },
        {
          onSuccess: () => {
            navigate("/");
          },
          onError: handleServerError, // Handle server errors
        }
      );
    } else {
      createTaskMutation.mutate(task, {
        onSuccess: () => {
          navigate("/");
        },
        onError: handleServerError, // Handle server errors
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <h3>{isEditing ? "Update Task" : "Add New Task"}</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-light rounded border">
      {errors.server && <div className="alert alert-danger">{errors.server}</div>}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Task Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={task.name}
            onChange={handleChange}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            placeholder="Task name here"
            required
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={
              task.dueDate
                ? new Date(task.dueDate).toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
            className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
            required
          />
          {errors.dueDate && (
            <div className="invalid-feedback">{errors.dueDate}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={task.priority}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Very High">Very High</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {isEditing ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
