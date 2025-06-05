// API utility functions (local, tidak perlu import dari utils)
import axios from "./api";

const apiBase = "/paket-langganan";

export const getAllPaketLangganan = async () => {
  const res = await axios.get(apiBase);
  return res.data;
};

export const getPaketLanggananById = async (id) => {
  const res = await axios.get(`${apiBase}/${id}`);
  return res.data;
};

export const createPaketLangganan = async (data) => {
  const res = await axios.post(apiBase, data);
  return res.data;
};

export const updatePaketLangganan = async (id, data) => {
  const res = await axios.put(`${apiBase}/${id}`, data);
  return res.data;
};

export const deletePaketLangganan = async (id) => {
  const res = await axios.delete(`${apiBase}/${id}`);
  return res.data;
};
