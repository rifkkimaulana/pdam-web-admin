import api from "../../utils/api";

// Ambil data staf dari /users dan filter hanya staf
export async function fetchStafData() {
  const response = await api.get("/users");
  // Filter hanya user dengan jabatan 'Staf'
  return (response.data || []).filter((user) => user.jabatan === "Staf");
}

// Fungsi delete tetap
export async function deleteStaf(id) {
  return api.delete(`/users/${id}`);
}
