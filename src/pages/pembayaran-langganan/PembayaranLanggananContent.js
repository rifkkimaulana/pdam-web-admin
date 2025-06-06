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
import { toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import SearchTableContent from "../components/content-components/SearchTableContent";
import CustomPaginationTable from "../components/content-components/CustomPaginationTable";

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

  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setLoading(true);
    // Here you would fetch the data, assuming you have a fetch function for the payments.
    fetchPayments(page + 1, pageSize, searchTerm, filterStatus)
      .then((data) => {
        setRows(data.data || []);
        setTotalRows(Number(data.total) || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, pageSize, searchTerm, filterStatus]);

  const fetchPayments = (page, pageSize, searchTerm, filterStatus) => {
    // Replace this with actual API request to fetch payments
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [
            // Example payment data
            {
              id: 1,
              pelanggan: "Rifki Pratama",
              jumlah_bayar: 150000,
              metode: "Transfer",
              status: "Menunggu",
              tanggal_bayar: "2025-06-01",
              bukti_bayar: "bukti_1.jpg",
            },
            {
              id: 2,
              pelanggan: "Andi Saputra",
              jumlah_bayar: 100000,
              metode: "Cash",
              status: "Menunggu",
              tanggal_bayar: "2025-06-02",
              bukti_bayar: "bukti_2.jpg",
            },
          ],
          total: 2,
        });
      }, 1000);
    });
  };

  const dataGridRows = rows.map((row, idx) => ({
    id: row.id,
    no: page * pageSize + idx + 1,
    pelanggan: row.pelanggan || "-",
    jumlah_bayar: row.jumlah_bayar || "-",
    metode: row.metode || "-",
    tanggal_bayar: row.tanggal_bayar || "-",
    status: row.status || "-",
    bukti_bayar: row.bukti_bayar || "-",
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
    { field: "pelanggan", headerName: "Nama Pelanggan", flex: 1, minWidth: 140 },
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
        const handleVerifikasiClick = (e) => {
          e.stopPropagation();
          // Implement verification functionality here
          toast.success(`Pembayaran untuk ${params.row.pelanggan} berhasil diverifikasi!`);
        };

        const handleTolakClick = (e) => {
          e.stopPropagation();
          // Implement rejection functionality here
          toast.error(`Pembayaran untuk ${params.row.pelanggan} ditolak.`);
        };

        return (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: "100%" }}>
            <IconButton
              color="success"
              size="small"
              title="Verifikasi"
              onClick={handleVerifikasiClick}
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "36px" }}
            >
              <Verified fontSize="small" />
            </IconButton>
            <IconButton
              color="error"
              size="small"
              title="Hapus"
              onClick={handleTolakClick}
              sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "36px" }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </div>
        );
      },
    },
  ];

  const handleMenuClick = (event) => setAnchorElMenu(event.currentTarget);
  const handleMenuClose = () => setAnchorElMenu(null);
  const handleFilterClick = (event) => setAnchorElFilter(event.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);
  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setAnchorElFilter(null);
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
                  <MenuItem onClick={handleFilterClick}>
                    <FilterList style={{ fontSize: 20, marginRight: 8 }} />
                    Filter Status Pembayaran
                  </MenuItem>
                </Menu>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
                  <DataGrid
                    rows={dataGridRows}
                    columns={columns}
                    loading={loading}
                    autoHeight
                    disableColumnMenu
                    pageSize={pageSize}
                    hideFooter={true}
                    sx={{ minWidth: 1100 }}
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
                  <CustomPaginationTable page={page} pageSize={pageSize} totalRows={totalRows} onPageChange={setPage} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Dialog open={openBuktiDialog} onClose={() => setOpenBuktiDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lihat Bukti Pembayaran</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {buktiImage && <img src={buktiImage} alt="Bukti Pembayaran" style={{ maxWidth: "100%", maxHeight: 400 }} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
