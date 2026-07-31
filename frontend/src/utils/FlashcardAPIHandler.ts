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

interface FetchParameters {
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}

export const getRecentlyViewedFlashcardSets = async ({
  limit,
  offset,
  signal,
}: FetchParameters) => {
  const response = await api.get("/recently-viewed", {
    params: { limit, offset },
    signal,
  });
  return response.data;
};

export const getCreatedFlashcardSets = async ({
  limit,
  offset,
  signal,
}: FetchParameters) => {
  const response = await api.get("/created", {
    params: { limit, offset },
    signal,
  });
  return response.data;
};

export const getFlashcardSetsByUsername = async (
  username: string,
  { limit, offset, signal }: FetchParameters,
) => {
  const response = await api.get(`/user/${username}`, {
    params: { limit, offset },
    signal,
  });
  return response.data;
};

export const getPopularFlashcardSets = async ({
  limit,
  offset,
  signal,
}: FetchParameters) => {
  const response = await api.get("/popular", {
    params: { limit, offset },
    signal,
  });
  return response.data;
};

export const getRecentlyCreatedFlashcardSets = async ({
  limit,
  offset,
  signal,
}: FetchParameters) => {
  const response = await api.get("/recently-created", {
    params: { limit, offset },
    signal,
  });
  return response.data;
};

export const getRecentlyEditedFlashcardSets = async ({
  limit,
  offset,
  signal,
}: FetchParameters) => {
  const response = await api.get("/recently-edited", {
    params: { limit, offset },
    signal,
  });
  return response.data;
};
