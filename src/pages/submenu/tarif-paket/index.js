import React, { useState } from "react";
import { Box, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

const paketData = [
  {
    id: 1,
    nama_paket: "Paket Standar",
    status: "enable",
    biaya_admin: 5000,
    deskripsi: "Paket dengan 5 blok tarif berbeda harga",
  },
  {
    id: 2,
    nama_paket: "Paket Premium",
    status: "disable",
    biaya_admin: 10000,
    deskripsi: "Akses premium dengan tarif berbeda",
  },
];

const blokTarifData = {
  1: [
    { id: 1, blok_ke: 1, batas_atas: 10, harga_per_m3: 1500 },
    { id: 2, blok_ke: 2, batas_atas: 20, harga_per_m3: 2000 },
  ],
  2: [
    { id: 1, blok_ke: 1, batas_atas: 15, harga_per_m3: 2500 },
    { id: 2, blok_ke: 2, batas_atas: 25, harga_per_m3: 3500 },
  ],
};

export default function PengaturanTarifPaket({ onBack }) {
  const [openBlok, setOpenBlok] = useState(false);
  const [selectedPaket, setSelectedPaket] = useState(null);

  const handleRowClick = (params) => {
    setSelectedPaket(params.row);
    setOpenBlok(true);
  };

  const handleCloseBlok = () => {
    setOpenBlok(false);
    setSelectedPaket(null);
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  const paketColumns = [
    { field: "id", headerName: "No", width: 70 },
    { field: "nama_paket", headerName: "Nama Paket", width: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      renderCell: (params) =>
        params.value === "enable" ? (
          <Chip label="Aktif" color="success" size="small" />
        ) : (
          <Chip label="Nonaktif" color="default" size="small" />
        ),
      align: "center",
      headerAlign: "center",
    },
    {
      field: "biaya_admin",
      headerName: "Biaya Admin",
      width: 120,
      valueFormatter: (params) => `Rp ${Number(params.value).toLocaleString()}`,
    },
    { field: "deskripsi", headerName: "Deskripsi", width: 250 },
    {
      field: "aksi",
      headerName: "Aksi",
      width: 110,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: () => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Tooltip title="Edit Paket">
            <IconButton size="small" color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus Paket">
            <IconButton size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // Blok tarif - width proporsional, tombol aksi rata tengah atas-bawah
  const blokColumns = [
    { field: "blok_ke", headerName: "Blok", minWidth: 60, flex: 0.6, align: "center", headerAlign: "center" },
    { field: "batas_atas", headerName: "Batas Atas (m³)", minWidth: 120, flex: 1, align: "right", headerAlign: "center" },
    {
      field: "harga_per_m3",
      headerName: "Harga/m³",
      minWidth: 120,
      flex: 1,
      align: "right",
      headerAlign: "center",
      valueFormatter: (params) => `Rp ${Number(params.value).toLocaleString()}`,
    },
    {
      field: "aksi",
      headerName: "Aksi",
      minWidth: 80,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      sortable: false,
      renderCell: () => (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Tooltip title="Edit Blok Tarif">
            <IconButton size="small" color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hapus Blok Tarif">
            <IconButton size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  // rows data blok, hanya diisi jika ada selected paket
  const blokRows =
    blokTarifData[selectedPaket?.id] && selectedPaket
      ? blokTarifData[selectedPaket.id].map((b, idx) => ({
          ...b,
          id: b.id || idx + 1,
        }))
      : [];

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1} flexWrap="wrap" gap={2}>
        {/* Judul kiri */}
        <Typography variant="h6">Pengaturan Tarif & Paket</Typography>
        {/* Button kanan */}
        <Box display="flex" gap={1}>
          <Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ minWidth: 120 }}>
            Kembali
          </Button>
          <Button
            component={Link}
            to="/pengaturan/tarif-paket/tambah"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{ minWidth: 140 }}
          >
            Tambah Paket
          </Button>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Klik baris paket untuk melihat detail blok tarif.
      </Typography>

      <DataGrid
        rows={paketData}
        columns={paketColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        disableSelectionOnClick
        onRowClick={handleRowClick}
        sx={{
          cursor: "pointer",
        }}
      />

      {/* Dialog Blok Tarif */}
      <Dialog open={openBlok} onClose={handleCloseBlok} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedPaket ? `Daftar Blok Tarif - ${selectedPaket.nama_paket}` : "Daftar Blok Tarif"}</DialogTitle>
        <DialogContent>
          <Box mb={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              Tambah Blok Tarif
            </Button>
          </Box>
          {selectedPaket ? (
            <DataGrid
              rows={blokRows}
              columns={blokColumns}
              autoHeight
              hideFooter // Pagination dimatikan
              disableSelectionOnClick
              localeText={{
                noRowsLabel: "Belum ada blok tarif untuk paket ini",
              }}
              sx={{
                width: "100%",
                "& .MuiDataGrid-cell": {
                  alignItems: "center",
                },
              }}
            />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Pilih paket untuk melihat blok tarif.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBlok}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
