import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem, Box, TextField, Typography, Dialog, DialogTitle, DialogContent, Button, Grid } from "@mui/material";
import { Verified, FilterList } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { DataGrid } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import { Delete, Add } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import SearchTableContent from "../components/content-components/SearchTableContent";
import CustomPaginationTable from "../components/content-components/CustomPaginationTable";
import { fetchPembayaranLangganan, fetchPengelola } from "../../utils/pembayaran";
import dayjs from "dayjs";

export default function Pembayaran() {
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
  const [openBuktiDialog, setOpenBuktiDialog] = useState(false);
  const [buktiImage, setBuktiImage] = useState("");
  const [openKonfirmasiDialog, setOpenKonfirmasiDialog] = useState(false);
  const [selectedPembayaran, setSelectedPembayaran] = useState(null);
  const [openTambahDialog, setOpenTambahDialog] = useState(false);
  const [formTambah, setFormTambah] = useState({
    langganan_id: "",
    tanggal_bayar: "",
    jumlah_bayar: "",
    metode: "Cash",
    bukti_bayar: null,
    bukti_bayar_url: "",
  });
  const [listLangganan, setListLangganan] = useState([]);
  const fileInputRef = useRef();

  console.log("selected user ids:", checkedUserIds);

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    fetchPembayaranLangganan(page + 1, pageSize, filterStatus, searchTerm)
      .then((data) => {
        setRows(data.data); // gunakan data.data dari response Laravel
        setTotalRows(data.total); // gunakan data.total
        // Sinkronkan page jika backend mengembalikan current_page
        if (typeof data.current_page === "number") {
          setPage(data.current_page - 1); // frontend 0-based
        }
        // Sinkronkan pageSize jika backend mengembalikan per_page
        if (data.per_page && Number(data.per_page) !== pageSize) {
          setPageSize(Number(data.per_page));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, pageSize, filterStatus, searchTerm]);

  const dataGridRows = rows.map((row, idx) => ({
    id: row.id,
    no: page * pageSize + idx + 1,
    pelanggan: row.langganan?.user?.nama_lengkap || "-",
    perusahaan: row.langganan?.pengelola?.nama_pengelola || "-",
    jumlah_bayar: row.jumlah_bayar ?? "-",
    metode: row.metode ?? "-",
    tanggal_bayar: row.tanggal_bayar ?? "-",
    status: row.status ?? "-",
    bukti_bayar: row.bukti_bayar ?? "-",
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
        };
        return <Checkbox checked={checked} onChange={handleChange} sx={{ p: 0 }} color="primary" />;
      },
    },
    { field: "no", headerName: "No", width: 50 },
    {
      field: "pelanggan",
      headerName: "Nama Pelanggan",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "perusahaan",
      headerName: "Nama Perusahaan",
      flex: 1,
      minWidth: 160,
    },
    { field: "jumlah_bayar", headerName: "Jumlah Pembayaran", flex: 1, minWidth: 120 },
    { field: "metode", headerName: "Metode Pembayaran", flex: 1, minWidth: 110 },
    { field: "tanggal_bayar", headerName: "Tanggal Pembayaran", flex: 1, minWidth: 120 },
    { field: "status", headerName: "Status Pembayaran", flex: 1, minWidth: 110 },
    {
      field: "bukti_bayar",
      headerName: "Bukti Pembayaran",
      flex: 1,
      minWidth: 110,
      renderCell: (params) => {
        return params.row.bukti_bayar && params.row.bukti_bayar !== "-" ? (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            startIcon={<VisibilityIcon fontSize="small" />}
            onClick={() => {
              setBuktiImage(`/uploads/${params.row.bukti_bayar}`);
              setOpenBuktiDialog(true);
            }}
            sx={{ textTransform: "none" }}
          >
            Lihat
          </Button>
        ) : (
          "-"
        );
      },
    },
  ];

  // Handler konfirmasi, tolak, dan hapus pembayaran
  const handleKonfirmasiPembayaran = () => {
    if (checkedUserIds.length === 0) {
      toast.warn("Pilih minimal satu pembayaran untuk konfirmasi.");
      return;
    }
    // Ambil data pembayaran pertama yang dipilih
    const pembayaran = rows.find((row) => row.id === checkedUserIds[0]);
    setSelectedPembayaran(pembayaran);
    setOpenKonfirmasiDialog(true);
  };

  const handleDialogKonfirmasi = () => {
    toast.success(`Pembayaran untuk ${selectedPembayaran?.langganan?.user?.nama_lengkap || "-"} berhasil dikonfirmasi!`);
    setOpenKonfirmasiDialog(false);
    setCheckedUserIds([]);
  };

  const handleDialogTolak = () => {
    toast.error(`Pembayaran untuk ${selectedPembayaran?.langganan?.user?.nama_lengkap || "-"} ditolak.`);
    setOpenKonfirmasiDialog(false);
    setCheckedUserIds([]);
  };

  const handleDialogBatal = () => {
    setOpenKonfirmasiDialog(false);
  };

  const handleMenuClick = (event) => setAnchorElMenu(event.currentTarget);
  const handleMenuClose = () => setAnchorElMenu(null);
  const handleFilterClick = (event) => setAnchorElFilter(event.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setPage(0);
    setAnchorElFilter(null);
  };

  // Update handler paginasi agar page 1-based ke backend
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleHapusPembayaran = () => {
    if (checkedUserIds.length === 0) {
      toast.warn("Pilih minimal satu pembayaran untuk dihapus.");
      return;
    }
    toast.info(`Berhasil menghapus ${checkedUserIds.length} pembayaran.`);
    setCheckedUserIds([]);
  };

  const handleTambahPembayaran = () => {
    setOpenTambahDialog(true);
  };
  const handleCloseTambahDialog = () => {
    setOpenTambahDialog(false);
  };

  // Ambil data pengelola dan langganan untuk dialog tambah pembayaran
  useEffect(() => {
    if (openTambahDialog) {
      fetchPengelola().then((data) => {
        const langgananList = [];
        data.forEach((pengelola) => {
          if (Array.isArray(pengelola.langganan)) {
            pengelola.langganan.forEach((langganan) => {
              langgananList.push({
                ...langganan,
                pengelola: pengelola,
                user: pengelola.user,
              });
            });
          }
        });
        setListLangganan(langgananList);
      });
    }
  }, [openTambahDialog]);

  const handleFormTambahChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bukti_bayar") {
      const file = files[0];
      setFormTambah((prev) => ({
        ...prev,
        bukti_bayar: file,
        bukti_bayar_url: file ? URL.createObjectURL(file) : "",
      }));
    } else {
      setFormTambah((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLihatBuktiBaru = () => {
    if (formTambah.bukti_bayar_url) {
      setBuktiImage(formTambah.bukti_bayar_url);
      setOpenBuktiDialog(true);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Riwayat Pembayaran</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
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
                    label="Cari Nama Pelanggan"
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
                  <MenuItem onClick={handleTambahPembayaran}>
                    <Add style={{ fontSize: 20, marginRight: 8 }} />
                    Tambah Pembayaran
                  </MenuItem>
                  <MenuItem onClick={handleFilterClick}>
                    <FilterList style={{ fontSize: 20, marginRight: 8 }} />
                    Filter Status Pembayaran
                  </MenuItem>
                  <MenuItem onClick={handleKonfirmasiPembayaran}>
                    <Verified style={{ fontSize: 20, marginRight: 8 }} />
                    Konfirmasi Pembayaran
                  </MenuItem>
                  <MenuItem onClick={handleHapusPembayaran}>
                    <Delete style={{ fontSize: 20, marginRight: 8 }} />
                    Hapus Pembayaran
                  </MenuItem>
                </Menu>
                <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
                  <MenuItem onClick={() => handleFilterStatus("")}>Semua</MenuItem>
                  <MenuItem onClick={() => handleFilterStatus("Diterima")}>Diterima</MenuItem>
                  <MenuItem onClick={() => handleFilterStatus("Ditolak")}>Ditolak</MenuItem>
                  <MenuItem onClick={() => handleFilterStatus("Menunggu")}>Menunggu</MenuItem>
                </Menu>
              </Grid>
            </Grid>

            <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
              <DataGrid
                rows={dataGridRows}
                columns={columns}
                loading={loading}
                autoHeight
                disableColumnMenu
                pageSize={pageSize}
                hideFooter={true}
              />
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                mb: 1,
                mt: 2,
              }}
            >
              <CustomPaginationTable page={page} pageSize={pageSize} totalRows={totalRows} onPageChange={handlePageChange} />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openBuktiDialog} onClose={() => setOpenBuktiDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lihat Bukti Pembayaran</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {buktiImage && <img src={buktiImage} alt="Bukti Pembayaran" style={{ maxWidth: "100%", maxHeight: 400 }} />}
        </DialogContent>
      </Dialog>

      <Dialog open={openKonfirmasiDialog} onClose={handleDialogBatal} maxWidth="sm" fullWidth>
        <DialogTitle>Konfirmasi Pembayaran</DialogTitle>
        <DialogContent>
          {selectedPembayaran ? (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Nama Pelanggan: {selectedPembayaran.langganan?.user?.nama_lengkap || "-"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Nama Perusahaan: {selectedPembayaran.langganan?.pengelola?.nama_pengelola || "-"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Jumlah Pembayaran: {selectedPembayaran.jumlah_bayar ?? "-"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Metode Pembayaran: {selectedPembayaran.metode ?? "-"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Tanggal Pembayaran: {selectedPembayaran.tanggal_bayar ?? "-"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Status: {selectedPembayaran.status ?? "-"}
              </Typography>
              {selectedPembayaran.bukti_bayar && selectedPembayaran.bukti_bayar !== "-" && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src={`/uploads/${selectedPembayaran.bukti_bayar}`}
                    alt="Bukti Pembayaran"
                    style={{ maxWidth: 300, maxHeight: 300 }}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <Typography>Tidak ada data pembayaran terpilih.</Typography>
          )}
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
          <Button onClick={handleDialogBatal} color="inherit" variant="outlined">
            Batal
          </Button>
          <Button onClick={handleDialogTolak} color="error" variant="contained">
            Tolak
          </Button>
          <Button onClick={handleDialogKonfirmasi} color="success" variant="contained">
            Konfirmasi
          </Button>
        </Box>
      </Dialog>

      <Dialog open={openTambahDialog} onClose={handleCloseTambahDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Tambah Pembayaran</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              select
              label="Nama Pelanggan"
              name="langganan_id"
              value={formTambah.langganan_id}
              onChange={handleFormTambahChange}
              fullWidth
              required
            >
              {listLangganan.map((l) => (
                <MenuItem key={l.id} value={l.id}>
                  {l.user?.nama_lengkap || "-"} - {l.pengelola?.nama_pengelola || "-"}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Tanggal Bayar"
              name="tanggal_bayar"
              type="date"
              value={formTambah.tanggal_bayar}
              onChange={handleFormTambahChange}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Jumlah Bayar"
              name="jumlah_bayar"
              type="number"
              value={formTambah.jumlah_bayar}
              onChange={handleFormTambahChange}
              required
            />
            <TextField select label="Metode Pembayaran" name="metode" value={formTambah.metode} onChange={handleFormTambahChange} required>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Transfer">Transfer</MenuItem>
            </TextField>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button variant="outlined" component="label">
                Upload Bukti Pembayaran
                <input
                  ref={fileInputRef}
                  type="file"
                  name="bukti_bayar"
                  accept="image/*,application/pdf"
                  hidden
                  onChange={handleFormTambahChange}
                />
              </Button>
              {formTambah.bukti_bayar && (
                <Button variant="text" color="primary" onClick={handleLihatBuktiBaru}>
                  Lihat
                </Button>
              )}
              <Typography variant="body2">{formTambah.bukti_bayar ? formTambah.bukti_bayar.name : "Belum ada file"}</Typography>
            </Box>
          </Box>
        </DialogContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, p: 2 }}>
          <Button onClick={handleCloseTambahDialog} color="inherit" variant="outlined">
            Batal
          </Button>
          <Button onClick={handleCloseTambahDialog} color="success" variant="contained">
            Simpan
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
