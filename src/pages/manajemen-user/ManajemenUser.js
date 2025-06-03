import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import ActionIconButton from "../components/ActionIconButton";
import TableDropdown from "../components/TableDropdown";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { getAllUsers } from "./userApi";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const columns = [
    { field: "namaLengkap", headerName: "Nama Lengkap", flex: 1, minWidth: 180 },
    { field: "username", headerName: "Username", flex: 1, minWidth: 120 },
    { field: "jabatan", headerName: "Jabatan", flex: 1, minWidth: 100 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
    { field: "telpon", headerName: "Telpon", flex: 1, minWidth: 150 },
    {
      field: "action",
      headerName: "Aksi",
      flex: 1,
      minWidth: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, height: "100%" }}>
          <ActionIconButton
            color={theme.palette.primary.main}
            title="Edit"
            onClick={() => handleEdit(params.row)}
            sx={{
              width: "30px",
              height: "30px",
              minWidth: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Edit fontSize="small" />
          </ActionIconButton>
          <ActionIconButton
            color={theme.palette.error.main}
            title="Hapus"
            onClick={() => handleDelete(params.row)}
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
    },
  ];

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        console.log("Data fetched from API:", data); // Log data fetched from API
        setRows(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error); // Log error if fetching fails
        setLoading(false);
      });
  }, []);

  const filteredRows = rows.filter((row) => row.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()));
  const dataGridRows = filteredRows.map((row, idx) => ({ ...row, id: row.id ?? idx + 1 }));

  const handleEdit = (row) => {
    navigate(`/user/edit/${row.id}`);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (rowToDelete) {
      setRows((prev) => prev.filter((item) => item.id !== rowToDelete.id));
      setRowToDelete(null);
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setRowToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTambahUser = () => {
    navigate("/manajemen-user/tambah");
  };

  const handleHapusUser = () => {
    alert("Hapus Pengguna yang di-select");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
          Manajemen Pengguna
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label=""
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ color: "text.secondary", mr: 1 }}>
                  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.5 14.5L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </Box>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 250 },
              background: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: 1,
              "& .MuiOutlinedInput-root": {
                pr: 0,
              },
            }}
            placeholder="Cari nama pengguna..."
          />
          <TableDropdown
            label="Menu"
            menuItems={[
              {
                label: "Tambah Pengguna",
                icon: <Edit fontSize="small" style={{ marginRight: 8 }} />,
                onClick: handleTambahUser,
              },
              {
                label: "Hapus Pengguna",
                icon: <Delete fontSize="small" style={{ marginRight: 8 }} />,
                onClick: handleHapusUser,
              },
            ]}
          />
        </Box>
      </Box>
      <DataGrid
        checkboxSelection
        rows={dataGridRows}
        columns={columns}
        pageSize={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangeRowsPerPage}
        pagination
        loading={loading}
      />
      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus data pengguna <b>{rowToDelete?.namaLengkap}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Batal
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Ya, Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
