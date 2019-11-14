import axios from "axios";

const githubClient = axios.create({
  baseURL: "https://api.github.com"
});

githubClient.interceptors.request.use(
  config => {
    config.headers.Authorization = `token ${localStorage.getItem("token")}`;
    config.headers.Accept = "application/vnd.github.machine-man-preview+json";
    return config;
  },
  error => Promise.reject(error)
);

export default githubClient;
