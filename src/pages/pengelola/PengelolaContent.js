import React, { useState, useEffect } from "react";
import { Menu, MenuItem, Box, TextField, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import ActionIconButton from "../components/ActionIconButton";
import { useTheme } from "@mui/material/styles";
import { Add, Update, Verified, FilterList } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getAllUsers } from "../../utils/user";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const theme = useTheme();

  const columns = [
    { field: "user.nama_lengkap", headerName: "Nama Pengelola", flex: 1, minWidth: 180 },
    { field: "user.email", headerName: "Email Pengelola", flex: 1, minWidth: 200 },
    { field: "user.telpon", headerName: "Nomor Telpon", flex: 1, minWidth: 150 },
    { field: "user.alamat", headerName: "Alamat Pengelola", flex: 1, minWidth: 200 },
    { field: "pengelola.nama_pengelola", headerName: "Nama PDAM", flex: 1, minWidth: 180 },
    { field: "pengelola.email", headerName: "Email PDAM", flex: 1, minWidth: 200 },
    { field: "pengelola.telpon", headerName: "Nomor Telpon PDAM", flex: 1, minWidth: 150 },
    { field: "langganan.status", headerName: "Status Langganan", flex: 1, minWidth: 150 },
    { field: "langganan.mulai_langganan", headerName: "Tanggal Mulai", flex: 1, minWidth: 130 },
    { field: "langganan.akhir_langganan", headerName: "Tanggal Akhir", flex: 1, minWidth: 130 },
    { field: "paket.nama_paket - paket.masa_aktif paket.satuan", headerName: "Paket Langganan", flex: 1, minWidth: 150 },
    { field: "paket.harga_paket", headerName: "Harga Paket", flex: 1, minWidth: 120 },
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

  const filteredRows = rows.filter((row) => {
    const matchNama = row.user?.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? row.langganan?.status === filterStatus : true;
    return matchNama && matchStatus;
  });
  const dataGridRows = filteredRows.map((row, idx) => ({
    id: row.id ?? idx + 1,
    "user.nama_lengkap": row.user?.nama_lengkap || "-",
    "user.email": row.user?.email || "-",
    "user.telpon": row.user?.telpon || "-",
    "user.alamat": row.user?.alamat || "-",
    "pengelola.nama_pengelola": row.pengelola?.nama_pengelola || "-",
    "pengelola.email": row.pengelola?.email || "-",
    "pengelola.telpon": row.pengelola?.telpon || "-",
    "langganan.status": row.langganan?.status || "-",
    "langganan.mulai_langganan": row.langganan?.mulai_langganan || "-",
    "langganan.akhir_langganan": row.langganan?.akhir_langganan || "-",
    "paket.nama_paket - paket.masa_aktif paket.satuan": row.paket
      ? `${row.paket.nama_paket} - ${row.paket.masa_aktif} ${row.paket.satuan}`
      : "-",
    "paket.harga_paket": row.paket?.harga_paket || "-",
  }));

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

  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  const handleFilterClick = (event) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorElFilter(null);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setAnchorElFilter(null);
  };

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setRows(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
          Manajemen Pengelola
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <TextField
            label="Cari Nama Pengelola"
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
            endIcon={<ArrowDropDownIcon />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>

          <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
            <MenuItem onClick={() => handleFilterStatus("Aktif")}>Pengelola Aktif</MenuItem>
            <MenuItem onClick={() => handleFilterStatus("Tidak Aktif")}>Pengelola Tidak Aktif</MenuItem>
            <MenuItem onClick={() => handleFilterStatus("")}>Semua</MenuItem>
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
            endIcon={<ArrowDropDownIcon />}
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
