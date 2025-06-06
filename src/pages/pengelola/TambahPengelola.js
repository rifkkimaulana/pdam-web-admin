import React, { useState, useEffect } from "react";
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
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import Copyright from "../components/internals/components/Copyright";
import { createUser } from "../../utils/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getAllPaketLangganan } from "../../utils/paketLangganan";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// Fungsi untuk membuat komponen form
const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0); // Menyimpan step saat ini
  const [formData, setFormData] = useState({
    pengguna: {
      nama_lengkap: "",
      username: "",
      password: "",
      re_password: "",
      email: "",
      telpon: "",
      jenis_identitas: "KTP", // Default jenis identitas
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
  const [paketOptions, setPaketOptions] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({}); // Untuk error per field
  const [openFotoDialog, setOpenFotoDialog] = useState(false);
  const [fotoDialogSrc, setFotoDialogSrc] = useState("");
  const [fotoDialogTitle, setFotoDialogTitle] = useState("");
  const navigate = useNavigate();

  // Langkah-langkah formulir
  const steps = ["Detail Pengguna", "Data Pengelola & Paket"];

  useEffect(() => {
    // Ambil data paket langganan untuk pilihan paket
    getAllPaketLangganan().then((data) => {
      setPaketOptions(Array.isArray(data) ? data : []);
    });
  }, []);

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
    // Reset error field jika user mengedit password/re_password
    if (section === "pengguna" && (name === "password" || name === "re_password")) {
      setTimeout(validatePasswordField, 0);
    }
  };

  // Fungsi untuk melanjutkan ke langkah berikutnya
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  // Fungsi untuk kembali ke langkah sebelumnya
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Fungsi untuk validasi re-password
  const isPasswordMatch = () => {
    return formData.pengguna.password === formData.pengguna.re_password;
  };

  // Fungsi untuk validasi field required sebelum submit
  const validateRequiredFields = () => {
    const pengguna = formData.pengguna;
    const pengelola = formData.pengelola;
    const langganan = formData.langganan;
    const requiredPengguna = [
      "nama_lengkap",
      "username",
      "password",
      "re_password",
      "email",
      "telpon",
      "jenis_identitas",
      "nomor_identitas",
      "alamat",
      "jabatan",
    ];
    const requiredPengelola = ["nama_pengelola", "email", "telpon", "alamat"];
    const requiredLangganan = ["paket_id"];
    for (let key of requiredPengguna) {
      if (!pengguna[key] || pengguna[key].toString().trim() === "") {
        toast.error(`Field ${key.replace("_", " ")} wajib diisi!`);
        return false;
      }
    }
    for (let key of requiredPengelola) {
      if (!pengelola[key] || pengelola[key].toString().trim() === "") {
        toast.error(`Field ${key.replace("_", " ")} wajib diisi!`);
        return false;
      }
    }
    for (let key of requiredLangganan) {
      if (!langganan[key]) {
        toast.error(`Field ${key.replace("_", " ")} wajib diisi!`);
        return false;
      }
    }
    return true;
  };

  // Fungsi untuk cek username exist ke backend
  const checkUsernameExist = async (username) => {
    if (!username) return;
    try {
      // Ganti endpoint sesuai API user yang tersedia
      const res = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setFieldErrors((prev) => ({ ...prev, username: "Username sudah terdaftar" }));
      } else {
        setFieldErrors((prev) => ({ ...prev, username: undefined }));
      }
    } catch (e) {
      // Abaikan error jaringan
    }
  };

  // Fungsi validasi password dan re-password
  const validatePasswordField = () => {
    // Ambil nilai terbaru dari formData
    const password = document.querySelector('input[name="password"]').value;
    const re_password = document.querySelector('input[name="re_password"]').value;
    if (password && re_password && password !== re_password) {
      setFieldErrors((prev) => ({ ...prev, re_password: "Password tidak sama" }));
    } else {
      setFieldErrors((prev) => ({ ...prev, re_password: undefined }));
    }
  };

  // Fungsi untuk mengirimkan formulir ke API
  const handleSubmit = async () => {
    if (!validateRequiredFields()) return;
    if (!isPasswordMatch()) {
      toast.error("Password dan Ulangi Password tidak sama!");
      return;
    }
    setLoading(true);
    try {
      let payload;
      let isMultipart = false;
      // Cek jika ada file yang diupload
      if (formData.pengguna.file_identitas || formData.pengguna.pictures || formData.pengelola.logo) {
        isMultipart = true;
        payload = new FormData();
        payload.append("nama_lengkap", formData.pengguna.nama_lengkap || "");
        payload.append("username", formData.pengguna.username || "");
        payload.append("password", formData.pengguna.password || "");
        payload.append("re_password", formData.pengguna.re_password || "");
        payload.append("email", formData.pengguna.email || "");
        payload.append("telpon", formData.pengguna.telpon || "");
        payload.append("jenis_identitas", formData.pengguna.jenis_identitas || "");
        payload.append("nomor_identitas", formData.pengguna.nomor_identitas || "");
        if (formData.pengguna.file_identitas) {
          payload.append("file_identitas", formData.pengguna.file_identitas);
        } else {
          payload.append("file_identitas", "");
        }
        payload.append("alamat", formData.pengguna.alamat || "");
        if (formData.pengguna.pictures) {
          payload.append("pictures", formData.pengguna.pictures);
        } else {
          payload.append("pictures", "");
        }
        payload.append("jabatan", formData.pengguna.jabatan || "");
        payload.append("nama_pengelola", formData.pengelola.nama_pengelola || "");
        payload.append("email_pengelola", formData.pengelola.email || "");
        payload.append("telpon_pengelola", formData.pengelola.telpon || "");
        payload.append("alamat_pengelola", formData.pengelola.alamat || "");
        if (formData.pengelola.logo) {
          payload.append("logo_pengelola", formData.pengelola.logo);
        } else {
          payload.append("logo_pengelola", "");
        }
        payload.append("deskripsi_pengelola", formData.pengelola.deskripsi || "");
        payload.append("paket_id", formData.langganan.paket_id || "");
        payload.append("user_id", formData.langganan.user_id || "");
        payload.append("mulai_langganan", formData.langganan.mulai_langganan || "");
        payload.append("akhir_langganan", formData.langganan.akhir_langganan || "");
        payload.append("status_langganan", formData.langganan.status || "");
      } else {
        payload = {
          nama_lengkap: formData.pengguna.nama_lengkap || "",
          username: formData.pengguna.username || "",
          password: formData.pengguna.password || "",
          re_password: formData.pengguna.re_password || "",
          email: formData.pengguna.email || "",
          telpon: formData.pengguna.telpon || "",
          jenis_identitas: formData.pengguna.jenis_identitas || "",
          nomor_identitas: formData.pengguna.nomor_identitas || "",
          file_identitas: "",
          alamat: formData.pengguna.alamat || "",
          pictures: "",
          jabatan: formData.pengguna.jabatan || "",
          nama_pengelola: formData.pengelola.nama_pengelola || "",
          email_pengelola: formData.pengelola.email || "",
          telpon_pengelola: formData.pengelola.telpon || "",
          alamat_pengelola: formData.pengelola.alamat || "",
          logo_pengelola: "",
          deskripsi_pengelola: formData.pengelola.deskripsi || "",
          paket_id: formData.langganan.paket_id || "",
          user_id: formData.langganan.user_id || "",
          mulai_langganan: formData.langganan.mulai_langganan || "",
          akhir_langganan: formData.langganan.akhir_langganan || "",
          status_langganan: formData.langganan.status || "",
        };
      }
      await createUser(payload, isMultipart);
      toast.success("Berhasil menambahkan pengelola!");
      navigate("/pengelola");
    } catch (err) {
      // Tampilkan error detail dari backend jika ada
      if (err?.response?.status === 422 && err?.response?.data?.errors) {
        const errors = err.response.data.errors;
        setFieldErrors(errors); // Set error ke field
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error("Gagal mengirim data: " + (err?.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menampilkan dialog foto (hanya preview file baru)
  const handleShowFoto = (type) => {
    let src = "";
    let title = "";
    if (type === "profil" && formData.pengguna.pictures instanceof File) {
      src = URL.createObjectURL(formData.pengguna.pictures);
      title = "Foto Profil";
    }
    if (type === "identitas" && formData.pengguna.file_identitas instanceof File) {
      src = URL.createObjectURL(formData.pengguna.file_identitas);
      title = "Foto Identitas";
    }
    if (type === "logo" && formData.pengelola.logo instanceof File) {
      src = URL.createObjectURL(formData.pengelola.logo);
      title = "Logo Pengelola";
    }
    setFotoDialogSrc(src);
    setFotoDialogTitle(title);
    setOpenFotoDialog(true);
  };

  // Rendering setiap langkah formulir
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <FormControl fullWidth margin="normal">
              <Grid container spacing={2} columns={12}>
                <Grid size={7}>
                  <TextField
                    label="Nama Lengkap"
                    name="nama_lengkap"
                    value={formData.pengguna.nama_lengkap || ""}
                    onChange={(e) => handleInputChange(e, "pengguna")}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                  />
                </Grid>
                <Grid size={3}>
                  <FormControl fullWidth margin="normal">
                    <Button variant="contained" component="label" margin="normal">
                      Unggah
                      <input type="file" hidden onChange={(e) => handleInputChange(e, "pengguna")} name="pictures" />
                    </Button>
                  </FormControl>
                </Grid>
                <Grid size={2}>
                  <FormControl fullWidth margin="normal">
                    {formData.pengguna.pictures instanceof File && (
                      <Button onClick={() => handleShowFoto("profil")}>
                        <VisibilityIcon />
                      </Button>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </FormControl>
            <TextField
              label="Username"
              name="username"
              value={formData.pengguna.username || ""}
              onChange={(e) => {
                handleInputChange(e, "pengguna");
                setFieldErrors((prev) => ({ ...prev, username: undefined }));
              }}
              onBlur={() => checkUsernameExist(formData.pengguna.username)}
              fullWidth
              margin="normal"
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
            />
            <FormControl fullWidth margin="normal">
              <Grid container spacing={2} columns={12}>
                <Grid size={{ xs: 6, sm: 6, lg: 6 }}>
                  <TextField
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.pengguna.password || ""}
                    onChange={(e) => {
                      handleInputChange(e, "pengguna");
                      setTimeout(validatePasswordField, 0);
                    }}
                    fullWidth
                    margin="normal"
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 6, lg: 6 }}>
                  <TextField
                    label="Ulangi Password"
                    type="password"
                    name="re_password"
                    value={formData.pengguna.re_password || ""}
                    onChange={(e) => {
                      handleInputChange(e, "pengguna");
                      setTimeout(validatePasswordField, 0);
                    }}
                    fullWidth
                    margin="normal"
                    error={!!fieldErrors.re_password}
                    helperText={fieldErrors.re_password}
                  />
                </Grid>
              </Grid>
            </FormControl>
            <TextField
              label="Email"
              name="email"
              value={formData.pengguna.email || ""}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nomor Telepon"
              name="telpon"
              value={formData.pengguna.telpon || ""}
              onChange={(e) => handleInputChange(e, "pengguna")}
              fullWidth
              margin="normal"
            />
            <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
              <Grid size={5}>
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
                    <MenuItem value="ID Lainnya">ID Lainnya</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={4}>
                <FormControl fullWidth margin="normal">
                  <Button variant="contained" component="label" margin="normal">
                    Upload Foto Identitas
                    <input type="file" hidden onChange={(e) => handleInputChange(e, "pengguna")} name="file_identitas" />
                  </Button>
                </FormControl>
              </Grid>
              <Grid size={3}>
                <FormControl fullWidth margin="normal">
                  {formData.pengguna.file_identitas instanceof File && (
                    <Button onClick={() => handleShowFoto("identitas")}>
                      <VisibilityIcon />
                    </Button>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <TextField
                label="Nomor Identitas"
                name="nomor_identitas"
                value={formData.pengguna.nomor_identitas || ""}
                onChange={(e) => handleInputChange(e, "pengguna")}
                fullWidth
                margin="normal"
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Alamat"
                name="alamat"
                value={formData.pengguna.alamat || ""}
                onChange={(e) => handleInputChange(e, "pengguna")}
                fullWidth
                margin="normal"
              />
            </FormControl>{" "}
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Nama Pengelola"
              name="nama_pengelola"
              value={formData.pengelola.nama_pengelola || ""}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email Pengelola"
              name="email"
              value={formData.pengelola.email || ""}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nomor Telepon Pengelola"
              name="telpon"
              value={formData.pengelola.telpon || ""}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Alamat Pengelola"
              name="alamat"
              value={formData.pengelola.alamat || ""}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Deskripsi Pengelola"
              name="deskripsi"
              value={formData.pengelola.deskripsi || ""}
              onChange={(e) => handleInputChange(e, "pengelola")}
              fullWidth
              margin="normal"
            />
            <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
              <Grid size={6}>
                {" "}
                <FormControl fullWidth margin="normal">
                  <InputLabel>Paket Langganan</InputLabel>
                  <Select
                    label="Pilih Paket Langganan"
                    name="paket_id"
                    value={formData.langganan.paket_id ?? ""}
                    onChange={(e) => handleInputChange(e, "langganan")}
                  >
                    {paketOptions.map((paket) => (
                      <MenuItem key={paket.id} value={paket.id}>
                        {paket.nama_paket}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={4}>
                <FormControl fullWidth margin="normal">
                  <Button variant="contained" component="label" margin="normal">
                    Upload Logo Pengelola
                    <input type="file" hidden onChange={(e) => handleInputChange(e, "pengelola")} name="logo" />
                  </Button>
                </FormControl>
              </Grid>
              <Grid size={2}>
                <FormControl fullWidth margin="normal">
                  {formData.pengelola.logo instanceof File && (
                    <Button onClick={() => handleShowFoto("logo")}>
                      <VisibilityIcon />
                    </Button>
                  )}
                </FormControl>
              </Grid>
            </Grid>
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
          <Button color="error" variant="contained" onClick={() => window.history.back()} sx={{ mr: 1 }}>
            Batal
          </Button>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Kembali
            </Button>
          )}
          <Button onClick={handleNext} variant="contained" color="success">
            {activeStep === steps.length - 1 ? "Kirim" : "Lanjut"}
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
      </Grid>
      <Copyright sx={{ my: 4 }} />
      <Dialog open={openFotoDialog} onClose={() => setOpenFotoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {fotoDialogTitle}
          <IconButton
            aria-label="close"
            onClick={() => setOpenFotoDialog(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ textAlign: "center" }}>
          {fotoDialogSrc ? (
            <img src={fotoDialogSrc} alt={fotoDialogTitle} style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8 }} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Tidak ada foto tersedia.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MultiStepForm;
