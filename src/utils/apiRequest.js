import axios from 'axios';

const apiRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

export default apiRequest;
