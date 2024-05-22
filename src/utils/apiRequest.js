import axios from 'axios';

const token = localStorage.getItem('token');
const apiRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        Authorization: 'Bearer ' + token,
    },
});

export default apiRequest;
