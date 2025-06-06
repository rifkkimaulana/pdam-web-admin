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

import { Link, useNavigate } from "react-router-dom";
import PengelolaDataGrid from "./PengelolaDataGrid";
import { getAllUsers } from "../../utils/user";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [checkedUserIds, setCheckedUserIds] = useState([]);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [dataGridInitialState, setDataGridInitialState] = useState({
    pagination: {
      paginationModel: { pageSize: 10, page: 0 },
    },
    sorting: {
      sortModel: [{ field: "user.nama_lengkap", sort: "asc" }],
    },
  });

  useEffect(() => {
    setLoading(true);
    getAllUsers(page, pageSize, searchTerm, filterStatus)
      .then((data) => {
        setRows(data.data || []);
        setTotalRows(Number(data.total) || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, pageSize, searchTerm, filterStatus]);

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
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0); // reset ke halaman pertama saat filter berubah
            }}
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
            <MenuItem
              selected={filterStatus === ""}
              onClick={() => {
                handleFilterStatus("");
                setPage(0);
              }}
            >
              Semua Status
            </MenuItem>
            <MenuItem
              selected={filterStatus === "Aktif"}
              onClick={() => {
                handleFilterStatus("Aktif");
                setPage(0);
              }}
            >
              Aktif
            </MenuItem>
            <MenuItem
              selected={filterStatus === "Tidak Aktif"}
              onClick={() => {
                handleFilterStatus("Tidak Aktif");
                setPage(0);
              }}
            >
              Tidak Aktif
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <PengelolaDataGrid
        checkedUserIds={checkedUserIds}
        setCheckedUserIds={setCheckedUserIds}
        setRowToDelete={setRowToDelete}
        setOpenDeleteDialog={setOpenDeleteDialog}
        rows={rows}
        loading={loading}
        page={page}
        pageSize={pageSize}
        rowCount={totalRows}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        initialState={dataGridInitialState}
      />

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          Apakah Anda yakin ingin menghapus data pengguna <b>{rowToDelete?.user?.nama_lengkap}</b>?
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
