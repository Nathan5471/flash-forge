import axios from 'axios';

const apiUrl = window.location.origin;
const api = axios.create({
    baseURL: `${apiUrl}/api/match`,
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response ? error.response.data : 'Network Error');
    }
)

// For all functions, assume id the flashcard set ID, not leaderboard ID

export const getMatch = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
}

export const getLeaderBoard = async (id) => {
    const response = await api.get(`/leaderboard/${id}`);
    return response.data;
}

export const postMatch = async (id, startTime, endTime) => {
    const response = await api.post(`/${id}`, { startTime, endTime });
    return response.data;
}