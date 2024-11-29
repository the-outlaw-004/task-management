import axios from "axios";

export class APIClient {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });
  }

  getAll() {
    return this.client.get("/tasks");
  }

  getById(id) {
    return this.client.get(`/tasks/${id}`);
  }

  create(data) {
    return this.client.post("/tasks", data);
  }

  update(id, data) {
    return this.client.put(`/tasks/${id}`, data);
  }

  delete(id) {
    return this.client.delete(`/tasks/${id}`);
  }
}

export default APIClient;
