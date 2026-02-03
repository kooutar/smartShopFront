import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true, // 🔥 pour HttpSession
});

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const logout = () => {
  return api.post("/auth/logout");
};

export { api };
