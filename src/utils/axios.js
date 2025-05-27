import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token && !config.skipAuthRefresh) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshAuthToken } = useAuth();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAuthToken();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error("Acceso denegado. No tienes permisos suficientes.");
          break;
        case 500:
          console.error("Error del servidor. Intenta más tarde.");
          break;
        default:
          console.error("Error en la solicitud:", error.response.status);
      }
    } else if (error.request) {
      console.error("No hay respuesta del servidor. Verifica tu conexión.");
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
