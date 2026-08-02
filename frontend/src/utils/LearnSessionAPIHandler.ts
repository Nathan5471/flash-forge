import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/learn-sessions`,
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

export const startLearnSession = async (
  setId: string,
  amountPerSession: number,
  multipleChoiceAmount: number,
  trueFalseAmount: number,
  writtenAmount: number,
  signal?: AbortSignal,
) => {
  const response = await api.post(
    "/start",
    {
      setId,
      amountPerSession,
      multipleChoiceAmount,
      trueFalseAmount,
      writtenAmount,
    },
    { signal },
  );
  return response.data;
};

export const checkLearnSessionAnswer = async (
  sessionId: string,
  questionOrder: number,
  answer: string,
  signal?: AbortSignal,
) => {
  const response = await api.post(
    `/check/${sessionId}`,
    { questionOrder, answer },
    { signal },
  );
  return response.data;
};

export const checkIfLearnSessionExists = async (
  setId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/flashcard/${setId}`, { signal });
  return response.data;
};

export const checkCanContinueLearnSession = async (
  sessionId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/can-continue/${sessionId}`, { signal });
  return response.data;
};

export const getLearnSession = async (
  sessionId: string,
  signal?: AbortSignal,
) => {
  const response = await api.get(`/${sessionId}`, { signal });
  return response.data;
};

export const endLearnSession = async (
  sessionId: string,
  signal?: AbortSignal,
) => {
  const response = await api.delete(`/end/${sessionId}`, { signal });
  return response.data;
};
