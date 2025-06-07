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

export default function ProfilPerusahaan({ onBack }) {
  // Simulasi data user & pengelola, ganti dengan fetch data aslinya
  const [user, setUser] = React.useState({
    nama_lengkap: "Budi Santoso",
    username: "budisantoso",
    email: "budi@pdam.com",
    telpon: "08123456789",
    jenis_identitas: "KTP",
    nomor_identitas: "1234567890",
    file_identitas: "", // file url
    alamat: "Jl. Merdeka No. 10",
    pictures: "", // file url
  });

  const [pengelola, setPengelola] = React.useState({
    nama_pengelola: "PDAM Bandung",
    email: "contact@pdam.co.id",
    telpon: "0221234567",
    alamat: "Jl. Asia Afrika No. 20, Bandung",
    logo: "", // file url
    deskripsi: "Pengelola PDAM Bandung",
  });

  // State untuk preview dialog
  const [preview, setPreview] = React.useState({ open: false, src: "", label: "" });

  // Handle upload
  const handleUserChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handlePengelolaChange = (e) => setPengelola({ ...pengelola, [e.target.name]: e.target.value });

  const handleFile = (e, field, type) => {
    // Pakai file url untuk preview
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "user") setUser((prev) => ({ ...prev, [field]: url }));
      else setPengelola((prev) => ({ ...prev, [field]: url }));
    }
  };

  // Dialog handler
  const handlePreview = (src, label) => setPreview({ open: true, src, label });
  const handleClosePreview = () => setPreview({ open: false, src: "", label: "" });

  const handleBack = () => {
    if (onBack) onBack();
  };
  const handleSimpan = () => {
    alert("Data berhasil disimpan!");
  };

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
          <Button variant="contained" color="primary" onClick={handleSimpan}>
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
                  accept="image/*,application/pdf"
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
              <Avatar src={user.pictures} />
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
              <Avatar src={pengelola.logo} variant="square" />
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
          {/* Preview image or pdf */}
          {preview.src ? (
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
