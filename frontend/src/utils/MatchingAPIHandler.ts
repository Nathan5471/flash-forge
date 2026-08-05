import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/matching`,
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

export const postLeaderboardSubmission = async (
  id: string,
  startTime: string,
  endTime: string,
  signal?: AbortSignal,
) => {
  const response = await api.post(
    `/submission/${id}`,
    {
      startTime,
      endTime,
    },
    { signal },
  );
  return response.data;
};

export const getMatchingLeaderboardId = async (
  flashcardSetId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/matching-id/${flashcardSetId}`, { signal });
  return response.data;
};

export const loadMatch = async (id: string, signal?: AbortSignal) => {
  const response = await api.get(`/match/${id}`, { signal });
  return response.data;
};

export const getLeaderboard = async (id: string, signal?: AbortSignal) => {
  const response = await api.get(`/leaderboard/${id}`, { signal });
  return response.data;
};
