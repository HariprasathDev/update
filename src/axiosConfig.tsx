// src/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '"http://localhost:8000/api/newprofile_get/"', // Change this to your Django server URL
});

export default axiosInstance;
