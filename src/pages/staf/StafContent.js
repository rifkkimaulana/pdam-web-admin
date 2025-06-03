import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchStafData, deleteStaf } from "./stafApi";
import ActionIconButton from "../components/ActionIconButton";
import { Edit, Delete } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function StafContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stafData, setStafData] = useState([]);

  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadStafData = async () => {
      try {
        const data = await fetchStafData();
        setStafData(data);
        toast.success("Berhasil memuat data staf.", { position: "top-right" });
      } catch (error) {
        console.error("Error fetching staf data:", error);
        toast.error("Gagal memuat data staf. Silakan coba lagi.", { position: "top-right" });
      }
    };

    loadStafData();
  }, []);

  const handleEdit = (id) => {
    navigate(`/staf/edit/${id}`);
  };
  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDialogOpen(false);
    setDeleteId(null);
  };

  const confirmDelete = async () => {
    try {
      await deleteStaf(deleteId);
      setStafData((prevData) => prevData.filter((staf) => staf.id !== deleteId));
      closeDeleteDialog();
      toast.success("Data staf berhasil dihapus.", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting staf:", error);
      toast.error("Gagal menghapus data staf. Silakan coba lagi.", { position: "top-right" });
    }
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0, minWidth: 50, maxWidth: 60 },
    { field: "nama_lengkap", headerName: "Nama Lengkap", flex: 0, minWidth: 180, maxWidth: 200 },
    { field: "alamat", headerName: "Alamat", flex: 0, minWidth: 220, maxWidth: 300 },
    { field: "user_pengelola", headerName: "Nama Pengelola", flex: 0, minWidth: 160, maxWidth: 200 },
    { field: "perusahaan", headerName: "Perusahaan", flex: 0, minWidth: 160, maxWidth: 200 },
    { field: "jabatan", headerName: "Jabatan", flex: 0, minWidth: 120, maxWidth: 150 },
    {
      field: "actions",
      headerName: "Aksi",
      flex: 0,
      minWidth: 90,
      maxWidth: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, height: "100%" }}>
          <ActionIconButton
            color="#1976d2"
            title="Edit"
            sx={{ width: "30px", height: "30px", minWidth: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={() => handleEdit(params.row.id)}
          >
            <Edit fontSize="small" />
          </ActionIconButton>
          <ActionIconButton
            color="#d32f2f"
            title="Hapus"
            onClick={() => openDeleteDialog(params.row.id)}
            sx={{ width: "30px", height: "30px", minWidth: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Delete fontSize="small" />
          </ActionIconButton>
        </Box>
      ),
      headerAlign: "center",
    },
  ];

  const filteredRows = stafData
    .filter((row) => row.jabatan.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((row, index) => ({
      ...row,
      id: index + 1,
      nama_lengkap: row.user?.nama_lengkap || "-",
      alamat: row.user?.alamat || "-",
      user_pengelola: row.user_pengelola?.nama_lengkap || "-",
      perusahaan: row.pengelola?.nama_pengelola || "-",
    }));

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Daftar Staf
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="Cari Jabatan"
            variant="outlined"
            size="small"
            sx={{ width: "250px", height: "40px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              sx: { height: "40px", boxSizing: "border-box", display: "flex", alignItems: "center" },
            }}
          />
          <Button
            variant="contained"
            color="success"
            component={Link}
            to="/staf/tambah/"
            sx={{
              height: "40px",

              boxShadow: "none",
              px: 3,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            Tambah Staf
          </Button>
        </Box>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
        <DialogContent>Apakah Anda yakin ingin menghapus data staf ini?</DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Batal
          </Button>
          <Button onClick={confirmDelete} color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <DataGrid
        rows={filteredRows}
        columns={columns.map((column) => {
          if (column.field === "actions") {
            return {
              ...column,
              renderCell: (params) => (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, height: "100%" }}>
                  <ActionIconButton
                    color="#1976d2"
                    title="Edit"
                    sx={{
                      width: "30px",
                      height: "30px",
                      minWidth: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={() => handleEdit(params.row.id)}
                  >
                    <Edit fontSize="small" />
                  </ActionIconButton>
                  <ActionIconButton
                    color="#d32f2f"
                    title="Hapus"
                    onClick={() => openDeleteDialog(params.row.id)}
                    sx={{
                      width: "30px",
                      height: "30px",
                      minWidth: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Delete fontSize="small" />
                  </ActionIconButton>
                </Box>
              ),
            };
          }
          return column;
        })}
        pageSize={10}
        disableColumnResize
        density="compact"
      />
    </Box>
  );
}
