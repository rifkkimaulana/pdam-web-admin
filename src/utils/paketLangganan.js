import api from "./api";

// GET: Ambil semua paket langganan
export const getAllPaketLangganan = async () => {
  const response = await api.get("/paket-langganan");
  return response.data;
};

// GET: Ambil detail paket langganan by id
export const getPaketLanggananById = async (id) => {
  const response = await api.get(`/paket-langganan/${id}`);
  return response.data;
};

// POST: Tambah paket langganan
export const createPaketLangganan = async (data) => {
  const response = await api.post("/paket-langganan", data);
  return response.data;
};

// PUT: Update paket langganan
export const updatePaketLangganan = async (id, data) => {
  const response = await api.put(`/paket-langganan/${id}`, data);
  return response.data;
};

// DELETE: Hapus paket langganan
export const deletePaketLangganan = async (id) => {
  const response = await api.delete(`/paket-langganan/${id}`);
  return response.data;
};
