import React, { useState } from "react";
import { Box, Button, Typography, TextField, MenuItem, Card, CardContent } from "@mui/material";
import { Payment, PictureAsPdf } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

export default function KewajibanContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const columns = [
    { field: "invoiceId", headerName: "ID Tagihan", flex: 1, minWidth: 100 },
    { field: "clientName", headerName: "Nama Klien", flex: 2, minWidth: 200 },
    { field: "amount", headerName: "Total Tagihan", headerAlign: "right", align: "right", flex: 1, minWidth: 120 },
    { field: "dueDate", headerName: "Jatuh Tempo", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Status Pembayaran", flex: 1, minWidth: 150 },
    {
      field: "action",
      headerName: "Aksi",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        params.row.status === "Belum Lunas" ? (
          <Button variant="contained" color="success" startIcon={<Payment />} sx={{ borderRadius: "8px", fontWeight: "bold", px: 3 }}>
            Bayar Sekarang
          </Button>
        ) : (
          <Typography sx={{ color: "green" }}>Lunas</Typography>
        ),
    },
  ];

  const rows = [
    { id: 1, invoiceId: "INV001", clientName: "PT Jaya Abadi", amount: "Rp 3.947.192", dueDate: "2025-07-10", status: "Belum Lunas" },
    { id: 2, invoiceId: "INV002", clientName: "CV Sukses Mandiri", amount: "Rp 2.000.000", dueDate: "2025-06-28", status: "Lunas" },
    { id: 3, invoiceId: "INV003", clientName: "PT Global Teknologi", amount: "Rp 1.500.000", dueDate: "2025-07-15", status: "Belum Lunas" },
  ];

  const filteredRows = rows.filter(
    (row) =>
      row.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter ? row.status === statusFilter : true) &&
      (periodFilter ? row.dueDate.startsWith(periodFilter) : true)
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px", p: 3 }}>
      {/* Ringkasan Kewajiban */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Kewajiban Administrasi
          </Typography>
          <Typography variant="h6" color="primary">
            Kewajiban Bulan Juli 2025
          </Typography>
          <Typography variant="h4" color="error">
            Rp 3.947.192
          </Typography>
          <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
            Klik untuk melihat detail kewajiban
          </Button>
        </CardContent>
      </Card>

      {/* Pencarian & Filter */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Item Kewajiban
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="error"
            startIcon={<PictureAsPdf />}
            sx={{ height: "40px", borderRadius: "8px", fontWeight: "bold" }}
          >
            Download PDF
          </Button>
          <TextField
            label="Cari Klien"
            variant="outlined"
            size="small"
            sx={{ width: "250px", height: "40px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            select
            label="Pilih Periode"
            variant="outlined"
            size="small"
            sx={{ width: "180px", height: "40px" }}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="2025-07">Juli 2025</MenuItem>
            <MenuItem value="2025-06">Juni 2025</MenuItem>
          </TextField>
          <TextField
            select
            label="Pilih Status"
            variant="outlined"
            size="small"
            sx={{ width: "180px", height: "40px" }}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="Lunas">Lunas</MenuItem>
            <MenuItem value="Belum Lunas">Belum Lunas</MenuItem>
          </TextField>
        </Box>
      </Box>

      {/* Tabel Tagihan */}
      <DataGrid rows={filteredRows} columns={columns} pageSize={10} disableColumnResize density="compact" />
    </Box>
  );
}
