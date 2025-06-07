import api from "./api";

// Tambahkan search dan status ke parameter
export const getAllUsers = async (page = 1, limit = "", search = "", status = "", jabatan = "") => {
  try {
    // Pastikan page minimal 1 dan limit minimal 1
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Number(limit) > 0 ? Number(limit) : 10;
    const params = { page: pageNum, limit: limitNum };
    if (search) params.search = search;
    if (status) params.status = status;
    if (jabatan) params.jabatan = jabatan;
    const response = await api.get("/users", { params });
    //console.log("API Response:", response.data);

    // console.log("params:", params);

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
    // console.error("Error fetching users:", error);
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
export const updateUser = async (id, data, isMultipart = false) => {
  if (isMultipart) {
    // FormData, biarkan browser set Content-Type
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  } else {
    // Raw JSON, set Content-Type
    const response = await api.put(`/users/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  }
};

// DELETE: Hapus user
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
