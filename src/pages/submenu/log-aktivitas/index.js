import React, { useState } from "react";
import { Box, Typography, Paper, Divider, Stack, TextField, InputAdornment, Chip, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";

const dummyLog = [
  {
    id: 1,
    waktu: "2024-06-10 08:31:24",
    user: "Budi Santoso (Admin)",
    aksi: "Login",
    detail: "Berhasil login ke sistem",
    ip: "36.77.5.22",
  },
  {
    id: 2,
    waktu: "2024-06-10 08:35:12",
    user: "Rina Sari (Staf)",
    aksi: "Tambah Tagihan",
    detail: "Tambah tagihan pelanggan A123456 periode Juni 2024",
    ip: "36.77.6.18",
  },
  {
    id: 3,
    waktu: "2024-06-10 09:02:09",
    user: "Budi Santoso (Admin)",
    aksi: "Edit Paket",
    detail: "Edit paket Standar menjadi Premium",
    ip: "36.77.5.22",
  },
  {
    id: 4,
    waktu: "2024-06-10 10:10:41",
    user: "Andi Wijaya (Pengelola)",
    aksi: "Logout",
    detail: "Logout dari sistem",
    ip: "10.22.23.4",
  },
  {
    id: 5,
    waktu: "2024-06-10 10:15:11",
    user: "Rina Sari (Staf)",
    aksi: "Hapus Tagihan",
    detail: "Hapus tagihan pelanggan A123456 periode Mei 2024",
    ip: "36.77.6.18",
  },
];

export default function LogAktifitas() {
  const [search, setSearch] = useState("");
  const filtered = dummyLog.filter(
    (row) =>
      row.user.toLowerCase().includes(search.toLowerCase()) ||
      row.aksi.toLowerCase().includes(search.toLowerCase()) ||
      row.detail.toLowerCase().includes(search.toLowerCase()) ||
      row.ip.toLowerCase().includes(search.toLowerCase())
  );

  // Penomoran manual no: idx + 1
  const rowsWithNo = filtered.map((row, idx) => ({ ...row, no: idx + 1 }));

  const columns = [
    { field: "no", headerName: "No", width: 60 },
    { field: "waktu", headerName: "Waktu", minWidth: 150, flex: 1 },
    { field: "user", headerName: "User", minWidth: 170, flex: 1 },
    {
      field: "aksi",
      headerName: "Aksi",
      minWidth: 130,
      flex: 1,
      renderCell: (params) => <Chip label={params.value} color="primary" size="small" variant="outlined" />,
    },
    { field: "detail", headerName: "Detail", minWidth: 240, flex: 2 },
    { field: "ip", headerName: "IP", minWidth: 120, flex: 1 },
  ];

  return (
    <Box width="100%">
      <Paper sx={{ p: 3, width: "100%" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Log Aktivitas Sistem
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Cari user, aksi, detail, atau IP…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2, minWidth: 260 },
            }}
          />
          <Button variant="outlined" size="small" onClick={() => setSearch("")}>
            Reset
          </Button>
        </Stack>
        <DataGrid
          rows={rowsWithNo}
          columns={columns}
          autoHeight
          hideFooter
          disableSelectionOnClick
          sx={{
            mb: 2,
            ".MuiDataGrid-cell": { py: 1.3 },
            ".MuiDataGrid-row": { minHeight: 54, maxHeight: 90 },
          }}
        />
      </Paper>
    </Box>
  );
}
