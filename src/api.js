import axios from "axios";

const API = axios.create({
  baseURL: "https://student-web-backend-1.onrender.com",
});

export default API;