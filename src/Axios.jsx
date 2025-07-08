import axios from "axios";
const Axios = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || `http://localhost:4000/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default Axios;
