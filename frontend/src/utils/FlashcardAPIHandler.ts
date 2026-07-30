import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/flashcards`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject("Axios request canceled");
    }

    return Promise.reject(
      error.response ? error.response.data : { message: "Network Error" },
    );
  },
);

export const createFlashcardSet = async (
  name: string,
  description: string,
  flashcards: { index: number; term: string; definition: string }[],
  signal?: AbortSignal,
) => {
  const response = await api.post(
    "/create",
    { name, description, flashcards },
    { signal },
  );
  return response.data;
};

export const getFlashcardSet = async (setId: string, signal?: AbortSignal) => {
  const response = await api.get(`/set/${setId}`, { signal });
  return response.data;
};
