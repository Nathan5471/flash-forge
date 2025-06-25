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

export const updateFlashcardSet = async (id, flashcardSetData) => {
    const response = await api.put(`/${id}`, flashcardSetData);
    return response.data;
}

export const deleteFlashcardSet = async (id) => {
    const response = await api.delete(`/${id}`);
    return response.data;
}

export const getFlashcardSet = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
}

export const getLastEditTime = async (id) => {
    const response = await api.get(`/lastEdit/${id}`);
    return response.data;
}

export const searchFlashcardSets = async (Query, page, limit) => {
    const response = await api.get('/search', {
        params: {
            query: Query,
            page: page,
            limit: limit
        }
    });
    return response.data;
}

export const getUserFlashcardSets = async (userId) => {
    const response = await api.get(`/user/${userId}`);
    return response.data;
}

export const getRecentlyViewedFlashcardSets = async () => {
    const response = await api.get('/recents');
    return response.data;
}

export const getRecentlyCreatedFlashcardSets = async () => {
    const response = await api.get('/recentlyCreated');
    return response.data;
}

export const cloneFlashcardSet = async (id, newTitle) => {
    const response = await api.post(`/clone/${id}`, { newTitle });
    return response.data;
}

export const getRandomFlashcards = async (id, amount, excludeFlashcardId) => {
    const response = await api.get(`/random/${id}`, {
        params: {
            amount: amount,
            excludeFlashcardId: excludeFlashcardId
        }
    });
    return response.data;
}