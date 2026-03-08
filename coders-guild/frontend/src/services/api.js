import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("cg_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auth
export const register = (email, password) => API.post("/auth/register", { email, password });
export const login = (email, password) => API.post("/auth/login", { email, password });

// User
export const getProfile = () => API.get("/user/profile");
export const updateProfile = (data) => API.put("/user/profile", data);

// Progress
export const recordSolve = (data) => API.post("/progress/solve", data);
export const getProgress = () => API.get("/progress");

// Duel
export const recordDuelEnd = (data) => API.post("/duel/end", data);

// Daily
export const getDaily = () => API.get("/daily");
export const completeDaily = (data) => API.post("/daily/complete", data);

export default API;
