import { create } from "axios";
import downloadFiles from "../Components/Utilities/downloadFiles";

const api = create({
  baseURL: "http://localhost:3000/client",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  return config;
  /// ANTES DE ENVIAR LA PETICION
});

api.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data && response.data.files) {
        downloadFiles(response.data.files);
      }
    }

    return response;
  },
  (error) => {
    if (error.response?.data?.loggedIn === "notLoggedIn") {
      window.location.href = "/login";
    }

    /// DESPUES DE RECIBIR EL ERROR
    return Promise.reject(error);
  }
);

export default api;
