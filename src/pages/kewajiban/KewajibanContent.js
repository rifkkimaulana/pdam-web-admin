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
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { fetchPembayaranLangganan } from "../../utils/pembayaran";
import { DataGrid } from "@mui/x-data-grid";

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

export default function KewajibanPengelola() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [bukti, setBukti] = React.useState("");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

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

  useEffect(() => {
    setLoading(true);
    fetchPembayaranLangganan(page + 1, pageSize, "", "")
      .then((data) => {
        setRows(data.data || []);
        setTotalRows(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, pageSize]);

  const dataGridRows = rows.map((row, idx) => ({
    id: row.id,
    no: page * pageSize + idx + 1,
    tanggal: row.tanggal_bayar || row.tanggal || "-",
    nominal: row.jumlah_bayar || row.nominal || "-",
    metode: row.metode || "-",
    status: row.status || "-",
    bukti: row.bukti_bayar || row.bukti || "-",
  }));

  const columns = [
    { field: "no", headerName: "No", width: 50 },
    {
      field: "tanggal",
      headerName: "Tanggal",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params) => (params.value && params.value !== "-" ? dayjs(params.value).format("DD-MM-YYYY") : "-"),
    },
    {
      field: "nominal",
      headerName: "Nominal",
      minWidth: 120,
      flex: 1,
      valueFormatter: (params) => (params.value && params.value !== "-" ? `Rp ${Number(params.value).toLocaleString()}` : "-"),
    },
    { field: "metode", headerName: "Metode", minWidth: 110, flex: 1 },
    { field: "status", headerName: "Status", minWidth: 110, flex: 1 },
    {
      field: "bukti",
      headerName: "Bukti Pembayaran",
      minWidth: 110,
      flex: 1,
      renderCell: (params) =>
        params.value && params.value !== "-" ? (
          <Button size="small" variant="outlined">
            Lihat
          </Button>
        ) : (
          "-"
        ),
    },
  ];

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
          <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
            <DataGrid
              rows={dataGridRows}
              columns={columns}
              loading={loading}
              autoHeight
              disableColumnMenu
              pageSize={pageSize}
              hideFooter={true}
            />
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
