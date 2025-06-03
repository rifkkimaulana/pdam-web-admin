import api from "../../utils/api";

export const getAllPaket = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/paket", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //console.log(response.data[0].blok_tarif);
  return response;
};
