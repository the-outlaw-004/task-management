import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ms from "ms";
import APIClient from "../services/api-client";

const apiClient = new APIClient("/api");

const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks
  const fetchTasks = () => {
    return apiClient.getAll().then((res) => res.data);
  };

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: ms("24h"),
  });

  // Create a task
  const createTaskMutation = useMutation({
    mutationFn: (newTask) => apiClient.create(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Update a task
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updatedTask }) => {
      console.log("idupdate", id);
      apiClient.update(id, updatedTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  // Delete a task
  const deleteTaskMutation = useMutation({
    mutationFn: (id) => apiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  return {
    tasksQuery,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};

export default useTasks;
