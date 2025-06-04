import React, { useState } from "react";
import { Button, Box, Typography, Grid, Card, CircularProgress } from "@mui/material";
import FormUserMainFields from "./components/FormUserMainFields";
import FormUserJabatanFields from "./components/FormUserJabatanFields";

const initialState = {
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
};

export default function FormUser() {
  const [userData, setUserData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUserData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulasi penyimpanan data tanpa API
    setTimeout(() => {
      alert("Data berhasil disimpan!");
      setLoading(false);
    }, 2000); // Simulasi delay
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
              Tambah Pengguna
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
              <Button variant="outlined" color="primary" size="small" sx={{ minWidth: 100 }}>
                Kembali
              </Button>
            </Box>
          </Box>
          <form id="form-user" onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              {/* Kiri: Form utama */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: "100%", borderRadius: 3, boxShadow: 2, width: "100%" }}>
                  <FormUserMainFields userData={userData} handleChange={handleChange} handleFileChange={handleFileChange} />
                </Card>
              </Grid>
              {/* Kanan: Form jabatan dinamis */}
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, height: "100%", borderRadius: 3, boxShadow: 2, width: "100%", ml: { md: 2, xs: 0 } }}>
                  <FormUserJabatanFields userData={userData} handleChange={handleChange} handleFileChange={handleFileChange} />
                </Card>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
