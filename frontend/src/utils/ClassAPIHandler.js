import axios from 'axios';

const apiUrl = window.location.origin;
const api = axios.create({
    baseURL: `${apiUrl}/api/classes`,
    withCredentials: true,
})

api.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(error.response ? error.response.data : 'Network Error');
    }
)

export const createClass = async (className, classJoinCode) => {
    const response = await api.post('/create', { className, joinCode: classJoinCode });
    return response.data;
}

export const joinClass = async (joinCode) => {
    const response = await api.post(`/join/${joinCode}`);
    return response.data;
}

export const leaveClass = async (classId) => {
    const response = await api.post(`/leave/${classId}`);
    return response.data;
}

export const deleteClass = async (classId) => {
    const response = await api.delete(`/delete/${classId}`);
    return response.data;
}

export const assignFlashcardSet = async (classId, flashcardSetId) => {
    const response = await api.post(`/assign/${classId}`, { flashcardSetId });
    return response.data;
}

export const unassignFlashcardSet = async (classId, flashcardSetId) => {
    const response = await api.post(`/unassign/${classId}`, { flashcardSetId });
    return response.data;
}

export const getClass = async (classId) => {
    const response = await api.get(`/${classId}`);
    return response.data;
}

export const getUserClasses = async () => {
    const response = await api.get('/all');
    return response.data;
}