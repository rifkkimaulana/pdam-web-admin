import { Box, Card, CardContent, TextField, Button, Typography, Stack, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";

export default function AkunKeamanan({ onBack }) {
  // Dummy data tb_user
  const user = {
    nama_lengkap: "Budi Santoso",
    username: "budisantoso",
    email: "budi@pdam.com",
    telpon: "08123456789",
    jenis_identitas: "KTP",
    nomor_identitas: "1234567890",
    alamat: "Jl. Merdeka No. 10",
    jabatan: "Pengelola",
  };

  // Dummy data tb_pengelola
  const pengelola = {
    nama_pengelola: "PDAM Bandung",
    email: "contact@pdam.co.id",
    telpon: "0221234567",
    alamat: "Jl. Asia Afrika No. 20, Bandung",
    deskripsi: "Pengelola PDAM Bandung",
  };

  const [form, setForm] = React.useState({
    password_lama: "",
    password_baru: "",
    konfirmasi_password: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const notMatch = form.password_baru && form.konfirmasi_password && form.password_baru !== form.konfirmasi_password;

  const handleBack = () => {
    if (onBack) onBack();
  };
  const handleSimpan = () => {
    alert("Password berhasil diubah!");
  };

  return (
    <Box>
      {/* Judul kiri, tombol kanan */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap" gap={2}>
        <Typography variant="h6">Akun & Keamanan</Typography>
        <Stack direction="row" spacing={2} alignItems="stretch">
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ height: 40, minWidth: 110 }}>
            Kembali
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSimpan}
            disabled={
              !form.password_lama || !form.password_baru || !form.konfirmasi_password || form.password_baru !== form.konfirmasi_password
            }
            sx={{ height: 40, minWidth: 110 }}
          >
            Simpan
          </Button>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* Informasi Akun kiri */}
        <Card sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography fontWeight={600}>Informasi Akun</Typography>
            <Divider sx={{ my: 1 }} />
            <Stack spacing={2}>
              <TextField label="Nama Lengkap" value={user.nama_lengkap} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Username" value={user.username} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Email" value={user.email} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Telepon" value={user.telpon} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Jenis Identitas" value={user.jenis_identitas} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Nomor Identitas" value={user.nomor_identitas} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Alamat" value={user.alamat} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Jabatan" value={user.jabatan} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Nama Pengelola" value={pengelola.nama_pengelola} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Email Pengelola" value={pengelola.email} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Telepon Pengelola" value={pengelola.telpon} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Alamat Pengelola" value={pengelola.alamat} fullWidth InputProps={{ readOnly: true }} />
              <TextField label="Deskripsi" value={pengelola.deskripsi} fullWidth InputProps={{ readOnly: true }} multiline minRows={2} />
            </Stack>
          </CardContent>
        </Card>
        {/* Ubah Password kanan */}
        <Card sx={{ flex: 1, minWidth: 0 }}>
          <CardContent>
            <Typography fontWeight={600}>Ubah Password</Typography>
            <Divider sx={{ my: 1 }} />
            <TextField
              label="Password Lama"
              type="password"
              name="password_lama"
              value={form.password_lama}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password Baru"
              type="password"
              name="password_baru"
              value={form.password_baru}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Konfirmasi Password Baru"
              type="password"
              name="konfirmasi_password"
              value={form.konfirmasi_password}
              onChange={handleChange}
              error={notMatch}
              helperText={notMatch ? "Konfirmasi password tidak sama dengan password baru." : ""}
              fullWidth
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
