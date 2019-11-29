import axios from "axios";
import jwt_decode from "jwt-decode";

const githubClient = axios.create({
  baseURL: "https://api.github.com"
});

githubClient.interceptors.request.use(
  config => {
    const code = jwt_decode(localStorage.getItem("token"));
    const githubToken = code.githubToken;
    config.headers.Authorization = `token ${githubToken}`;
    config.headers.Accept = "application/vnd.github.machine-man-preview+json";
    return config;
  },
  error => Promise.reject(error)
);

export default githubClient;
