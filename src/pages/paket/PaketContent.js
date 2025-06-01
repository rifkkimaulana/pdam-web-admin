import React, { useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

export default function PaketContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const columns = [
    { field: "packageId", headerName: "ID Paket", flex: 1, minWidth: 100 },
    { field: "packageName", headerName: "Nama Paket", flex: 2, minWidth: 200 },
    { field: "category", headerName: "Kategori", flex: 1, minWidth: 150 },
    { field: "price", headerName: "Harga", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
  ];

  const rows = [
    { id: 1, packageId: "PKG01", packageName: "Paket Standard", category: "Rumah Tangga", price: "Rp 250.000", status: "Tersedia" },
    { id: 2, packageId: "PKG02", packageName: "Paket Premium", category: "Perusahaan", price: "Rp 500.000", status: "Tersedia" },
    { id: 3, packageId: "PKG03", packageName: "Paket Industrial", category: "Industri", price: "Rp 750.000", status: "Tidak Tersedia" },
  ];

  const filteredRows = rows.filter(
    (row) => row.packageName.toLowerCase().includes(searchTerm.toLowerCase()) && (categoryFilter ? row.category === categoryFilter : true)
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Daftar Paket
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="success" startIcon={<SaveAlt />} sx={{ height: "40px" }}>
            Export
          </Button>
          <TextField
            label="Cari Paket"
            variant="outlined"
            size="small"
            sx={{ width: "250px", height: "40px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <MenuItem value="Rumah Tangga">Rumah Tangga</MenuItem>
            <MenuItem value="Perusahaan">Perusahaan</MenuItem>
            <MenuItem value="Industri">Industri</MenuItem>
          </TextField>
        </Box>
      </Box>

      <DataGrid rows={filteredRows} columns={columns} pageSize={10} disableColumnResize density="compact" />
    </Box>
  );
}
