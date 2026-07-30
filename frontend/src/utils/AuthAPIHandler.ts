import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/auth`,
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

export const signup = async (
  username: string,
  password: string,
  signal?: AbortSignal,
) => {
  const response = await api.post(
    "/signup",
    { username, password },
    { signal },
  );
  return response.data;
};

export const login = async (
  username: string,
  password: string,
  signal?: AbortSignal,
) => {
  const response = await api.post("/login", { username, password }, { signal });
  return response.data;
};
