import { Box, Card, CardContent, TextField, Button, Typography, Stack, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { fetchPengelola } from "../../../utils/pembayaran";
import { updateUser } from "../../../utils/user";

import { toast } from "react-toastify";

export default function AkunKeamanan({ onBack }) {
  const [user, setUser] = React.useState(null);
  const [pengelola, setPengelola] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({
    password_lama: "",
    password_baru: "",
    konfirmasi_password: "",
  });

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPengelola();
        // Jika response array, ambil data pertama
        const pengelolaData = Array.isArray(data) ? data[0] : data;
        setPengelola({
          nama_pengelola: pengelolaData.nama_pengelola,
          email: pengelolaData.email,
          telpon: pengelolaData.telpon,
          alamat: pengelolaData.alamat,
          deskripsi: pengelolaData.deskripsi,
        });
        setUser({
          id: pengelolaData.user?.id,
          nama_lengkap: pengelolaData.user?.nama_lengkap || "",
          username: pengelolaData.user?.username || "",
          email: pengelolaData.user?.email || "",
          telpon: pengelolaData.user?.telpon || "",
          jenis_identitas: pengelolaData.user?.jenis_identitas || "",
          nomor_identitas: pengelolaData.user?.nomor_identitas || "",
          alamat: pengelolaData.user?.alamat || "",
          jabatan: pengelolaData.user?.jabatan || "",
        });
      } catch (e) {
        setPengelola(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const notMatch = form.password_baru && form.konfirmasi_password && form.password_baru !== form.konfirmasi_password;
  const handleBack = () => {
    if (onBack) onBack();
  };
  const handleSimpan = async () => {
    const userId = user?.id;
    if (!userId) {
      toast.dismiss();
      toast.error("User ID tidak ditemukan.");
      return;
    }
    if (form.password_baru !== form.konfirmasi_password) {
      toast.dismiss();
      toast.error("Konfirmasi password tidak sama dengan password baru.");
      return;
    }
    try {
      await updateUser(userId, {
        password_lama: form.password_lama,
        password: form.password_baru,
      });
      toast.dismiss();
      toast.success("Password berhasil diubah!");
      setForm({ password_lama: "", password_baru: "", konfirmasi_password: "" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Gagal mengubah password.";
      toast.dismiss();
      toast.error(msg);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!user || !pengelola) {
    // Hapus toast error sebelumnya sebelum menampilkan baru
    toast.dismiss();
    toast.error("Gagal memuat data akun/pengelola.");
    return <Typography>Gagal memuat data akun/pengelola.</Typography>;
  }

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
