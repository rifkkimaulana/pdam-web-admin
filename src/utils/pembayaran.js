import api from "./api";

export const fetchPembayaranLangganan = async (page = 1, limit = 10, filter = "", search = "") => {
  try {
    const response = await api.get(`/pembayaran-langganan`, {
      params: { page, limit, filter, search },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPengelola = async () => {
  try {
    const response = await api.get("/pengelola");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePembayaranLangganan = async (id) => {
  try {
    const response = await api.delete(`/pembayaran-langganan/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePembayaranLangganan = async (id, data) => {
  try {
    const response = await api.post(`/pembayaran-langganan/${id}?_method=PUT`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPembayaranLangganan = async (data) => {
  try {
    const response = await api.post("/pembayaran-langganan", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPrivateFile = async (folder, filename) => {
  try {
    const response = await api.get(`/private-file/${folder}/${filename}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
