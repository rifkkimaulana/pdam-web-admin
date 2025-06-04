import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Box,
  TextField,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import ActionIconButton from "../components/ActionIconButton";
import { useTheme } from "@mui/material/styles";
import { Add, Update, Verified, FilterList } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
      renderCell: () => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, height: "100%" }}>
          <ActionIconButton
            color={theme.palette.primary.main}
            title="Edit"
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

  const filteredRows = rows.filter((row) => row.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()));
  const dataGridRows = filteredRows.map((row, idx) => ({ ...row, id: row.id ?? idx + 1 }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTambahUser = () => {
    alert("Navigasi ke tambah pengguna");
  };

  const handleHapusUser = () => {
    alert("Hapus Pengguna yang di-select");
  };

  const [anchorElMenu, setAnchorElMenu] = useState(null); // Untuk dropdown menu
  const [anchorElFilter, setAnchorElFilter] = useState(null); // Untuk dropdown filter

  const handleMenuClick = (event) => {
    setAnchorElMenu(event.currentTarget); // Menampilkan menu
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null); // Menutup menu
  };

  const handleFilterClick = (event) => {
    setAnchorElFilter(event.currentTarget); // Menampilkan filter dropdown
  };

  const handleFilterClose = () => {
    setAnchorElFilter(null); // Menutup filter dropdown
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
          Manajemen Pengguna
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
            variant="outlined"
            color="primary"
            sx={{
              height: "40px",
              boxShadow: "none",
              px: 3,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
            }}
            endIcon={<ArrowDropDownIcon />} // Menambahkan ikon dropdown
            onClick={handleFilterClick}
          >
            Filter
          </Button>

          {/* Dropdown Filter */}
          <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
            <MenuItem onClick={handleFilterClose}>Pengelola Aktif</MenuItem>
            <MenuItem onClick={handleFilterClose}>Pengelola Tidak Aktif</MenuItem>
          </Menu>

          <Button
            variant="contained"
            color="success"
            sx={{
              height: "40px",
              boxShadow: "none",
              px: 3,
              minWidth: 0,
              display: "flex",
              alignItems: "center",
            }}
            endIcon={<ArrowDropDownIcon />} // Menambahkan ikon dropdown
            onClick={handleMenuClick}
          >
            Menu
          </Button>

          <Menu anchorEl={anchorElMenu} open={Boolean(anchorElMenu)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose} style={{ display: "flex", alignItems: "center" }}>
              <Add style={{ fontSize: 20, marginRight: 8 }} />
              Tambah Pengelola
            </MenuItem>
            <MenuItem onClick={handleMenuClose} style={{ display: "flex", alignItems: "center" }}>
              <Update style={{ fontSize: 20, marginRight: 8 }} />
              Perbaharui Langganan
            </MenuItem>
            <MenuItem onClick={handleMenuClose} style={{ display: "flex", alignItems: "center" }}>
              <Verified style={{ fontSize: 20, marginRight: 8 }} />
              Verifikasi Pembayaran
            </MenuItem>
            <MenuItem onClick={handleMenuClose} style={{ display: "flex", alignItems: "center" }}>
              <Delete style={{ fontSize: 20, marginRight: 8 }} />
              Hapus Pilihan
            </MenuItem>
          </Menu>
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
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus data pengguna <b>{rowToDelete?.namaLengkap}</b>?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Batal
          </Button>
          <Button onClick={() => setOpenDeleteDialog(false)} color="error" variant="contained">
            Ya, Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
