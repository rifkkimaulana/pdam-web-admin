import api from "./api";

export const login = (data) => api.post("/login", data);
export const register = (data) => api.post("/register", data);
export const forgotPassword = (data) => api.post("/forgot-password", data);

export function getToken() {
  return localStorage.getItem("token");
}
