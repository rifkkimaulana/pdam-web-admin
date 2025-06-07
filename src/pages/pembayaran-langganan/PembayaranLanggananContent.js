import React, { useState, useEffect, useRef } from "react";
import {
  Divider,
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
  Grid,
  Chip,
} from "@mui/material";
import { Verified, FilterList } from "@mui/icons-material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
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
import {
  fetchPembayaranLangganan,
  fetchPengelola,
  createPembayaranLangganan,
  fetchPrivateFile,
  deletePembayaranLangganan,
  updatePembayaranLangganan,
} from "../../utils/pembayaran";
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
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false);
  const [loadingDialogTitle, setLoadingDialogTitle] = useState("");
  const [loadingDialogMessage, setLoadingDialogMessage] = useState("");
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
    pelanggan: row.langganan?.pengelola?.user?.nama_lengkap || "-",
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
    {
      field: "jumlah_bayar",
      headerName: "Jumlah Pembayaran",
      flex: 1,
      minWidth: 120,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const value = params.row.jumlah_bayar;
        if (value !== undefined && value !== null && value !== "-") {
          return `Rp ${Number(value).toLocaleString("id-ID")}`;
        }
        return "-";
      },
    },
    { field: "metode", headerName: "Metode Pembayaran", flex: 1, minWidth: 110 },
    { field: "tanggal_bayar", headerName: "Tanggal Pembayaran", flex: 1, minWidth: 120 },
    {
      field: "status",
      headerName: "Status Pembayaran",
      flex: 1,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.row.status;
        let color = "default";
        let label = status;
        if (status === "Diterima") {
          color = "success";
        } else if (status === "Ditolak") {
          color = "error";
        } else if (status === "Menunggu") {
          color = "warning";
        }
        return status && status !== "-" ? <Chip label={label} color={color} size="small" variant="outlined" /> : "-";
      },
    },
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
            onClick={async () => {
              // Ambil nama file dari database (misal: "bukti_bayar/namafile.jpg")
              const [folder, ...rest] = params.row.bukti_bayar.split("/");
              const filename = rest.join("/");
              try {
                const blob = await fetchPrivateFile(folder, filename);
                const url = URL.createObjectURL(blob);
                setBuktiImage(url);
                setOpenBuktiDialog(true);
              } catch (err) {
                toast.error("Gagal mengambil bukti bayar");
              }
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
    if (checkedUserIds.length > 1) {
      toast.error("Hanya bisa konfirmasi satu pembayaran dalam satu waktu.");
      return;
    }
    // Ambil data pembayaran pertama yang dipilih
    const pembayaran = rows.find((row) => row.id === checkedUserIds[0]);
    if (pembayaran.status === "Diterima") {
      toast.info("Pembayaran ini sudah diterima dan tidak bisa dikonfirmasi ulang.");
      return;
    } else if (pembayaran.status === "Ditolak") {
      toast.info("Pembayaran ini sudah ditolak dan silahkan buat pembayaran baru.");
      return;
    }
    setSelectedPembayaran(pembayaran);
    setOpenKonfirmasiDialog(true);
  };

  const handleDialogKonfirmasi = async () => {
    if (!selectedPembayaran) return;
    setLoadingDialogTitle("Proses Konfirmasi");
    setLoadingDialogMessage("Memproses konfirmasi pembayaran...");
    setOpenLoadingDialog(true);
    try {
      const formData = new FormData();
      formData.append("status", "Diterima");
      await updatePembayaranLangganan(selectedPembayaran.id, formData);
      toast.success(`Pembayaran untuk ${selectedPembayaran.langganan?.user?.nama_lengkap || "-"} berhasil dikonfirmasi!`);
      setOpenKonfirmasiDialog(false);
      setCheckedUserIds([]);
      setLoading(true);
      fetchPembayaranLangganan(1, pageSize, filterStatus, searchTerm)
        .then((data) => {
          setRows(data.data);
          setTotalRows(data.total);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } catch (err) {
      toast.error("Gagal mengkonfirmasi pembayaran!");
    } finally {
      setTimeout(() => setOpenLoadingDialog(false), 2000);
    }
  };

  const handleDialogTolak = async () => {
    if (!selectedPembayaran) return;
    setLoadingDialogTitle("Proses Penolakan");
    setLoadingDialogMessage("Memproses penolakan pembayaran...");
    setOpenLoadingDialog(true);
    try {
      const formData = new FormData();
      formData.append("status", "Ditolak");
      await updatePembayaranLangganan(selectedPembayaran.id, formData);
      toast.error(`Pembayaran untuk ${selectedPembayaran.langganan?.user?.nama_lengkap || "-"} ditolak.`);
      setOpenKonfirmasiDialog(false);
      setCheckedUserIds([]);
      setLoading(true);
      fetchPembayaranLangganan(1, pageSize, filterStatus, searchTerm)
        .then((data) => {
          setRows(data.data);
          setTotalRows(data.total);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } catch (err) {
      toast.error("Gagal menolak pembayaran!");
    } finally {
      setTimeout(() => setOpenLoadingDialog(false), 2000);
    }
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

  const handleHapusPembayaran = async () => {
    if (checkedUserIds.length === 0) {
      toast.warn("Pilih minimal satu pembayaran untuk dihapus.");
      return;
    }
    setLoadingDialogTitle("Proses Penghapusan");
    setLoadingDialogMessage("Menghapus pembayaran terpilih...");
    setOpenLoadingDialog(true);
    let successCount = 0;
    let errorCount = 0;
    for (const id of checkedUserIds) {
      try {
        await deletePembayaranLangganan(id);
        successCount++;
      } catch (err) {
        errorCount++;
      }
    }
    setCheckedUserIds([]);
    setLoading(true);
    fetchPembayaranLangganan(1, pageSize, filterStatus, searchTerm)
      .then((data) => {
        setRows(data.data);
        setTotalRows(data.total);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    setTimeout(() => {
      setOpenLoadingDialog(false);
      if (successCount > 0) toast.success(`${successCount} pembayaran berhasil dihapus.`);
      if (errorCount > 0) toast.error(`${errorCount} pembayaran gagal dihapus.`);
    }, 3000);
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

  useEffect(() => {
    if (formTambah.langganan_id && listLangganan.length > 0) {
      const selected = listLangganan.find((l) => String(l.id) === String(formTambah.langganan_id));
      if (selected && selected.paket && selected.paket.harga_paket) {
        setFormTambah((prev) => ({ ...prev, jumlah_bayar: selected.paket.harga_paket }));
      }
    }
    // Jika langganan_id kosong, reset jumlah_bayar
    if (!formTambah.langganan_id) {
      setFormTambah((prev) => ({ ...prev, jumlah_bayar: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formTambah.langganan_id, listLangganan]);

  // Ambil gambar bukti bayar dari API saat dialog konfirmasi dibuka dan pembayaran dipilih
  useEffect(() => {
    async function fetchBukti() {
      if (openKonfirmasiDialog && selectedPembayaran && selectedPembayaran.bukti_bayar && selectedPembayaran.bukti_bayar !== "-") {
        const [folder, ...rest] = selectedPembayaran.bukti_bayar.split("/");
        const filename = rest.join("/");
        try {
          const blob = await fetchPrivateFile(folder, filename);
          const url = URL.createObjectURL(blob);
          setBuktiImage(url);
        } catch (err) {
          setBuktiImage("");
        }
      } else {
        setBuktiImage("");
      }
    }
    fetchBukti();
    // Cleanup url object
    return () => {
      if (buktiImage) URL.revokeObjectURL(buktiImage);
    };
  }, [openKonfirmasiDialog, selectedPembayaran]);

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Grid container spacing={2} columns={12} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Box sx={{ mt: 2, p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Data Pembayaran Langganan</Typography>
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
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>Lihat Bukti Pembayaran</span>
            <IconButton
              aria-label="close"
              onClick={() => setOpenBuktiDialog(false)}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
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
                Nama Pelanggan: {selectedPembayaran.langganan?.pengelola?.user?.nama_lengkap || "-"}
              </Typography>
              <Divider color="white" />
              <Typography variant="subtitle1" gutterBottom>
                Nama Perusahaan: {selectedPembayaran.langganan?.pengelola?.nama_pengelola || "-"}
              </Typography>
              <Divider color="white" />
              <Typography variant="subtitle1" gutterBottom>
                Jumlah Pembayaran: {selectedPembayaran.jumlah_bayar ?? "-"}
              </Typography>
              <Divider color="white" />
              <Typography variant="subtitle1" gutterBottom>
                Metode Pembayaran: {selectedPembayaran.metode ?? "-"}
              </Typography>
              <Divider color="white" />
              <Typography variant="subtitle1" gutterBottom>
                Tanggal Pembayaran: {selectedPembayaran.tanggal_bayar ?? "-"}
              </Typography>
              <Divider color="white" />
              <Typography variant="subtitle1" gutterBottom>
                Status: {selectedPembayaran.status ?? "-"}
              </Typography>
              <Divider color="white" />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Lampiran: Bukti Pembayaran
              </Typography>
              {selectedPembayaran.bukti_bayar && selectedPembayaran.bukti_bayar !== "-" && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  {buktiImage ? (
                    <img src={buktiImage} alt="Bukti Pembayaran" style={{ maxWidth: "100%", maxHeight: "100%" }} />
                  ) : (
                    <Typography variant="body2">Memuat gambar...</Typography>
                  )}
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
              InputProps={{ readOnly: true }}
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
          <Button
            onClick={async () => {
              // Validasi sederhana
              if (!formTambah.langganan_id || !formTambah.tanggal_bayar || !formTambah.jumlah_bayar || !formTambah.metode) {
                toast.error("Semua field wajib diisi!");
                return;
              }
              const formData = new FormData();
              formData.append("langganan_id", formTambah.langganan_id);
              formData.append("tanggal_bayar", formTambah.tanggal_bayar);
              formData.append("jumlah_bayar", formTambah.jumlah_bayar);
              formData.append("metode", formTambah.metode);
              formData.append("status", "Menunggu");
              if (formTambah.bukti_bayar) {
                formData.append("bukti_bayar", formTambah.bukti_bayar);
              }
              try {
                // Gunakan API util yang sudah disediakan
                await createPembayaranLangganan(formData);
                toast.success("Pembayaran berhasil ditambahkan!");
                setOpenTambahDialog(false);
                setFormTambah({
                  langganan_id: "",
                  tanggal_bayar: "",
                  jumlah_bayar: "",
                  metode: "Cash",
                  bukti_bayar: null,
                  bukti_bayar_url: "",
                });
                setPage(0); // refresh ke halaman pertama
                setLoading(true);
                fetchPembayaranLangganan(1, pageSize, filterStatus, searchTerm)
                  .then((data) => {
                    setRows(data.data);
                    setTotalRows(data.total);
                    setLoading(false);
                  })
                  .catch(() => setLoading(false));
              } catch (err) {
                toast.error(err.response?.data?.message || err.message || "Gagal menambah pembayaran");
              }
            }}
            color="success"
            variant="contained"
          >
            Simpan
          </Button>
        </Box>
      </Dialog>
      <Dialog open={openLoadingDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{loadingDialogTitle}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 120 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {loadingDialogMessage}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span
              className="loader"
              style={{
                width: 40,
                height: 40,
                border: "4px solid #ccc",
                borderTop: "4px solid #1976d2",
                borderRadius: "50%",
                display: "inline-block",
                animation: "spin 1s linear infinite",
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
