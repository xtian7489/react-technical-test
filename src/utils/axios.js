import axios from "axios";

// Configuración base del cliente API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.BASE_URL,
  timeout: 10000,
});

// Añade token JWT a los headers
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Manejo de errores globales
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("Token inválido o expirado. Redirigiendo al login...");
        window.location.href = "/auth/login"; // Redirige si no autorizado
      } else if (status >= 500) {
        console.error("Error del servidor. Intenta más tarde.");
      }
    } else if (error.request) {
      console.error("No hay respuesta del servidor. Verifica tu conexión.");
    } else {
      console.error("Error al enviar la solicitud:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
