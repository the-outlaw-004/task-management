import { create } from "zustand";
import APIClient from "./services/api-client";

const apiClient = new APIClient("/tasks");

const useTaskStore = create((set) => ({
  tasks: [],

  // Fetch tasks from API
  fetchTasks: async () => {
    try {
      const tasks = await apiClient.getAll();
      set({ tasks });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },

  // Add Task
  addTask: async (name, dueDate, priority) => {
    try {
      const newTask = await apiClient.create({ name, dueDate, priority }); // Assuming create method
      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
    } catch (error) {
      console.error("Error adding task:", error);
    }
  },

  // Update Task
  updateTask: async (id, newName, newDueDate, newPriority) => {
    try {
      const updatedTask = await apiClient.update(id, {
        name: newName,
        dueDate: newDueDate,
        priority: newPriority,
      }); // Assuming update method
      set((state) => ({
        tasks: state.tasks?.map((task) => (task.id === id ? updatedTask : task)),
      }));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  },

  // Delete Task
  deleteTask: async (id) => {
    try {
      await apiClient.delete(id); // Assuming delete method
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  },
}));

export default useTaskStore;
