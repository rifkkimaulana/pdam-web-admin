import api from "../../utils/api";

export const getPelangganList = async () => {
  const res = await api.get("/pelanggan");
  return res.data;
};

export const getPelangganById = async (id) => {
  const res = await api.get(`/pelanggan/${id}`);
  return res.data;
};

export const createPelanggan = async (data) => {
  const res = await api.post("/pelanggan", data);
  return res.data;
};

export const updatePelanggan = async (id, data) => {
  const res = await api.put(`/pelanggan/${id}`, data);
  return res.data;
};

export const deletePelanggan = async (id) => {
  const res = await api.delete(`/pelanggan/${id}`);
  return res.data;
};
