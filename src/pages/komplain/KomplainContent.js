import React, { useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

export default function KomplainContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const columns = [
    { field: "complaintId", headerName: "ID Komplain", flex: 1, minWidth: 100 },
    { field: "customerName", headerName: "Nama Pelanggan", flex: 2, minWidth: 200 },
    { field: "complaintType", headerName: "Jenis Komplain", flex: 1, minWidth: 150 },
    { field: "dateSubmitted", headerName: "Tanggal Pengajuan", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
  ];

  const rows = [
    {
      id: 1,
      complaintId: "KP001",
      customerName: "John Doe",
      complaintType: "Gangguan Layanan",
      dateSubmitted: "2025-06-01",
      status: "Sedang Diproses",
    },
    {
      id: 2,
      complaintId: "KP002",
      customerName: "Jane Smith",
      complaintType: "Tagihan Tidak Sesuai",
      dateSubmitted: "2025-05-28",
      status: "Selesai",
    },
    {
      id: 3,
      complaintId: "KP003",
      customerName: "Michael Johnson",
      complaintType: "Pelayanan Buruk",
      dateSubmitted: "2025-06-03",
      status: "Pending",
    },
  ];

  const filteredRows = rows.filter(
    (row) => row.customerName.toLowerCase().includes(searchTerm.toLowerCase()) && (statusFilter ? row.status === statusFilter : true)
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Daftar Komplain
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="success" startIcon={<SaveAlt />} sx={{ height: "40px" }}>
            Export
          </Button>
          <TextField
            label="Cari Pelanggan"
            variant="outlined"
            size="small"
            sx={{ width: "250px", height: "40px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            select
            label="Status"
            variant="outlined"
            size="small"
            sx={{ width: "180px", height: "40px" }}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Sedang Diproses">Sedang Diproses</MenuItem>
            <MenuItem value="Selesai">Selesai</MenuItem>
          </TextField>
        </Box>
      </Box>

      <DataGrid rows={filteredRows} columns={columns} pageSize={10} disableColumnResize density="compact" />
    </Box>
  );
}
