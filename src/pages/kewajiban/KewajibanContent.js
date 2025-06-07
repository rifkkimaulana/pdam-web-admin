import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

// Dummy data perusahaan dan paket
const perusahaan = {
  nama_lengkap: "PT. Maju Mundur Sejahtera",
  nama_pengelola: "Budi Santoso",
  email: "contact@majumundur.com",
  telpon: "0211234567",
  alamat: "Jl. Sukabumi No. 10, Bandung",
};

const paketAktif = {
  nama: "Bisnis 30 Hari",
  harga: 200000,
  mulai: "2025-06-01",
  akhir: "2025-07-01",
  masaAktif: "30 Hari",
  status: "Aktif",
};

const rows = [
  {
    id: 1,
    tanggal: "2025-06-01",
    nominal: 200000,
    metode: "Transfer",
    status: "Terverifikasi",
    bukti: "bukti_transfer_1.jpg",
  },
  {
    id: 2,
    tanggal: "2025-05-01",
    nominal: 200000,
    metode: "Transfer",
    status: "Terverifikasi",
    bukti: "bukti_transfer_2.jpg",
  },
];

const columns = [
  { field: "id", headerName: "No", width: 70 },
  {
    field: "tanggal",
    headerName: "Tanggal",
    width: 130,
    valueFormatter: (params) => dayjs(params.value).format("DD-MM-YYYY"),
  },
  {
    field: "nominal",
    headerName: "Nominal",
    width: 130,
    valueFormatter: (params) => `Rp ${Number(params.value || 0).toLocaleString()}`,
  },
  { field: "metode", headerName: "Metode", width: 120 },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    renderCell: (params) => <span style={{ color: "#388e3c", fontWeight: 600 }}>{params.value}</span>,
  },
  {
    field: "bukti",
    headerName: "Bukti",
    width: 110,
    renderCell: () => (
      <Button size="small" variant="outlined">
        Lihat
      </Button>
    ),
  },
];

export default function KewajibanPengelola() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [bukti, setBukti] = React.useState("");

  const today = dayjs();
  const akhir = dayjs(paketAktif.akhir);
  const sisaHari = akhir.diff(today, "day");
  const enablePerpanjang = sisaHari < 10;

  const handleBukti = (e) => setBukti(e.target.value);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleKirim = () => {
    setOpenDialog(false);
    setBukti("");
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Kewajiban Pengelola
      </Typography>

      {/* Box 1: Status & Tombol */}
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Status Pembayaran Aplikasi
          </Typography>
          <Button variant="contained" color="success" disabled={!enablePerpanjang} onClick={handleOpenDialog} sx={{ minWidth: 200 }}>
            {enablePerpanjang ? "Perpanjang Langganan" : "Lunas"}
          </Button>
        </CardContent>
      </Card>

      {/* Flexbox: Identitas & Paket, selalu sama tinggi */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Identitas */}
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: { md: "100%" },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Informasi Perusahaan
            </Typography>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Nama Lengkap</Typography>
              <Typography>: {perusahaan.nama_lengkap}</Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Nama Pengelola</Typography>
              <Typography>: {perusahaan.nama_pengelola}</Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Email</Typography>
              <Typography>: {perusahaan.email}</Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Telepon</Typography>
              <Typography>: {perusahaan.telpon}</Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Alamat</Typography>
              <Typography>: {perusahaan.alamat}</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Paket */}
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: { md: "100%" },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Informasi Paket Langganan
            </Typography>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Nama Paket</Typography>
              <Typography>: {paketAktif.nama}</Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Masa Aktif</Typography>
              <Typography>: {paketAktif.masaAktif}</Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Periode Aktif</Typography>
              <Typography>
                : {dayjs(paketAktif.mulai).format("DD-MM-YYYY")} s/d {dayjs(paketAktif.akhir).format("DD-MM-YYYY")}
              </Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Harga Paket</Typography>
              <Typography>: Rp {Number(paketAktif.harga || 0).toLocaleString()}</Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Status</Typography>
              <Typography>
                : <b style={{ color: "#388e3c" }}>{paketAktif.status}</b>
              </Typography>
            </Box>
            <Box display="flex" gap={1} mb={1}>
              <Typography sx={{ minWidth: 130 }}>Sisa Hari Aktif</Typography>
              <Typography>
                : <b>{sisaHari} hari</b>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* DataGrid Riwayat Pembayaran */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Riwayat Pembayaran Pengelola
          </Typography>
          <Box sx={{ height: 350 }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} disableSelectionOnClick autoHeight={false} />
          </Box>
        </CardContent>
      </Card>

      {/* Dialog Perpanjangan */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Perpanjang Langganan</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ minWidth: 300, mt: 1 }}>
            <TextField label="Nama Paket" value={paketAktif.nama} disabled fullWidth />
            <TextField label="Nominal" value={`Rp ${Number(paketAktif.harga || 0).toLocaleString()}`} disabled fullWidth />
            <TextField label="Upload Bukti Transfer" type="file" fullWidth onChange={handleBukti} InputLabelProps={{ shrink: true }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleKirim} variant="contained" color="success" disabled={!bukti}>
            Kirim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
