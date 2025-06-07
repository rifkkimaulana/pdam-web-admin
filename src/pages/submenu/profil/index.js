import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Stack,
  Divider,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { fetchPengelola, fetchPrivateFile } from "../../../utils/pembayaran";
import { updateUser } from "../../../utils/user";
import { toast } from "react-toastify";

export default function ProfilPerusahaan({ onBack }) {
  // State user & pengelola dari API
  const [user, setUser] = React.useState(null);
  const [pengelola, setPengelola] = React.useState(null);

  // State untuk preview dialog
  const [preview, setPreview] = React.useState({ open: false, src: "", label: "" });
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = React.useState("");

  const fetchData = async () => {
    try {
      const data = await fetchPengelola();
      const pengelolaData = Array.isArray(data) ? data[0] : data;
      const userData = pengelolaData.user || {};
      setPengelola({
        nama_pengelola: pengelolaData.nama_pengelola,
        email: pengelolaData.email,
        telpon: pengelolaData.telpon,
        alamat: pengelolaData.alamat,
        logo: pengelolaData.logo,
        deskripsi: pengelolaData.deskripsi,
      });
      setUser({
        id: userData.id || null,
        nama_lengkap: userData.nama_lengkap || "",
        username: userData.username || "",
        email: userData.email || "",
        telpon: userData.telpon || "",
        jenis_identitas: userData.jenis_identitas || "",
        nomor_identitas: userData.nomor_identitas || "",
        file_identitas: userData.file_identitas || "",
        alamat: userData.alamat || "",
        pictures: userData.pictures || "",
      });
    } catch (e) {
      setPengelola(null);
      setUser(null);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Handle upload
  const handleUserChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handlePengelolaChange = (e) => setPengelola({ ...pengelola, [e.target.name]: e.target.value });

  const handleFile = (e, field, type) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (type === "user") {
        setUser((prev) => ({
          ...prev,
          [field]: file, // hanya simpan File asli
        }));
      } else {
        setPengelola((prev) => ({
          ...prev,
          [field]: file, // hanya simpan File asli
        }));
      }
    }
  };

  // Dialog handler
  const handlePreview = async (src, label) => {
    setPreviewLoading(true);
    let previewSrc = src;
    let revokeUrl = null;
    try {
      if (src instanceof File) {
        previewSrc = URL.createObjectURL(src);
        revokeUrl = previewSrc;
      } else if (typeof src === "string" && src && !src.startsWith("blob:")) {
        if (src.includes("/") && (src.startsWith("identitas/") || src.startsWith("pictures/") || src.startsWith("logo/"))) {
          const [folder, ...rest] = src.split("/");
          const filename = rest.join("/");
          // Cek ekstensi file, jika gambar fetch blob, jika pdf langsung url
          const isPdf = filename.toLowerCase().endsWith(".pdf");
          if (isPdf) {
            // Untuk PDF, langsung gunakan URL API agar <object> bisa render
            previewSrc = process.env.REACT_APP_API_URL
              ? `${process.env.REACT_APP_API_URL}/private-file/${folder}/${filename}`
              : `/api/private-file/${folder}/${filename}`;
            revokeUrl = null;
          } else {
            // Untuk gambar, fetch blob agar bisa preview
            const blob = await fetchPrivateFile(folder, filename);
            previewSrc = URL.createObjectURL(blob);
            revokeUrl = previewSrc;
          }
        } else {
          previewSrc = src;
        }
      }
      setPreview({ open: true, src: previewSrc, label });
      setPreviewBlobUrl(revokeUrl);
    } finally {
      setPreviewLoading(false);
    }
  };
  const handleClosePreview = () => {
    setPreview({ open: false, src: "", label: "" });
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl("");
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
  };
  // Dummy toast error agar tidak dobel notifikasi
  let toastErrorActive = false;
  function showToastError(msg) {
    if (!toastErrorActive) {
      toastErrorActive = true;
      toast.error(msg, {
        onClose: () => {
          toastErrorActive = false;
        },
      });
    }
  }

  const handleSimpan = async () => {
    if (!user || !pengelola) {
      showToastError("Data user/pengelola tidak ditemukan.");
      await fetchData();
      return;
    }
    if (!user.id) {
      showToastError("User ID tidak ditemukan. Tidak dapat melakukan update.");
      await fetchData();
      return;
    }
    // Selalu kirim sebagai FormData agar file pasti terkirim dengan benar
    try {
      const formData = new FormData();
      formData.append("nama_lengkap", user.nama_lengkap);
      formData.append("username", user.username);
      formData.append("email", user.email);
      formData.append("telpon", user.telpon);
      formData.append("jenis_identitas", user.jenis_identitas);
      formData.append("nomor_identitas", user.nomor_identitas);
      formData.append("alamat", user.alamat);
      formData.append("nama_pengelola", pengelola.nama_pengelola);
      formData.append("email_pengelola", pengelola.email);
      formData.append("telpon_pengelola", pengelola.telpon);
      formData.append("alamat_pengelola", pengelola.alamat);
      formData.append("deskripsi_pengelola", pengelola.deskripsi);
      // Log debug file upload
      if (user.file_identitas instanceof File) {
        console.log("[DEBUG] Akan upload file_identitas:", user.file_identitas.name, user.file_identitas.type, user.file_identitas.size);
        formData.append("file_identitas", user.file_identitas);
      }
      if (user.pictures instanceof File) {
        console.log("[DEBUG] Akan upload pictures:", user.pictures.name, user.pictures.type, user.pictures.size);
        formData.append("pictures", user.pictures);
      }
      if (pengelola.logo instanceof File) {
        console.log("[DEBUG] Akan upload logo:", pengelola.logo.name, pengelola.logo.type, pengelola.logo.size);
        formData.append("logo", pengelola.logo);
      }
      // Debug: cek isi FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }
      await updateUser(user.id, formData, true); // true = multipart
      toast.success("Profil berhasil diperbarui!");
      await fetchData();
    } catch (err) {
      console.log("Error update profil:", err);
      // Tampilkan pesan error detail jika ada
      let msg = err?.response?.data?.message || err?.message || "Gagal memperbarui profil.";
      if (err?.response?.data?.errors) {
        // Jika ada error validasi laravel
        msg += "\n" + Object.values(err.response.data.errors).flat().join("\n");
      }
      showToastError(msg);
      await fetchData();
    }
  };

  // Helper untuk mendapatkan src Avatar/file (handle File dan string path)
  function getFileSrc(file, folder) {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    if (typeof file === "string" && file && !file.startsWith("blob:")) {
      // Jika path dari server, buat url API (ganti sesuai kebutuhan backend Anda)
      // Misal: /api/private-file/{folder}/{filename}
      if (file.includes("/") && (file.startsWith("identitas/") || file.startsWith("pictures/") || file.startsWith("logo/"))) {
        return process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/private-file/${file}` : `/api/private-file/${file}`;
      }
      return file;
    }
    return "";
  }

  if (!user || !pengelola) {
    return <Typography>Gagal memuat data user/pengelola.</Typography>;
  }
  if (!user.id) {
    return <Typography color="error">User ID tidak ditemukan. Tidak dapat melakukan update. Silakan hubungi admin.</Typography>;
  }

  return (
    <Box>
      {/* Judul kiri, tombol kanan */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Profil Pengelola & Perusahaan
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Kembali
          </Button>
          <Button variant="contained" color="primary" onClick={handleSimpan} disabled={!user.id}>
            Simpan
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* Data Pengelola (tb_user) */}
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography fontWeight={600}>Data Pengelola</Typography>
            <Divider sx={{ my: 1 }} />
            <TextField
              fullWidth
              label="Nama Lengkap"
              name="nama_lengkap"
              value={user.nama_lengkap}
              onChange={handleUserChange}
              sx={{ mb: 2 }}
            />
            <TextField fullWidth label="Username" name="username" value={user.username} onChange={handleUserChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" name="email" value={user.email} onChange={handleUserChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Telepon" name="telpon" value={user.telpon} onChange={handleUserChange} sx={{ mb: 2 }} />
            <TextField
              select
              fullWidth
              label="Jenis Identitas"
              name="jenis_identitas"
              value={user.jenis_identitas}
              onChange={handleUserChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="KTP">KTP</MenuItem>
              <MenuItem value="SIM">SIM</MenuItem>
              <MenuItem value="PASPOR">PASPOR</MenuItem>
              <MenuItem value="ID Lainnya">ID Lainnya</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Nomor Identitas"
              name="nomor_identitas"
              value={user.nomor_identitas}
              onChange={handleUserChange}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Button variant="outlined" component="label">
                Upload File Identitas
                <input
                  type="file"
                  hidden
                  name="file_identitas"
                  accept="image/*" // hanya gambar
                  onChange={(e) => handleFile(e, "file_identitas", "user")}
                />
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!user.file_identitas}
                onClick={() => handlePreview(user.file_identitas, "Preview File Identitas")}
              >
                Lihat
              </Button>
            </Box>
            <TextField fullWidth label="Alamat" name="alamat" value={user.alamat} onChange={handleUserChange} sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <Avatar src={getFileSrc(user.pictures, "pictures")} />
              <Button variant="outlined" component="label">
                Ganti Foto Profil
                <input type="file" hidden name="pictures" accept="image/*" onChange={(e) => handleFile(e, "pictures", "user")} />
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!user.pictures}
                onClick={() => handlePreview(user.pictures, "Preview Foto Profil")}
              >
                Lihat
              </Button>
            </Box>
            <Box flex={1} />
          </CardContent>
        </Card>

        {/* Data Perusahaan (tb_pengelola) */}
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography fontWeight={600}>Data Perusahaan</Typography>
            <Divider sx={{ my: 1 }} />
            <TextField
              fullWidth
              label="Nama Pengelola"
              name="nama_pengelola"
              value={pengelola.nama_pengelola}
              onChange={handlePengelolaChange}
              sx={{ mb: 2 }}
            />
            <TextField fullWidth label="Email" name="email" value={pengelola.email} onChange={handlePengelolaChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Telepon" name="telpon" value={pengelola.telpon} onChange={handlePengelolaChange} sx={{ mb: 2 }} />
            <TextField fullWidth label="Alamat" name="alamat" value={pengelola.alamat} onChange={handlePengelolaChange} sx={{ mb: 2 }} />
            <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
              <Avatar src={getFileSrc(pengelola.logo, "logo")} variant="square" />
              <Button variant="outlined" component="label">
                Ganti Logo
                <input type="file" hidden name="logo" accept="image/*" onChange={(e) => handleFile(e, "logo", "pengelola")} />
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={!pengelola.logo}
                onClick={() => handlePreview(pengelola.logo, "Preview Logo Perusahaan")}
              >
                Lihat
              </Button>
            </Box>
            <TextField
              fullWidth
              label="Deskripsi"
              name="deskripsi"
              multiline
              minRows={3}
              value={pengelola.deskripsi}
              onChange={handlePengelolaChange}
              sx={{ mb: 2 }}
            />
            <Box flex={1} />
          </CardContent>
        </Card>
      </Box>

      {/* Dialog Preview */}
      <Dialog open={preview.open} onClose={handleClosePreview}>
        <DialogTitle>{preview.label}</DialogTitle>
        <DialogContent>
          {previewLoading ? (
            <Typography>Memuat file...</Typography>
          ) : preview.src ? (
            typeof preview.src === "string" ? (
              preview.src.endsWith(".pdf") ? (
                <object data={preview.src} type="application/pdf" width="100%" height="500px">
                  <p>File tidak dapat ditampilkan, silakan download untuk melihat.</p>
                </object>
              ) : (
                <Box
                  component="img"
                  src={preview.src}
                  alt={preview.label}
                  sx={{ maxWidth: 400, maxHeight: 400, display: "block", mx: "auto" }}
                />
              )
            ) : (
              <Typography>Tidak ada file untuk ditampilkan.</Typography>
            )
          ) : (
            <Typography>Tidak ada file untuk ditampilkan.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
