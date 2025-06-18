import axios from 'axios';

const apiUrl = window.location.origin;
const api = axios.create({
    baseURL: `${apiUrl}/api/auth`,
    withCredentials: true,
})

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response ? error.response.data : 'Network Error');
    }
)

export const register = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
}

export const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
}

export const logout = async () => {
    const response = await api.get('/logout');
    return response.data;
}

export const getUser = async () => {
    const response = await api.get('/');
    return response.data;
}