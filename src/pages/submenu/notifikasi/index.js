import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  TextField,
  MenuItem,
  Stack,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function WhatsAppSettingBox({ onBack }) {
  const [waSetting, setWaSetting] = useState({
    provider: "wablas",
    version: "v2",
    domain: "jkt.wablas.com",
    apiToken: "",
    nomorPengirim: "6288212454982",
    nomorCS: "6282118844992",
    notifikasi: {
      pendaftaran: true,
      pembayaran: true,
    },
    jumlahPesan: 5,
    jedaMin: 60,
    jedaMax: 120,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in waSetting.notifikasi) {
      setWaSetting({ ...waSetting, notifikasi: { ...waSetting.notifikasi, [name]: checked } });
    } else {
      setWaSetting({ ...waSetting, [name]: value });
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Disalin!");
  };

  return (
    <Box component={Paper} p={3} mt={4}>
      {/* Judul kiri & button kembali kanan nempel */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" fontWeight={600}>
          Setelan WhatsApp untuk PDAM
        </Typography>
        <Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ minWidth: 120, ml: 2 }}>
          Kembali
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Keterangan utama dengan bullet */}
      <Box mb={2} sx={{ color: "text.secondary", fontSize: 14 }}>
        <Stack spacing={1}>
          <Box display="flex" alignItems="flex-start">
            <FiberManualRecordIcon sx={{ fontSize: 10, mt: "7px" }} />
            <Box ml={1}>
              <b>NOMOR CS</b> adalah nomor WhatsApp untuk layanan pelanggan PDAM (misal: aduan, bantuan, info layanan).
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <FiberManualRecordIcon sx={{ fontSize: 10, mt: "7px" }} />
            <Box ml={1}>
              <b>NOMOR PENGIRIM</b> adalah nomor yang dipakai untuk mengirim notifikasi tagihan, pemutusan, atau informasi ke pelanggan.
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <FiberManualRecordIcon sx={{ fontSize: 10, mt: "7px" }} />
            <Box ml={1}>
              <b>NOMOR PENGIRIM</b> harus WhatsApp bisnis, sudah pernah aktif mengirim/balas pesan, dan selalu online agar pesan
              tagihan/pemberitahuan PDAM selalu terkirim.
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <FiberManualRecordIcon sx={{ fontSize: 10, mt: "7px" }} />
            <Box ml={1}>
              Disarankan menggunakan nomor khusus agar tidak terganggu aktivitas pribadi, serta mudah integrasi ke sistem billing PDAM.
            </Box>
          </Box>
        </Stack>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Form utama */}
      <Stack spacing={2} mb={2}>
        <TextField label="Provider API WhatsApp" name="provider" select value={waSetting.provider} disabled>
          <MenuItem value="wablas">Wablas</MenuItem>
        </TextField>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Domain API"
            name="domain"
            value={waSetting.domain}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleCopy(waSetting.domain)} size="small">
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Token API"
            name="apiToken"
            value={waSetting.apiToken}
            onChange={handleChange}
            fullWidth
            type="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleCopy(waSetting.apiToken)} size="small">
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Nomor WhatsApp Pengirim"
            name="nomorPengirim"
            value={waSetting.nomorPengirim}
            onChange={handleChange}
            fullWidth
            helperText="Nomor WA yang digunakan untuk kirim tagihan, info pemutusan, dll ke pelanggan PDAM"
          />
          <TextField
            label="Nomor WhatsApp CS (Layanan Pelanggan)"
            name="nomorCS"
            value={waSetting.nomorCS}
            onChange={handleChange}
            fullWidth
            helperText="Nomor WA untuk komunikasi pelanggan ke PDAM (hanya 1 nomor)"
          />
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField label="Versi API WhatsApp" name="version" select value={waSetting.version} onChange={handleChange} sx={{ width: 200 }}>
            <MenuItem value="v1">Standard [V1]</MenuItem>
            <MenuItem value="v2">Multi Device [V2]</MenuItem>
          </TextField>
          <Button href="https://wablas.com/register/" target="_blank" variant="outlined" size="small">
            Registrasi Akun Wablas.com
          </Button>
        </Stack>
      </Stack>

      {/* Penerapan jeda waktu kirim pesan WhatsApp */}
      <Typography fontWeight={600} fontSize={15} mb={2}>
        Penerapan jeda waktu kirim pesan WhatsApp
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={2}>
        <TextField
          label="Jumlah Pesan 1x Kirim"
          name="jumlahPesan"
          type="number"
          value={waSetting.jumlahPesan}
          onChange={handleChange}
          helperText="Maksimum jumlah pesan dalam satu kali kirim"
          sx={{ width: { xs: "100%", md: 200 } }}
        />
        <TextField
          label="Jeda Kirim Min (detik)"
          name="jedaMin"
          type="number"
          value={waSetting.jedaMin}
          onChange={handleChange}
          helperText="Jeda waktu antar pesan minimal"
          sx={{ width: { xs: "100%", md: 200 } }}
        />
        <TextField
          label="Jeda Kirim Max (detik)"
          name="jedaMax"
          type="number"
          value={waSetting.jedaMax}
          onChange={handleChange}
          helperText="Jeda waktu antar pesan maksimal"
          sx={{ width: { xs: "100%", md: 200 } }}
        />
      </Stack>

      {/* Periode Notifikasi WhatsApp PDAM */}
      <Divider sx={{ mb: 2, mt: 2 }} />
      <Typography fontWeight={600} fontSize={15} mb={1}>
        Periode Notifikasi WhatsApp PDAM
      </Typography>
      <Stack spacing={0.5} mb={2}>
        <FormControlLabel
          control={<Checkbox checked={waSetting.notifikasi.pendaftaran} onChange={handleChange} name="pendaftaran" />}
          label="Kirim notifikasi saat pendaftaran pelanggan baru"
        />
        <FormControlLabel
          control={<Checkbox checked={waSetting.notifikasi.pembayaran} onChange={handleChange} name="pembayaran" />}
          label="Kirim notifikasi saat pembayaran tagihan"
        />
      </Stack>

      <Divider sx={{ mb: 2 }} />
      <Typography fontWeight={600} fontSize={15} mb={1}>
        Catatan:
      </Typography>
      <Box sx={{ color: "text.secondary", fontSize: 13 }}>
        <Stack spacing={1}>
          <Box display="flex" alignItems="flex-start">
            <FiberManualRecordIcon sx={{ fontSize: 8, mt: "7px" }} />
            <Box ml={1}>
              QR-CODE <b>WABLAS</b> HARUS DI-SCAN MENGGUNAKAN APLIKASI WHATSAPP SESUAI VERSI API YANG DIPILIH.
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <FiberManualRecordIcon sx={{ fontSize: 8, mt: "7px" }} />
            <Box ml={1}>
              <b>Nomor Pengirim</b> WA PDAM harus selalu online dan terdaftar sebagai WhatsApp bisnis.
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <FiberManualRecordIcon sx={{ fontSize: 8, mt: "7px" }} />
            <Box ml={1}>
              Untuk integrasi dengan sistem billing PDAM, gunakan akun{" "}
              <a href="https://wablas.com/register/" target="_blank" rel="noopener noreferrer">
                Wablas.com
              </a>{" "}
              atau provider sejenis yang mendukung API WhatsApp.
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start">
            <FiberManualRecordIcon sx={{ fontSize: 8, mt: "7px" }} />
            <Box ml={1}>Pastikan nomor pengirim sudah aktif digunakan, minimal pernah beberapa kali chat/kirim/balas pesan WhatsApp.</Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
