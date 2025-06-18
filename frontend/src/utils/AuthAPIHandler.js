import axios from 'axios';

const apiUrl = window.location.origin;
const api = axios.create({
    baseURL: `${apiUrl}/api/auth`,
    withCredentials: true,
})

export const register = async (userData) => {
    try {
        const response = await api.post('/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Failed to register user');
    }
}

export const login = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Failed to login');
    }
}

export const getUser = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        console.error('Get user error:', error);
        throw new Error('Failed to fetch user data');
    }
}