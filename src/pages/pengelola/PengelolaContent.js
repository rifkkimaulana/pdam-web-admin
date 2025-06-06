import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  Box,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import { Add, Update, Verified, FilterList } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { getAllUsers } from "../../utils/user";
import { Link, useNavigate } from "react-router-dom";
import PengelolaDataGrid from "./PengelolaDataGrid";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [checkedUserIds, setCheckedUserIds] = useState([]);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setRows(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter data sesuai search dan status
  const filteredRows = rows.filter((row) => {
    const matchNama = row.user?.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus ? row.langganan?.status === filterStatus : true;
    return matchNama && matchStatus;
  });

  const handleMenuClick = (event) => setAnchorElMenu(event.currentTarget);
  const handleMenuClose = () => setAnchorElMenu(null);
  const handleFilterClick = (event) => setAnchorElFilter(event.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setAnchorElFilter(null);
  };

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
          />
          <Button
            variant="contained"
            color="success"
            sx={{ height: "40px", boxShadow: "none", px: 3 }}
            endIcon={<ArrowDropDownIcon />}
            onClick={handleMenuClick}
          >
            Menu
          </Button>
          <Menu anchorEl={anchorElMenu} open={Boolean(anchorElMenu)} onClose={handleMenuClose}>
            <MenuItem component={Link} to="/paket-pengelola" onClick={handleMenuClose}>
              <FilterList style={{ fontSize: 20, marginRight: 8 }} />
              Kelola Paket
            </MenuItem>
            <Divider />
            <MenuItem component={Link} to="/pengelola/tambah" onClick={handleMenuClose}>
              <Add style={{ fontSize: 20, marginRight: 8 }} />
              Tambah Pengelola
            </MenuItem>
            <MenuItem onClick={handleFilterClick}>
              <FilterList style={{ fontSize: 20, marginRight: 8 }} />
              Filter Status Langganan
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Update style={{ fontSize: 20, marginRight: 8 }} />
              Perbaharui Langganan
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Verified style={{ fontSize: 20, marginRight: 8 }} />
              Verifikasi Pembayaran
            </MenuItem>
          </Menu>
          <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
            <MenuItem selected={filterStatus === ""} onClick={() => handleFilterStatus("")}>
              Semua Status
            </MenuItem>
            <MenuItem selected={filterStatus === "Aktif"} onClick={() => handleFilterStatus("Aktif")}>
              Aktif
            </MenuItem>
            <MenuItem selected={filterStatus === "Tidak Aktif"} onClick={() => handleFilterStatus("Tidak Aktif")}>
              Tidak Aktif
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <PengelolaDataGrid
        rows={filteredRows}
        loading={loading}
        checkedUserIds={checkedUserIds}
        setCheckedUserIds={setCheckedUserIds}
        setRowToDelete={setRowToDelete}
        setOpenDeleteDialog={setOpenDeleteDialog}
        navigate={navigate}
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
