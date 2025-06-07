import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Divider,
  Collapse,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const genId = () => `${Date.now()}_${Math.random()}`;

export default function FormTambahPaket() {
  const [paket, setPaket] = useState({
    nama_paket: "",
    biaya_admin: "",
    deskripsi: "",
    status: "enable",
  });

  const [blokTarif, setBlokTarif] = useState([{ id: genId(), batas_atas: "", harga_per_m3: "" }]);
  const [openBlok, setOpenBlok] = useState([true]);

  const handlePaketChange = (e) => {
    setPaket({ ...paket, [e.target.name]: e.target.value });
  };

  const handleBlokChange = (id, e) => {
    setBlokTarif((old) => old.map((row) => (row.id === id ? { ...row, [e.target.name]: e.target.value } : row)));
  };

  const handleAddBlok = () => {
    const newId = genId();
    setBlokTarif((old) => [...old, { id: newId, batas_atas: "", harga_per_m3: "" }]);
    setOpenBlok((old) => [...old, false]);
    setTimeout(() => {
      setOpenBlok((old) => old.map((v, i) => (i === old.length - 1 ? true : v)));
    }, 20);
  };

  const handleRemoveBlok = (idx) => {
    setOpenBlok((old) => old.map((v, i) => (i === idx ? false : v)));
    setTimeout(() => {
      setBlokTarif((old) => old.filter((_, i) => i !== idx));
      setOpenBlok((old) => old.filter((_, i) => i !== idx));
    }, 250);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataKirim = {
      ...paket,
      blok_tarif: blokTarif.map(({ batas_atas, harga_per_m3 }) => ({
        batas_atas,
        harga_per_m3,
      })),
    };
    alert(JSON.stringify(dataKirim, null, 2));
  };

  const handleKembali = () => {
    window.history.back();
  };

  return (
    <Box
      component={Paper}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: "md",
        mx: "auto",
        boxSizing: "border-box",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Tambah Paket & Blok Tarif
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button onClick={handleKembali} variant="outlined" color="primary">
            Kembali
          </Button>
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            Simpan
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 3 }} />
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} mb={4}>
          <TextField label="Nama Paket" name="nama_paket" value={paket.nama_paket} onChange={handlePaketChange} required fullWidth />
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Biaya Admin"
              name="biaya_admin"
              type="number"
              value={paket.biaya_admin}
              onChange={handlePaketChange}
              required
              fullWidth
            />
            <FormControl fullWidth sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select name="status" label="Status" value={paket.status} onChange={handlePaketChange}>
                <MenuItem value="enable">Enable</MenuItem>
                <MenuItem value="disable">Disable</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <TextField
            label="Deskripsi"
            name="deskripsi"
            value={paket.deskripsi}
            onChange={handlePaketChange}
            multiline
            minRows={2}
            fullWidth
          />
        </Stack>
        <Typography variant="h6" mb={1}>
          Blok Tarif
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <Stack spacing={1}>
          {blokTarif.map((blok, idx) => (
            <Collapse in={openBlok[idx]} key={blok.id} timeout={250} sx={{ width: "100%" }} unmountOnExit>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center" mb={0.5}>
                <TextField label="Blok Ke" value={idx + 1} InputProps={{ readOnly: true }} sx={{ width: { xs: "100%", md: 100 } }} />
                <TextField
                  label="Batas Atas (m³)"
                  name="batas_atas"
                  type="number"
                  value={blok.batas_atas}
                  onChange={(e) => handleBlokChange(blok.id, e)}
                  required
                  sx={{ width: { xs: "100%", md: 150 } }}
                />
                <TextField
                  label="Harga per m³"
                  name="harga_per_m3"
                  type="number"
                  value={blok.harga_per_m3}
                  onChange={(e) => handleBlokChange(blok.id, e)}
                  required
                  sx={{ width: { xs: "100%", md: 150 } }}
                />
                {blokTarif.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveBlok(idx)}
                    color="error"
                    title="Hapus Blok"
                    sx={{ alignSelf: "center", color: "red" }}
                  >
                    <Delete />
                  </IconButton>
                )}
                {idx === blokTarif.length - 1 && (
                  <IconButton onClick={handleAddBlok} color="primary" sx={{ alignSelf: "center" }} title="Tambah Blok">
                    <Add />
                  </IconButton>
                )}
              </Stack>
            </Collapse>
          ))}
        </Stack>
        <Divider sx={{ mt: 4, mb: 2 }} />
        <Typography color="text.secondary" mb={2} fontSize={15}>
          <b>Ketentuan:</b> Blok tarif digunakan untuk menentukan harga air berdasarkan jumlah pemakaian pelanggan. Setiap blok
          merepresentasikan batas maksimum pemakaian (m³) beserta harga per m³ pada rentang blok tersebut. Tambahkan blok jika ingin
          menetapkan tarif berbeda untuk tingkat pemakaian yang lebih tinggi. Minimal ada satu blok tarif.
        </Typography>
      </form>
    </Box>
  );
}
