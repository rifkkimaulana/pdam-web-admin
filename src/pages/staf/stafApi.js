import api from "../../utils/api";

export const getStafList = async () => {
  const res = await api.get("/staf");
  return res.data;
};

export const getStafById = async (id) => {
  const res = await api.get(`/staf/${id}`);
  return res.data;
};

export const deleteStaf = async (id) => {
  const res = await api.delete(`/staf/${id}`);
  return res.data;
};

export const createStaf = async (data) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  // Pastikan field jabatan_staf dikirim jika jabatan Staf
  if (data.jabatan === "Staf") {
    if (!data.jabatan_staf || !data.pengelola_id) {
      throw new Error("Jabatan staf dan pengelola wajib diisi!");
    }
    formData.append("jabatan", "Staf");
    formData.append("pengelola_id", data.pengelola_id);
    formData.append("jabatan_staf", data.jabatan_staf);
  }

  // Field user
  [
    "nama_lengkap",
    "username",
    "password",
    "email",
    "telpon",
    "jenis_identitas",
    "nomor_identitas",
    "alamat",
    "file_identitas",
    "pictures",
  ].forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  if (!data.password || data.password.trim() === "") {
    throw new Error("Password wajib diisi saat tambah staf!");
  }

  const res = await api.post("/users", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateStaf = async (id, data) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  if (data.jabatan === "Staf") {
    if (!data.jabatan_staf || !data.pengelola_id) {
      throw new Error("Jabatan staf dan pengelola wajib diisi!");
    }
    formData.append("jabatan", "Staf");
    formData.append("pengelola_id", data.pengelola_id);
    formData.append("jabatan_staf", data.jabatan_staf);
  }

  [
    "nama_lengkap",
    "username",
    "password",
    "email",
    "telpon",
    "jenis_identitas",
    "nomor_identitas",
    "alamat",
    "file_identitas",
    "pictures",
  ].forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      // Only append password if not empty (so password won't be reset to empty)
      if (key === "password" && !data[key]) return;
      formData.append(key, data[key]);
    }
  });

  const res = await api.post(`/users/${id}?_method=PUT`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const fetchPengelolaOptions = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.filter((user) => user.jabatan === "Pengelola");
};

export const fetchStafData = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/staf", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
