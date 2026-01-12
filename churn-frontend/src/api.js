import axios from "axios";

export const api = axios.create({
  baseURL: "https://churn-prediction-system-swz4.onrender.com",
});
