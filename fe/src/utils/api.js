import axios from 'axios';

// base url for all our api calls
const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// automatically attach the auth token to every request
// this runs before each request is sent
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
