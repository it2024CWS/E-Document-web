import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  withCredentials: true, // sends cookies (accessToken, refreshToken) automatically
});

axiosInstance.interceptors.request.use(
  async (config) => config,
  (error) => Promise.reject(error)
);

// ── Refresh-token queue ──────────────────────────────────────────────────────
// If multiple requests fail with 401 simultaneously, only one refresh call is
// made. The rest are queued and retried/rejected once the refresh resolves.
let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];
let isRedirectingToLogin = false;

const drainQueue = (success: boolean) => {
  refreshQueue.forEach((cb) => cb(success));
  refreshQueue = [];
};

const redirectToLogin = () => {
  sessionStorage.clear();
  localStorage.removeItem('user');
  if (!isRedirectingToLogin && !window.location.pathname.startsWith('/login')) {
    isRedirectingToLogin = true;
    window.location.href = '/login';
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and not for login/refresh calls themselves
    const isAuthCall =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthCall) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Another refresh is already in flight — queue this request
        return new Promise((resolve, reject) => {
          refreshQueue.push((success) => {
            if (success) {
              resolve(axiosInstance(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        // Backend reads the refreshToken cookie automatically (withCredentials: true)
        // and sets a new accessToken cookie on success
        await axiosInstance.post('/v1/auth/refresh');

        isRefreshing = false;
        drainQueue(true);

        // Retry the original failed request with the new cookie
        return axiosInstance(originalRequest);
      } catch {
        isRefreshing = false;
        drainQueue(false);
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
