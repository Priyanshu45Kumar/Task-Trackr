import axios from "axios";

const API = axios.create({
  baseURL: "https://task-trackr-l3tt.onrender.com/api/tasks",
});

export default API;