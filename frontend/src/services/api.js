import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7005/api",
  withCredentials: true,
});

export default api;