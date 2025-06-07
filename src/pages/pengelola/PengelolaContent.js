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
  Grid,
} from "@mui/material";
import { Add, Update, Verified, FilterList } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DataGrid } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import ActionIconButton from "../components/ActionIconButton";
import { Edit, Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../utils/user";
import TablePagination from "@mui/material/TablePagination";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import { toast } from "react-toastify";
import SearchTableContent from "../components/content-components/SearchTableContent";
import CustomPaginationTable from "../components/content-components/CustomPaginationTable";

export default function UserManagement() {
  const [jabatan, setJabatan] = useState("Pengelola");
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

  // State untuk dialog hapus batch dan loading
  const [openBatchDeleteDialog, setOpenBatchDeleteDialog] = useState(false);
  const [deletingBatch, setDeletingBatch] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0, name: "" });

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    getAllUsers(page + 1, pageSize, searchTerm, filterStatus, jabatan)
      .then((data) => {
        setRows(data.data || []);
        setTotalRows(Number(data.total) || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, pageSize, searchTerm, filterStatus, jabatan]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterStatus]);

  const handleMenuClick = (event) => setAnchorElMenu(event.currentTarget);
  const handleMenuClose = () => setAnchorElMenu(null);
  const handleFilterClick = (event) => setAnchorElFilter(event.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setAnchorElFilter(null);
  };

  const dataGridRows = rows.map((row, idx) => ({
    id: row.id,
    no: page * pageSize + idx + 1,
    nama_lengkap: row.user?.nama_lengkap || "-",
    email: row.user?.email || "-",
    telpon: row.user?.telpon || "-",
    alamat: row.user?.alamat || "-",
    nama_pengelola: row.pengelola?.nama_pengelola || "-",
    email_pengelola: row.pengelola?.email || "-",
    telpon_pengelola: row.pengelola?.telpon || "-",
    status_langganan: row.langganan?.status || "-",
    status: row.langganan?.status || "-",
    mulai_langganan: row.langganan?.mulai_langganan || "-",
    akhir_langganan: row.langganan?.akhir_langganan || "-",
    paket: row.paket ? `${row.paket.nama_paket} - ${row.paket.masa_aktif} ${row.paket.satuan}` : "-",
    harga_paket: row.paket?.harga_paket || "-",
    jabatan: row.user?.jabatan || "-",
    user: row.user,
  }));

  const columns = [
    {
      field: "select",
      headerName: "Pilih",
      width: 70,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderHeader: () => {
        const allUserIds = dataGridRows.map((row) => row.id).filter((id) => id !== "-" && id !== undefined && id !== null);
        const allChecked = allUserIds.length > 0 && allUserIds.every((id) => checkedUserIds.includes(id));
        const someChecked = allUserIds.some((id) => checkedUserIds.includes(id));
        const handleHeaderChange = (e) => {
          let newChecked;
          if (e.target.checked) {
            newChecked = [...new Set([...checkedUserIds, ...allUserIds])];
          } else {
            newChecked = checkedUserIds.filter((id) => !allUserIds.includes(id));
          }
          setCheckedUserIds(newChecked);

          console.log("Array ID terpilih:", newChecked);
        };
        return (
          <Checkbox
            checked={allChecked}
            indeterminate={!allChecked && someChecked}
            onChange={handleHeaderChange}
            sx={{ p: 0 }}
            color="primary"
          />
        );
      },
      renderCell: (params) => {
        const userId = params.row.id;
        const checked = checkedUserIds.includes(userId);
        const handleChange = (e) => {
          let newChecked;
          if (e.target.checked) {
            newChecked = [...checkedUserIds, userId];
          } else {
            newChecked = checkedUserIds.filter((id) => id !== userId);
          }
          setCheckedUserIds(newChecked);

          console.log("Array ID terpilih (satu per satu):", newChecked);
        };
        return <Checkbox checked={checked} onChange={handleChange} sx={{ p: 0 }} color="primary" />;
      },
    },
    { field: "no", headerName: "No", width: 70 },
    { field: "nama_lengkap", headerName: "Nama Pengelola", flex: 1, minWidth: 180 },
    { field: "email", headerName: "Email Pengelola", flex: 1, minWidth: 200 },
    { field: "telpon", headerName: "Nomor Telpon", flex: 1, minWidth: 150 },
    { field: "alamat", headerName: "Alamat Pengelola", flex: 1, minWidth: 200 },
    { field: "nama_pengelola", headerName: "Nama PDAM", flex: 1, minWidth: 180 },
    { field: "email_pengelola", headerName: "Email PDAM", flex: 1, minWidth: 200 },
    { field: "telpon_pengelola", headerName: "Nomor Telpon PDAM", flex: 1, minWidth: 150 },
    { field: "status_langganan", headerName: "Status Langganan", flex: 1, minWidth: 150 },

    {
      field: "mulai_langganan",
      headerName: "Tanggal Mulai",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const raw = params.row.mulai_langganan;
        if (!raw || raw === "-") return "-";
        const d = new Date(raw);
        if (isNaN(d)) return raw;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day} / ${month} / ${year}`;
      },
    },
    {
      field: "akhir_langganan",
      headerName: "Tanggal Akhir",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const raw = params.row.akhir_langganan;
        if (!raw || raw === "-") return "-";
        const d = new Date(raw);
        if (isNaN(d)) return raw;
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day} / ${month} / ${year}`;
      },
    },
    { field: "paket", headerName: "Paket Langganan", flex: 1, minWidth: 150 },
    {
      field: "harga_paket",
      headerName: "Harga Paket",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const value = params.row.harga_paket;
        if (value !== undefined && value !== null && value !== "-") {
          return `Rp ${Number(value).toLocaleString("id-ID")}`;
        }
        return "-";
      },
    },
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
      renderCell: (params) => {
        const isAdmin = params.row.jabatan === "Administrator";
        const handleEditClick = (e) => {
          e.stopPropagation();
          if (!isAdmin) {
            navigate(`/pengelola/edit/${params.row.id}`);
          }
        };
        const handleDeleteClick = (e) => {
          e.stopPropagation();
          if (!isAdmin) {
            setRowToDelete(params.row);
            setOpenDeleteDialog(true);
          }
        };
        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, height: "100%" }}>
            <ActionIconButton
              color={theme.palette.primary.main}
              title="Edit"
              disabled={isAdmin}
              sx={{
                width: "30px",
                height: "30px",
                minWidth: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleEditClick}
            >
              <Edit fontSize="small" />
            </ActionIconButton>
            <ActionIconButton
              color={theme.palette.error.main}
              title="Hapus"
              disabled={isAdmin}
              sx={{
                width: "30px",
                height: "30px",
                minWidth: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={handleDeleteClick}
            >
              <Delete fontSize="small" />
            </ActionIconButton>
          </div>
        );
      },
    },
  ];

  // Fungsi hapus user
  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      toast.success("Data pengguna berhasil dihapus");
      // Refresh data setelah hapus
      setLoading(true);
      getAllUsers(page + 1, pageSize, searchTerm, filterStatus, jabatan)
        .then((data) => {
          setRows(data.data || []);
          setTotalRows(Number(data.total) || 0);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } catch (error) {
      toast.error("Gagal menghapus data pengguna");
    }
  };

  // Ambil nama user dari checkedUserIds
  const getCheckedUserNames = () => {
    return dataGridRows.filter((row) => checkedUserIds.includes(row.id)).map((row) => row.nama_lengkap || "-");
  };

  // Fungsi hapus batch
  const handleBatchDelete = async () => {
    const ids = checkedUserIds;
    const names = getCheckedUserNames();
    setDeletingBatch(true);
    setDeleteProgress({ current: 0, total: ids.length, name: names[0] });
    let successCount = 0;
    for (let i = 0; i < ids.length; i++) {
      setDeleteProgress({ current: i + 1, total: ids.length, name: names[i] });
      try {
        await deleteUser(ids[i]);
        successCount++;
      } catch (e) {
        // Bisa tambahkan error log per user jika mau
      }
    }
    // Tambahkan delay 3 detik sebelum menutup modal
    setTimeout(() => {
      setDeletingBatch(false);
      setOpenBatchDeleteDialog(false);
      setCheckedUserIds([]);
      // Refresh data
      setLoading(true);
      getAllUsers(page + 1, pageSize, searchTerm, filterStatus, jabatan)
        .then((data) => {
          setRows(data.data || []);
          setTotalRows(Number(data.total) || 0);
          setLoading(false);
        })
        .catch(() => setLoading(false));
      if (successCount === ids.length) {
        toast.success("Semua data pengguna berhasil dihapus");
      } else if (successCount > 0) {
        toast.warn(`${successCount} dari ${ids.length} pengguna berhasil dihapus`);
      } else {
        toast.error("Tidak ada data pengguna yang berhasil dihapus");
      }
    }, 3000);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
        <Grid size={12}>
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography component="h2" variant="h6">
                  Manajemen Pengelola
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                  <TextField
                    select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(0);
                    }}
                    size="small"
                    sx={{ height: "40px", "& .MuiInputBase-root": { height: "40px" } }}
                  >
                    {[5, 10, 25, 50, 100].map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                  <SearchTableContent
                    label="Cari Nama Pengelola"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(0);
                    }}
                    sx={{ width: 250, height: 40, "& .MuiInputBase-root": { height: 40 } }}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ height: "40px", boxShadow: "none", px: 3, minWidth: 0 }}
                    endIcon={<ArrowDropDownIcon />}
                    onClick={handleMenuClick}
                  >
                    Menu
                  </Button>
                </Box>
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
                  <MenuItem component={Link} to="/pembayaran-langganan" onClick={handleMenuClose}>
                    <Verified style={{ fontSize: 20, marginRight: 8 }} />
                    Verifikasi Pembayaran
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setOpenBatchDeleteDialog(true);
                      handleMenuClose();
                    }}
                  >
                    <Delete style={{ fontSize: 20, marginRight: 8 }} />
                    Hapus Terpilih
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
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 360, minHeight: 300, overflowX: "auto" }}>
                  <DataGrid
                    rows={dataGridRows}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    disableColumnMenu
                    disableSelectionOnClick
                    checkboxSelection={false}
                    pageSize={pageSize}
                    hideFooter={true}
                    hideFooterPagination={true}
                    hideFooterSelectedRowCount={true}
                  />
                </Box>
              </Grid>

              <CustomPaginationTable page={page} pageSize={pageSize} totalRows={totalRows} onPageChange={setPage} />
            </Grid>
          </Box>
        </Grid>

        <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogContent>
            Apakah Anda yakin ingin menghapus data pengguna <b>{rowToDelete?.user?.nama_lengkap}</b>?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
              Batal
            </Button>
            <Button
              onClick={() => {
                handleDeleteUser(rowToDelete?.id);
                setOpenDeleteDialog(false);
              }}
              color="error"
              variant="contained"
            >
              Ya, Hapus
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tambahkan Dialog konfirmasi hapus batch */}
        <Dialog open={openBatchDeleteDialog} onClose={() => setOpenBatchDeleteDialog(false)}>
          <DialogTitle>Konfirmasi Hapus Pengguna</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Apakah Anda yakin ingin menghapus data pengguna berikut?
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {getCheckedUserNames().map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBatchDeleteDialog(false)} color="primary">
              Batal
            </Button>
            <Button onClick={handleBatchDelete} color="error" variant="contained" disabled={deletingBatch || checkedUserIds.length === 0}>
              Hapus
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tambahkan Dialog loading proses hapus batch */}
        <Dialog open={deletingBatch} PaperProps={{ style: { minWidth: 320, textAlign: "center" } }}>
          <DialogTitle>Proses Hapus</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {`Menghapus (${deleteProgress.current} dari ${deleteProgress.total})`}
            </Typography>
            <Typography variant="h6" color="error" sx={{ mb: 2 }}>
              {deleteProgress.name}
            </Typography>
            <Typography variant="body2">Mohon tunggu sampai proses selesai...</Typography>
          </DialogContent>
        </Dialog>
      </Grid>
    </Box>
  );
}
