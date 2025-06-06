import api from "./api";

// Tambahkan search dan status ke parameter
export const getAllUsers = async (page = 0, limit = 10, search = "", status = "") => {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    if (status) params.status = status;
    const response = await api.get("/users", { params });

    return {
      data: (response.data.data || []).map((item) => ({
        id: item.user?.id,
        user: item.user,
        pengelola: item.pengelola,
        paket: item.paket,
        langganan: item.langganan,
        namaLengkap: item.user?.nama_lengkap || "",
      })),
      total: response.data.total,
      page: response.data.page,
      lastPage: response.data.last_page,
      perPage: response.data.per_page,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: [], total: 0, page: 0, lastPage: 0, perPage: 10 };
  }
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
