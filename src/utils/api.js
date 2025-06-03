import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
});

// Interceptor global untuk handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        window.location.href = "/sign-in";
      } else {
        toast.error(`Error ${error.response.status}: ${error.response.data.message || "Terjadi kesalahan pada server."}`);
      }
    } else {
      toast.error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    }
    return Promise.reject(error);
  }
);

// interceptor untuk menyisipkan Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Gagal mengirim permintaan. Periksa konfigurasi Anda.");
    return Promise.reject(error);
  }
);

export default api;
