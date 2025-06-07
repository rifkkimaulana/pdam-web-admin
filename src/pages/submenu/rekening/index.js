import React, { useState } from "react";
import { Box, Typography, Paper, Divider, Stack, Chip, Button, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

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
    { field: "no", headerName: "No", width: 70, align: "center", headerAlign: "center" },
    { field: "waktu", headerName: "Waktu", minWidth: 170, flex: 1 },
    { field: "user", headerName: "User", minWidth: 180, flex: 1 },
    {
      field: "aksi",
      headerName: "Aksi",
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => <Chip label={params.value} color="primary" size="small" variant="outlined" />,
    },
    { field: "detail", headerName: "Detail", minWidth: 250, flex: 2 },
    { field: "ip", headerName: "IP", minWidth: 120, flex: 0.8 },
  ];

  return (
    <Box width="100%">
      <Paper sx={{ p: { xs: 1.5, md: 3 }, width: "100%" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            Log Aktivitas Sistem
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: 99,
              px: 2,
              py: 0.5,
              bgcolor: "background.paper",
              boxShadow: 1,
              border: 1,
              borderColor: "divider",
              minWidth: search ? 230 : 48,
              transition: "all .22s",
              cursor: "text",
              "&:hover, &:focus-within": {
                boxShadow: 2,
                borderColor: "primary.main",
              },
            }}
            onClick={() => {
              const input = document.getElementById("search-log-input");
              if (input) input.focus();
            }}
          >
            <SearchIcon sx={{ fontSize: 20, mr: search ? 1 : 0 }} />
            <input
              id="search-log-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari log…"
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 15,
                minWidth: search ? 100 : 0,
                width: search ? "100%" : 0,
                transition: "width .2s",
                color: "inherit",
              }}
            />
            {search && (
              <Tooltip title="Hapus pencarian">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearch("");
                  }}
                  size="small"
                  sx={{
                    minWidth: 0,
                    fontSize: 14,
                    p: 0,
                    ml: 1,
                    color: "text.secondary",
                  }}
                >
                  <ClearIcon fontSize="small" />
                </Button>
              </Tooltip>
            )}
          </Box>
        </Stack>
        <DataGrid
          rows={rowsWithNo}
          columns={columns}
          autoHeight
          hideFooter
          disableSelectionOnClick
          sx={{
            mb: 2,
            borderRadius: 2,
            ".MuiDataGrid-cell": { py: 1.3 },
            ".MuiDataGrid-row": { minHeight: 54, maxHeight: 90 },
          }}
        />
      </Paper>
    </Box>
  );
}
