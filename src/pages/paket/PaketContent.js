import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { getAllPaket } from "./paketApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ActionIconButton from "../components/ActionIconButton";
import TableDropdown from "../components/TableDropdown";
import ReusableDataGrid from "../components/ReusableDataGrid";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";

export default function PaketContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState([]);
  const theme = useTheme();
  const open = Boolean(anchorEl);

  // Kolom untuk DataGrid
  const columns = [
    { field: "no", headerName: "No", width: 70, align: "center", headerAlign: "center" },
    { field: "nama_paket", headerName: "Nama Paket", flex: 1, minWidth: 180 },
    {
      field: "biaya_admin",
      headerName: "Biaya Admin",
      flex: 1,
      minWidth: 120,
      align: "right",
      headerAlign: "right",
      valueFormatter: ({ value }) => `Rp ${Number(value).toLocaleString()}`,
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

  // Data untuk DataGrid
  const filteredRows = rows.filter((row) => row.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()));
  // DataGrid butuh id unik, gunakan no
  const dataGridRows = filteredRows.map((row) => ({ ...row, id: row.no }));

  useEffect(() => {
    setLoading(true);
    getAllPaket()
      .then((res) => {
        // Tambahkan nomor urut (no) ke setiap baris
        const mapped = (res.data || []).map((item, idx) => ({
          ...item,
          no: idx + 1,
          biaya_admin: item.biaya_admin ?? 0,
        }));
        setRows(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handler untuk menu dropdown
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleTambahPaket = () => {
    handleMenuClose();
    // TODO: aksi tambah paket
    alert("Tambah Paket");
  };
  const handleHapusPaket = () => {
    handleMenuClose();
    // TODO: aksi hapus paket terpilih
    alert("Hapus Paket yang di-select");
  };

  // Handler untuk edit dan hapus
  const handleEdit = (row) => {
    // TODO: implementasi aksi edit
    alert(`Edit data: ${row.nama_paket}`);
  };

  const handleDelete = (row) => {
    // TODO: implementasi aksi hapus
    if (window.confirm(`Yakin hapus data: ${row.nama_paket}?`)) {
      // aksi hapus di sini
    }
  };

  // Handler untuk centang baris
  const handleSelectRow = (no) => {
    setSelected((prev) => (prev.includes(no) ? prev.filter((item) => item !== no) : [...prev, no]));
  };
  // Handler untuk centang semua
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(dataGridRows.map((row) => row.no));
    } else {
      setSelected([]);
    }
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
              },
            }}
            placeholder="Cari nama paket..."
          />
          <TableDropdown
            label="Menu"
            menuItems={[
              {
                label: "Tambah Paket",
                icon: <AddIcon fontSize="small" style={{ marginRight: 8 }} />,
                onClick: handleTambahPaket,
              },
              {
                label: "Hapus Paket",
                icon: <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />,
                onClick: handleHapusPaket,
              },
            ]}
          />
        </Box>
      </Box>
      <ReusableDataGrid
        checkboxSelection
        rows={dataGridRows}
        columns={columns}
        searchTerm={searchTerm}
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        disableColumnResize
        loading={loading}
      />
    </Box>
  );
}
