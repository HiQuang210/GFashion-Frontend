import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://192.168.1.6:5000/api/",
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
