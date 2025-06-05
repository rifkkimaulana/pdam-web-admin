import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ActionIconButton from "../components/ActionIconButton";
import { DataGrid } from "@mui/x-data-grid";
import Add from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllPaketLangganan } from "../../utils/paketLangganan";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Delete from "@mui/icons-material/Delete";

export default function PaketContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [selected, setSelected] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const columns = [
    { field: "nama_paket", headerName: "Nama Paket", flex: 1, minWidth: 180 },
    {
      field: "masa_aktif",
      headerName: "Masa Aktif",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const masaAktif = params?.row?.masa_aktif;
        const satuan = params?.row?.satuan;

        // Gabungkan masa_aktif dan satuan
        return masaAktif && satuan ? `${masaAktif} ${satuan}` : "-";
      },
    },
    {
      field: "harga_paket",
      headerName: "Harga Paket",
      flex: 1,
      minWidth: 120,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const value = params?.row?.harga_paket;

        // Pastikan harga_paket diformat dengan benar
        if (value !== undefined && value !== null) {
          return `Rp ${Number(value).toLocaleString()}`;
        }
        return "-"; // Tampilkan "-" jika harga_paket kosong
      },
    },
    { field: "deskripsi", headerName: "Deskripsi", flex: 2, minWidth: 200 },

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
        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <ActionIconButton color={theme.palette.primary.main} title="Edit" onClick={() => handleEdit(params.row)}>
            <EditIcon fontSize="inherit" />
          </ActionIconButton>
          <ActionIconButton color={theme.palette.error.main} title="Hapus" onClick={() => handleDelete(params.row)}>
            <DeleteIcon fontSize="inherit" />
          </ActionIconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    getAllPaketLangganan()
      .then((data) => {
        const mapped = (data || []).map((item, idx) => ({
          ...item,
          id: item.id || item.id_paket || idx + 1,
        }));
        // console.log("Paket data from API:", data);
        setRows(mapped);
        setLoading(false);
      })
      .catch((error) => {
        // console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const filteredRows = rows.filter((row) => row.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()));

  const dataGridRows = filteredRows;

  // Pagination logic
  const paginatedRows = dataGridRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (params) => {
    setPage(params);
  };

  const handleChangeRowsPerPage = (params) => {
    setRowsPerPage(params);
    setPage(0);
  };

  const handleEdit = (row) => {
    navigate(`/paket/edit/${row.id}`);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setRows((prev) => prev.filter((item) => item.id !== rowToDelete.id));
    setDeleteDialogOpen(false);
    setRowToDelete(null);
    toast.success(`Paket ${rowToDelete?.nama_paket} berhasil dihapus.`);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  };

  // Menu handler
  const handleMenuClick = (event) => {
    setAnchorElMenu(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
          Daftar Paket
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
                height: 40, // Tinggi disamakan dengan button
                minHeight: 40,
              },
              "& .MuiInputBase-input": {
                py: 0,
                height: 40,
                display: "flex",
                alignItems: "center",
              },
            }}
            placeholder="Cari nama paket..."
          />
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
            <MenuItem
              component={Link}
              to="/paket-pengelola/tambah"
              onClick={handleMenuClose}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Add style={{ fontSize: 20, marginRight: 8 }} />
              Tambah Paket
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                if (selected.length === 0) {
                  toast.info("Pilih data yang ingin dihapus!");
                  return;
                }
                setDeleteDialogOpen(true);
                setRowToDelete(selected[0]);
              }}
              style={{ display: "flex", alignItems: "center" }}
            >
              <Delete style={{ fontSize: 20, marginRight: 8 }} />
              Hapus Pilihan
            </MenuItem>
          </Menu>
        </Box>
      </Box>
      <DataGrid
        rows={paginatedRows}
        columns={columns}
        pageSize={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        pagination
        loading={loading}
        page={page}
        onPageChange={(params) => setPage(params)}
        onPageSizeChange={(params) => {
          setRowsPerPage(params);
          setPage(0);
        }}
        rowCount={dataGridRows.length}
        paginationMode="server"
        checkboxSelection
        onSelectionModelChange={(ids) => setSelected(ids)}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah Anda yakin ingin menghapus paket{" "}
            <b>{rowToDelete?.nama_paket || (selected.length > 0 && rows.find((r) => r.id === selected[0])?.nama_paket)}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Batal
          </Button>
          <Button
            onClick={() => {
              const idToDelete = rowToDelete?.id || selected[0];
              setRows((prev) => prev.filter((item) => item.id !== idToDelete));
              setDeleteDialogOpen(false);
              setRowToDelete(null);
              setSelected([]);
              toast.success("Paket berhasil dihapus.");
            }}
            color="error"
            autoFocus
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
