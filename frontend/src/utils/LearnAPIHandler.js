import axios from 'axios';

const apiUrl = window.location.origin;
const api = axios.create({
    baseURL: `${apiUrl}/api/learn`,
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response ? error.response.data : 'Network Error');
    }
)

export const createLearnSession = async (flashcardSetId, settings) => {
    const response = await api.post('/', { flashcardSetId, settings });
    return response.data;
}

export const getLearnSession = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
}

export const checkIfLearnSessionExists = async (flashcardSetId) => {
    const response = await api.get(`/flashcardSet/${flashcardSetId}`);
    return response.data;
}

export const generateLearnSession = async (id) => {
    const response = await api.get(`/session/${id}`);
    return response.data;
}

export const submitAnswer = async (id, questionOrder, answer) => {
    const response = await api.get(`/check/${id}/${questionOrder}`, {
        params: { answer }
    })
    return response.data;
}

export const deleteLearnSession = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
}