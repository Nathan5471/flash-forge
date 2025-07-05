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

export const createClass = async (className, joinCode) => {
    const response = await api.post('/create', { className, joinCode });
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

export const getUserClassesWhereTeacher = async () => {
    const response = await api.get('/all/IsTeacher');
    return response.data;
}

export const teacherRemoveStudent = async (classId, userId) => {
    const response = await api.post(`/teacher/remove/${classId}`, { userId });
    return response.data;
}

export const checkIsAssigned = async (classId, flashcardSetId) => {
    const response = await api.get(`/isAssigned/${classId}/${flashcardSetId}`);
    return response.data;
}