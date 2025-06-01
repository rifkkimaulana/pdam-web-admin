import React, { useState } from "react";
import { Box, Button, TextField, Typography, MenuItem } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";

export default function TagihanContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const columns = [
    { field: "billId", headerName: "ID Tagihan", flex: 1, minWidth: 100 },
    { field: "customerName", headerName: "Nama Pelanggan", flex: 2, minWidth: 200 },
    { field: "amount", headerName: "Total Tagihan", headerAlign: "right", align: "right", flex: 1, minWidth: 120 },
    { field: "dueDate", headerName: "Jatuh Tempo", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Status Pembayaran", flex: 1, minWidth: 150 },
  ];

  const rows = [
    { id: 1, billId: "TG001", customerName: "John Doe", amount: "Rp 500.000", dueDate: "2025-06-10", status: "Belum Lunas" },
    { id: 2, billId: "TG002", customerName: "Jane Smith", amount: "Rp 0", dueDate: "2025-05-15", status: "Lunas" },
    { id: 3, billId: "TG003", customerName: "Michael Johnson", amount: "Rp 750.000", dueDate: "2025-06-20", status: "Belum Lunas" },
  ];

  const filteredRows = rows.filter(
    (row) => row.customerName.toLowerCase().includes(searchTerm.toLowerCase()) && (statusFilter ? row.status === statusFilter : true)
  );

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Tagihan Pembayaran
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
            <MenuItem value="Lunas">Lunas</MenuItem>
            <MenuItem value="Belum Lunas">Belum Lunas</MenuItem>
          </TextField>
        </Box>
      </Box>

      <DataGrid rows={filteredRows} columns={columns} pageSize={10} disableColumnResize density="compact" />
    </Box>
  );
}
