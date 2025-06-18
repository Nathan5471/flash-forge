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

export const updateUsername = async (username) => {
    const response = await api.put('/update', { toUpdate: 'username', username });
    return response.data;
}

export const updateEmail = async (email) => {
    const response = await api.put('/update', { toUpdate: 'email', email });
    return response.data;
}

export const updatePassword = async (newPassword) => {
    const response = await api.put('/update', { toUpdate: 'password', newPassword });
    return response.data;
}

export const deleteUser = async () => {
    const response = await api.delete('/delete');
    return response.data;
}

export const getUser = async () => {
    const response = await api.get('/');
    return response.data;
}