import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
    baseURL: `${apiUrl}/api/flashcards`,
    withCredentials: true,
})

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response ? error.response.data : 'Network Error');
    }
)

export const createFlashcardSet = async (flashcardSetData) => {
    const response = await api.post('/create', flashcardSetData);
    return response.data;
}