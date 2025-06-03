import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createUser, getUserById, updateUser, getPengelolaList } from "./userApi";
import { Button, Box, Typography, CircularProgress, Grid, Card } from "@mui/material";
import FormUserMainFields from "./components/FormUserMainFields";
import FormUserJabatanFields from "./components/FormUserJabatanFields";

export default function FormUser() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    namaLengkap: "",
    username: "",
    password: "",
    email: "",
    telpon: "",
    jenisIdentitas: "KTP",
    nomorIdentitas: "",
    alamat: "",
    fileIdentitas: null,
    pictures: null,
    jabatan: "Administrator",
    // Pengelola
    namaPengelola: "",
    emailPengelola: "",
    telponPengelola: "",
    alamatPengelola: "",
    logo: null,
    deskripsi: "",
    // Pelanggan
    pengelolaId: "",
    paketId: "",
    noMeter: "",
    alamatMeter: "",
    // Staf
    jabatanStaf: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pengelolaList, setPengelolaList] = useState([]);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      getUserById(id)
        .then((res) => {
          const user = res.data;
          setUserData((prev) => ({
            ...prev,
            namaLengkap: user.nama_lengkap || "",
            username: user.username || "",
            password: "",
            email: user.email || "",
            telpon: user.telpon || "",
            jenisIdentitas: user.jenis_identitas || "KTP",
            nomorIdentitas: user.nomor_identitas || "",
            alamat: user.alamat || "",
            fileIdentitas: user.file_identitas || null,
            pictures: user.pictures || null,
            jabatan: user.jabatan || "Administrator",
            // Pengelola
            namaPengelola: user.pengelola?.nama_pengelola || "",
            emailPengelola: user.pengelola?.email || "",
            telponPengelola: user.pengelola?.telpon || "",
            alamatPengelola: user.pengelola?.alamat || "",
            logo: user.pengelola?.logo || null,
            deskripsi: user.pengelola?.deskripsi || "",
            // Pelanggan
            pengelolaId: user.pelanggan?.pengelola_id || "",
            paketId: user.pelanggan?.paket_id || "",
            noMeter: user.pelanggan?.no_meter || "",
            alamatMeter: user.pelanggan?.alamat_meter || "",
            // Staf
            jabatanStaf: user.staf?.jabatan || "",
          }));
        })
        .catch(() => setError("Gagal memuat data pengguna."))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  useEffect(() => {
    // Ambil daftar pengelola jika jabatan Staf atau Pelanggan
    if (userData.jabatan === "Staf" || userData.jabatan === "Pelanggan") {
      getPengelolaList()
        .then(setPengelolaList)
        .catch(() => setPengelolaList([]));
    }
  }, [userData.jabatan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUserData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Deteksi jika ada file baru (fileIdentitas, pictures, logo bertipe File)
    const isFileIdentitasFile = userData.fileIdentitas instanceof File;
    const isPicturesFile = userData.pictures instanceof File;
    const isLogoFile = userData.logo instanceof File;
    let payload;
    if (isFileIdentitasFile || isPicturesFile || isLogoFile) {
      // Kirim sebagai FormData
      payload = new FormData();
      payload.append("nama_lengkap", userData.namaLengkap);
      payload.append("username", userData.username);
      if (!isEdit || userData.password) payload.append("password", userData.password);
      payload.append("email", userData.email);
      payload.append("telpon", userData.telpon);
      payload.append("jenis_identitas", userData.jenisIdentitas);
      payload.append("nomor_identitas", userData.nomorIdentitas);
      payload.append("alamat", userData.alamat);
      payload.append("jabatan", userData.jabatan);
      if (isFileIdentitasFile) {
        payload.append("file_identitas", userData.fileIdentitas);
      } else if (userData.fileIdentitas) {
        payload.append("file_identitas", userData.fileIdentitas);
      }
      if (isPicturesFile) {
        payload.append("pictures", userData.pictures);
      } else if (userData.pictures) {
        payload.append("pictures", userData.pictures);
      }
      if (userData.jabatan === "Pengelola") {
        payload.append("nama_pengelola", userData.namaPengelola);
        payload.append("email_pengelola", userData.emailPengelola);
        payload.append("telpon_pengelola", userData.telponPengelola);
        payload.append("alamat_pengelola", userData.alamatPengelola);
        if (isLogoFile) {
          payload.append("logo", userData.logo);
        } else if (userData.logo) {
          payload.append("logo", userData.logo);
        }
        payload.append("deskripsi", userData.deskripsi);
      }
      if (userData.jabatan === "Pelanggan") {
        payload.append("pengelola_id", userData.pengelolaId);
        payload.append("paket_id", userData.paketId);
        payload.append("no_meter", userData.noMeter);
        payload.append("alamat_meter", userData.alamatMeter);
      }
      if (userData.jabatan === "Staf") {
        payload.append("pengelola_id", userData.pengelolaId);
        payload.append("jabatan_staf", userData.jabatanStaf);
      }
    } else {
      // Kirim sebagai JSON
      payload = {
        nama_lengkap: userData.namaLengkap,
        username: userData.username,
        ...(isEdit || userData.password ? { password: userData.password } : {}),
        email: userData.email,
        telpon: userData.telpon,
        jenis_identitas: userData.jenisIdentitas,
        nomor_identitas: userData.nomorIdentitas,
        alamat: userData.alamat,
        jabatan: userData.jabatan,
        file_identitas: userData.fileIdentitas || "",
        pictures: userData.pictures || "",
      };
      if (userData.jabatan === "Pengelola") {
        payload.nama_pengelola = userData.namaPengelola;
        payload.email_pengelola = userData.emailPengelola;
        payload.telpon_pengelola = userData.telponPengelola;
        payload.alamat_pengelola = userData.alamatPengelola;
        payload.logo = userData.logo || "";
        payload.deskripsi = userData.deskripsi;
      }
      if (userData.jabatan === "Pelanggan") {
        payload.pengelola_id = userData.pengelolaId;
        payload.paket_id = userData.paketId;
        payload.no_meter = userData.noMeter;
        payload.alamat_meter = userData.alamatMeter;
      }
      if (userData.jabatan === "Staf") {
        payload.pengelola_id = userData.pengelolaId;
        payload.jabatan_staf = userData.jabatanStaf;
      }
    }
    try {
      if (isEdit) {
        await updateUser(id, payload);
        alert("Pengguna berhasil diperbarui!");
      } else {
        await createUser(payload);
        alert("Pengguna berhasil ditambahkan!");
      }
      navigate("/manajemen-user");
    } catch (error) {
      setError("Terjadi kesalahan saat menyimpan pengguna.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container justifyContent="center" sx={{ py: 6 }}>
      <Grid item xs={12} sm={10} md={9} lg={8} sx={{ minWidth: "70vw", maxWidth: "100vw" }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 3,
            p: { xs: 2, sm: 4 },
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {error && (
            <Box mb={2}>
              <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
                {error}
              </Typography>
            </Box>
          )}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h5" fontWeight={700} sx={{ mr: 10 }}>
              {isEdit ? "Edit Pengguna" : "Tambah Pengguna"}
            </Typography>
            <Box display="flex" gap={1}>
              <Button
                type="submit"
                form="form-user"
                variant="contained"
                color="primary"
                size="small"
                sx={{ minWidth: 100 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Simpan"}
              </Button>
              <Button variant="outlined" color="primary" onClick={() => navigate(-1)} size="small" sx={{ minWidth: 100 }}>
                Kembali
              </Button>
            </Box>
          </Box>
          <form id="form-user" onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              {/* Kiri: Form utama */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: "100%", borderRadius: 3, boxShadow: 2, width: "100%" }}>
                  <FormUserMainFields userData={userData} handleChange={handleChange} handleFileChange={handleFileChange} isEdit={isEdit} />
                </Card>
              </Grid>
              {/* Kanan: Form jabatan dinamis */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: "100%", borderRadius: 3, boxShadow: 2, width: "100%", ml: { md: 2, xs: 0 } }}>
                  <FormUserJabatanFields
                    userData={userData}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    pengelolaList={pengelolaList}
                  />
                </Card>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
