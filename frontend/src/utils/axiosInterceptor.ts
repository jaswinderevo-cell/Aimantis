import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const axiosIntercept = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosIntercept.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// refresh token if access expired
axiosIntercept.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          // ask backend for new access token
          const res = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh,
          });

          const newAccess = res.data.access;

          // update localStorage and headers
          localStorage.setItem("token", newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return axiosIntercept(originalRequest);
        } catch (err) {
          console.error("Refresh token invalid. Logging out.",err);
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default axiosIntercept;
