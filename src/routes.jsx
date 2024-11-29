import { createBrowserRouter } from "react-router-dom";
// import ErrorPage from "./pages/ErrorPage";
import TaskForm from "./tasks/TaskForm";
import TaskDetails from "./tasks/TaskDetails";
import TaskList from "./tasks/TaskList";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    // errorElement: <ErrorPage />,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <TaskList />,
      },
      {
        path: "tasks/add",
        element: <TaskForm mode="add" />, // Form for adding a new task
      },
      {
        path: "tasks/:id/edit",
        element: <TaskForm mode="edit" />, // Form for editing an existing task
      },
      {
        path: "tasks/:taskId",
        element: <TaskDetails />,
      },
    ],
  },
]);

export default router;
