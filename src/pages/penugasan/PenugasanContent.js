import React, { useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

export default function PenugasanContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const columns = [
    { field: "assignmentId", headerName: "ID Tugas", flex: 1, minWidth: 100 },
    { field: "staffName", headerName: "Nama Staf", flex: 2, minWidth: 200 },
    { field: "taskDescription", headerName: "Deskripsi Tugas", flex: 2, minWidth: 250 },
    { field: "dueDate", headerName: "Deadline", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
  ];

  const rows = [
    {
      id: 1,
      assignmentId: "TS001",
      staffName: "Andi Saputra",
      taskDescription: "Perbaikan jaringan di area A",
      dueDate: "2025-06-10",
      status: "Sedang Diproses",
    },
    {
      id: 2,
      assignmentId: "TS002",
      staffName: "Siti Rahma",
      taskDescription: "Pemeliharaan sistem billing",
      dueDate: "2025-05-28",
      status: "Selesai",
    },
    {
      id: 3,
      assignmentId: "TS003",
      staffName: "Budi Santoso",
      taskDescription: "Pengecekan keluhan pelanggan",
      dueDate: "2025-06-15",
      status: "Pending",
    },
  ];

  const filteredRows = rows.filter(
    (row) => row.staffName.toLowerCase().includes(searchTerm.toLowerCase()) && (statusFilter ? row.status === statusFilter : true)
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Penugasan Staf
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="success" startIcon={<SaveAlt />} sx={{ height: "40px" }}>
            Export
          </Button>
          <TextField
            label="Cari Staf"
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
