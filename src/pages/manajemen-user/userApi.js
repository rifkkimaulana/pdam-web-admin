import api from "../../utils/api";

// Mendapatkan semua pengguna
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Map data to match the expected structure
    const mappedData = Array.isArray(response.data)
      ? response.data.map((user) => ({
          id: user.id,
          namaLengkap: user.nama_lengkap,
          username: user.username,
          jabatan: user.jabatan,
          email: user.email,
          telpon: user.telpon,
        }))
      : [];

    return mappedData;
  } catch (error) {
    throw error;
  }
};

// Mendapatkan pengguna berdasarkan ID
export const getUserById = (id) => api.get(`/users/${id}`);

// Menambah pengguna baru
export const createUser = async (userData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/users", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Mengupdate data pengguna
export const updateUser = async (id, userData) => {
  const token = localStorage.getItem("token");
  let headers = {
    Authorization: `Bearer ${token}`,
  };
  let data = userData;
  // Jika userData adalah FormData, jangan set Content-Type agar browser otomatis multipart
  if (!(userData instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const response = await api.put(`/users/${id}`, data, {
    headers,
  });
  return response;
};

// Menghapus pengguna berdasarkan ID
export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

// Mendapatkan daftar pengelola (id dan nama_pengelola)
export const getPengelolaList = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/pengelola", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Mendapatkan daftar paket (id, nama_paket, harga)
export const getPaketList = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/paket", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Mendapatkan blok tarif berdasarkan paket_id (pakai endpoint blok-tarif?paket_id=...)
export const getBlokTarifByPaket = async (paketId) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/blok-tarif?paket_id=${paketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
