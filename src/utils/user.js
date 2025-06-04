import api from "./api";

// GET: Ambil semua user
export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// GET: Ambil user by id
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

// POST: Tambah user baru
export const createUser = async (data) => {
  const response = await api.post("/users", data);
  return response.data;
};

// PUT: Update user
export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

// DELETE: Hapus user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
