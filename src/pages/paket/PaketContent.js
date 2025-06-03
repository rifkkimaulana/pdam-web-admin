import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllPaket } from "./paketApi";

export default function PaketContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 80 },
    { field: "nama_paket", headerName: "Nama Paket", flex: 2, minWidth: 200 },
    {
      field: "biaya_admin",
      headerName: "Biaya Admin",
      flex: 1,
      minWidth: 120,
      valueFormatter: ({ value }) => `Rp ${Number(value).toLocaleString()}`,
    },
    { field: "deskripsi", headerName: "Deskripsi", flex: 2, minWidth: 200 },
    { field: "status", headerName: "Status", flex: 1, minWidth: 100 },
  ];

  useEffect(() => {
    setLoading(true);
    getAllPaket()
      .then((res) => {
        // Tambahkan index array ke setiap item
        const mapped = [];
        (res.data || []).forEach((item) => {
          mapped.push({
            ...item,
            biaya_admin: item.biaya_admin ?? 0,
          });
        });
        setRows(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredRows = rows.filter((row) => row.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()));

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
        </Box>
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        pageSize={10}
        loading={loading}
        disableColumnResize
        density="compact"
        getRowId={(row) => row.id}
      />
    </Box>
  );
}
