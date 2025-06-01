import React, { useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

export default function LaporanContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const columns = [
    { field: "reportId", headerName: "ID Laporan", flex: 1, minWidth: 100 },
    { field: "reportTitle", headerName: "Judul Laporan", flex: 2, minWidth: 200 },
    { field: "category", headerName: "Kategori", flex: 1, minWidth: 150 },
    { field: "date", headerName: "Tanggal", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
  ];

  const rows = [
    { id: 1, reportId: "L001", reportTitle: "Laporan Tagihan April", category: "Keuangan", date: "2025-04-10", status: "Selesai" },
    { id: 2, reportId: "L002", reportTitle: "Laporan Pelanggan Baru", category: "Pelanggan", date: "2025-05-15", status: "Pending" },
    { id: 3, reportId: "L003", reportTitle: "Laporan Perbaikan Sistem", category: "Teknis", date: "2025-05-20", status: "Selesai" },
  ];

  const filteredRows = rows.filter(
    (row) =>
      row.reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter ? row.category === categoryFilter : true) &&
      (dateFilter ? row.date === dateFilter : true)
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Menu Laporan
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="success" startIcon={<SaveAlt />} sx={{ height: "40px" }}>
            Export
          </Button>
          <TextField
            label="Cari Laporan"
            variant="outlined"
            size="small"
            sx={{ width: "250px", height: "40px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            label="Tanggal"
            type="date"
            variant="outlined"
            size="small"
            sx={{ width: "180px", height: "40px" }}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <TextField
            select
            label="Kategori"
            variant="outlined"
            size="small"
            sx={{ width: "180px", height: "40px" }}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="Keuangan">Keuangan</MenuItem>
            <MenuItem value="Pelanggan">Pelanggan</MenuItem>
            <MenuItem value="Teknis">Teknis</MenuItem>
          </TextField>
        </Box>
      </Box>

      <DataGrid rows={filteredRows} columns={columns} pageSize={10} disableColumnResize density="compact" />
    </Box>
  );
}
