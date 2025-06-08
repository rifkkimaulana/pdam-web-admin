import { Box, Card, CardContent, TextField, Button, Typography, Stack, Divider, MenuItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { fetchPengelola } from "../../../utils/pembayaran";
import { updateUser } from "../../../utils/user";
import { toast } from "react-toastify";

export default function ProfilPerusahaan({ onBack }) {
  // Ambil user_id dari localStorage di awal komponen
  let user_id = null;
  try {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (localUser && localUser.id) {
      user_id = Array.isArray(localUser.id) ? localUser.id[0] : localUser.id;
    }
  } catch (e) {
    user_id = null;
  }

  // State user & pengelola dari API
  const [user, setUser] = React.useState(null);
  const [pengelola, setPengelola] = React.useState(null);

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
      // Ambil id user dari localStorage (user.id)
      let localUserId = null;
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser && localUser.id) {
          localUserId = Array.isArray(localUser.id) ? localUser.id[0] : localUser.id;
        }
      } catch (e) {
        localUserId = null;
      }
      // Set user state, id diambil dari variabel user_id di atas
      setUser({
        id: user_id,
        nama_lengkap: userData.nama_lengkap || "",
        username: userData.username || "",
        email: userData.email || "",
        telpon: userData.telpon || "",
        jenis_identitas: userData.jenis_identitas || "",
        nomor_identitas: userData.nomor_identitas || "",
        alamat: userData.alamat || "",
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

  // Ubah helper untuk membangun payload JSON tanpa field file
  function buildPayloadFromUserAndPengelola(user, pengelola) {
    return {
      // Data user
      nama_lengkap: user.nama_lengkap,
      username: user.username,
      email: user.email,
      telpon: user.telpon,
      jenis_identitas: user.jenis_identitas,
      nomor_identitas: user.nomor_identitas,
      alamat: user.alamat,
      // Data pengelola
      nama_pengelola: pengelola.nama_pengelola,
      email_pengelola: pengelola.email,
      telpon_pengelola: pengelola.telpon,
      alamat_pengelola: pengelola.alamat,
      deskripsi_pengelola: pengelola.deskripsi,
    };
  }

  const handleSimpan = async () => {
    if (!user || !pengelola) {
      showToastError("Data user/pengelola tidak ditemukan.");
      await fetchData();
      return;
    }
    if (!user_id) {
      showToastError("User ID tidak ditemukan. Tidak dapat melakukan update.");
      await fetchData();
      return;
    }
    try {
      const payload = buildPayloadFromUserAndPengelola(user, pengelola);
      const response = await updateUser(user_id, payload); // Kirim JSON
      // Tampilkan notifikasi dari response message jika ada
      toast.success(response.message);
      await fetchData();
    } catch (err) {
      console.log("Error update profil:", err);
      let msg = err?.response?.data?.message || err?.message || "Gagal memperbarui profil.";
      if (err?.response?.data?.errors) {
        msg += "\n" + Object.values(err.response.data.errors).flat().join("\n");
      }
      showToastError(msg);
      await fetchData();
    }
  };

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
            <TextField fullWidth label="Alamat" name="alamat" value={user.alamat} onChange={handleUserChange} sx={{ mb: 2 }} />
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
    </Box>
  );
}
