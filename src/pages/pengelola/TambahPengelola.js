import React, { useState } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Box,
  Grid,
  CircularProgress,
  FormHelperText,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import Copyright from "../components/internals/components/Copyright";

// Fungsi untuk membuat komponen form
const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0); // Menyimpan step saat ini
  const [formData, setFormData] = useState({
    pengguna: {
      nama_lengkap: "",
      username: "",
      password: "",
      email: "",
      telpon: "",
      jenis_identitas: "",
      nomor_identitas: "",
      file_identitas: null,
      alamat: "",
      pictures: null,
      jabatan: "Pengelola",
    },
    pengelola: {
      nama_pengelola: "",
      email: "",
      telpon: "",
      alamat: "",
      logo: null,
      deskripsi: "",
    },
    langganan: {
      user_id: 1, // Admin user ID
      pengelola_id: null,
      paket_id: null,
      mulai_langganan: null,
      akhir_langganan: null,
      status: "Tidak Aktif",
    },
  });

  const [loading, setLoading] = useState(false); // Status loading saat pengiriman

  // Langkah-langkah formulir
  const steps = ["Detail Pengguna", "Data Pengelola & Paket", "Langganan Pengguna"];

  // Fungsi untuk memproses perubahan input
  const handleInputChange = (event, section) => {
    const { name, value, files } = event.target;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [name]: files ? files[0] : value,
      },
    });
  };

  // Fungsi untuk melanjutkan ke langkah berikutnya
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Fungsi untuk kembali ke langkah sebelumnya
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Fungsi untuk mengirimkan formulir
  const handleSubmit = () => {
    setLoading(true);
    // Simulasi pengiriman data
    setTimeout(() => {
      alert("Formulir berhasil dikirim!");
      setLoading(false);
    }, 2000);
  };

  // Rendering setiap langkah formulir
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Nama Lengkap"
              name="nama_lengkap"
              value={formData.pengguna.nama_lengkap}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Username"
              name="username"
              value={formData.pengguna.username}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.pengguna.password}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.pengguna.email}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nomor Telepon"
              name="telpon"
              value={formData.pengguna.telpon}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Jenis Identitas</InputLabel>
              <Select
                label="Jenis Identitas"
                name="jenis_identitas"
                value={formData.pengguna.jenis_identitas}
                onChange={(e) => handleInputChange(e, "pengguna")}
              >
                <MenuItem value="KTP">KTP</MenuItem>
                <MenuItem value="SIM">SIM</MenuItem>
                <MenuItem value="PASPOR">PASPOR</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Nomor Identitas"
              name="nomor_identitas"
              value={formData.pengguna.nomor_identitas}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" component="label" margin="normal">
              Upload Foto Identitas
              <input type="file" hidden onChange={(e) => handleInputChange(e, "pengguna")} name="file_identitas" />
            </Button>
            <TextField
              label="Alamat"
              name="alamat"
              value={formData.pengguna.alamat}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" component="label" margin="normal">
              Upload Foto Profil
              <input type="file" hidden onChange={(e) => handleInputChange(e, "pengguna")} name="pictures" />
            </Button>
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Nama Pengelola"
              name="nama_pengelola"
              value={formData.pengelola.nama_pengelola}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email Pengelola"
              name="email"
              value={formData.pengelola.email}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nomor Telepon Pengelola"
              name="telpon"
              value={formData.pengelola.telpon}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Alamat Pengelola"
              name="alamat"
              value={formData.pengelola.alamat}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" component="label" margin="normal">
              Upload Logo Pengelola
              <input type="file" hidden onChange={(e) => handleInputChange(e, "pengelola")} name="logo" />
            </Button>
            <TextField
              label="Deskripsi Pengelola"
              name="deskripsi"
              value={formData.pengelola.deskripsi}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Paket Langganan</InputLabel>
              <Select
                label="Pilih Paket Langganan"
                name="paket_id"
                value={formData.langganan.paket_id}
                onChange={(e) => handleInputChange(e, "langganan")}
              >
                <MenuItem value={1}>Paket Standart</MenuItem>
                <MenuItem value={2}>Paket Premium</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </>
        );
      default:
        return "Unknown Step";
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <Grid size={{ xs: 6, sm: 6, lg: 6 }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Tambah Pengguna Baru
          </Typography>
        </Grid>
        <Grid size={{ xs: 6, sm: 6, lg: 6 }} alignContent={"flex-end"} textAlign="right">
          <Button variant="contained" onClick={() => window.history.back()} sx={{ mr: 1 }}>
            Kembali
          </Button>
          <Button type="submit" variant="contained" color="success" form="form-tambah-staf">
            Simpan
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ padding: 2, mt: 1 }}>
              <Box sx={{ width: "100%" }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label, index) => (
                    <Step key={index}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box sx={{ padding: 2 }}>
                  {activeStep === steps.length ? (
                    <div>
                      <h4>Formulir Berhasil Dikirim!</h4>
                    </div>
                  ) : (
                    <>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          {renderStepContent(activeStep)}
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, lg: 12 }}>
          {" "}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                {activeStep > 0 && <Button onClick={handleBack}>Kembali</Button>}
                <Button onClick={handleNext} variant="contained">
                  {activeStep === steps.length - 1 ? "Kirim" : "Lanjut"}
                </Button>
              </Box>
            </CardContent>
          </Card>{" "}
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
};

export default MultiStepForm;
