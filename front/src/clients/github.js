import axios from "axios";

const githubClient = axios.create({
  baseURL: "https://api.github.com"
});

export default githubClient;
