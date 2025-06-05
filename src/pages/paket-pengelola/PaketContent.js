import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ActionIconButton from "../components/ActionIconButton";
import { DataGrid } from "@mui/x-data-grid";
import Add from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
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
import {
  getAllPaketLangganan,
  getPaketLanggananById,
  createPaketLangganan,
  updatePaketLangganan,
  deletePaketLangganan,
} from "../../utils/paketLangganan";

export default function PaketContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [selected, setSelected] = useState([]); // boleh dibiarkan, tapi tidak dipakai lagi
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formDialogLoading, setFormDialogLoading] = useState(false);
  const [formDialogInitial, setFormDialogInitial] = useState(null);
  const theme = useTheme();

  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // Hitung nomor urut berdasarkan index di dataGridRows
        // Gunakan index dari dataGridRows agar selalu sesuai tampilan
        const index = dataGridRows.findIndex((row) => row.id === params.id);
        return index >= 0 ? index + 1 : "";
      },
    },
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
          id: String(item.id || item.id_paket || idx + 1), // pastikan id selalu string
        }));
        setRows(mapped);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, []);

  const filteredRows = rows.filter((row) => row.nama_paket.toLowerCase().includes(searchTerm.toLowerCase()));

  // Use all filtered rows for DataGrid, let DataGrid handle pagination
  const dataGridRows = filteredRows;

  const handleChangePage = (params) => {
    setPage(params);
  };

  const handleChangeRowsPerPage = (params) => {
    setRowsPerPage(params);
    setPage(0);
  };

  // Edit Paket handler
  const handleEdit = async (row) => {
    setFormDialogLoading(true);
    setFormDialogOpen(true);
    try {
      // Ambil data dari rows berdasarkan id, bukan dari row langsung
      const paket = rows.find((item) => item.id === row.id);
      if (paket) {
        setFormDialogInitial(paket);
      } else {
        // fallback ke API jika tidak ditemukan di rows
        const data = await getPaketLanggananById(row.id);
        setFormDialogInitial(data);
      }
    } catch (err) {
      toast.error("Gagal mengambil data paket.");
      setFormDialogOpen(false);
    } finally {
      setFormDialogLoading(false);
    }
  };

  const handleDelete = (row) => {
    if (!row?.id) {
      toast.error("ID paket tidak ditemukan.");
      return;
    }
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };

  // Fungsi hapus paket (API + update state)
  const handleConfirmDelete = async () => {
    if (!rowToDelete?.id) return;
    try {
      // Ambil id dari rows (pastikan id valid)
      const paket = rows.find((item) => item.id === rowToDelete.id);
      const idToDelete = paket ? paket.id : rowToDelete.id;
      await deletePaketLangganan(idToDelete, {
        headers: { Accept: "application/json", "Content-Type": "application/json" },
      });
      setRows((prev) => prev.filter((item) => item.id !== idToDelete));
      toast.success(`Paket ${rowToDelete?.nama_paket} berhasil dihapus.`);
    } catch (err) {
      toast.error("Gagal menghapus paket.");
    } finally {
      if (document.activeElement) document.activeElement.blur();
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    if (document.activeElement) document.activeElement.blur();
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

  // Tambah Paket handler
  const handleAddPaket = () => {
    setFormDialogInitial(null);
    setFormDialogOpen(true);
    handleMenuClose();
  };

  // Submit handler untuk tambah/edit paket
  const handleSubmitPaket = async (form) => {
    setFormDialogLoading(true);
    try {
      if (formDialogInitial && formDialogInitial.id) {
        // Edit (gunakan id)
        await updatePaketLangganan(formDialogInitial.id, form, {
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          transformRequest: [(data) => JSON.stringify(data)],
        });
        setRows((prev) => prev.map((item) => (item.id === formDialogInitial.id ? { ...item, ...form, id: formDialogInitial.id } : item)));
        toast.success("Paket berhasil diupdate!");
      } else {
        // Tambah (jangan sertakan id di payload, gunakan response.data.data)
        const response = await createPaketLangganan(form, {
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          transformRequest: [(data) => JSON.stringify(data)],
        });
        const newData = response.data || response;
        setRows((prev) => [{ ...newData }, ...prev]);
        toast.success("Paket berhasil ditambahkan!");
      }
      if (document.activeElement) document.activeElement.blur();
      setFormDialogOpen(false);
      setFormDialogInitial(null);
    } catch (err) {
      toast.error("Gagal menyimpan paket.");
    } finally {
      setFormDialogLoading(false);
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
            <MenuItem onClick={handleAddPaket} style={{ display: "flex", alignItems: "center" }}>
              <Add style={{ fontSize: 20, marginRight: 8 }} />
              Tambah Paket
            </MenuItem>
            {/* Hapus MenuItem Hapus Pilihan */}
          </Menu>
        </Box>
      </Box>
      <DataGrid
        rows={dataGridRows}
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
        // Hapus checkboxSelection, selectionModel, dan onSelectionModelChange
        getRowId={(row) => row.id}
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
            {/* Hapus logika konfirmasi hapus banyak, hanya tampilkan konfirmasi hapus satuan */}
            Apakah Anda yakin ingin menghapus paket <b>{rowToDelete?.nama_paket}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Batal
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
            // Selalu enable karena hanya hapus satuan
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
      <PaketFormDialog
        key={formDialogInitial?.id || "new"}
        open={formDialogOpen}
        onClose={() => {
          if (document.activeElement) document.activeElement.blur();
          setFormDialogOpen(false);
          setFormDialogInitial(null);
        }}
        onSubmit={handleSubmitPaket}
        initialData={formDialogInitial}
        loading={formDialogLoading}
      />
    </Box>
  );
}

// Tambah/Edit Dialog Formulir langsung di file ini
function PaketFormDialog({ open, onClose, onSubmit, initialData, loading }) {
  const [form, setForm] = React.useState({
    nama_paket: "",
    harga_paket: "",
    masa_aktif: 1,
    satuan: "hari",
    deskripsi: "",
  });

  React.useEffect(() => {
    // Jika initialData ada dan dialog open, isi form dengan data paket yang akan diedit
    if (open && initialData && initialData.id) {
      setForm({
        nama_paket: initialData.nama_paket ?? "",
        harga_paket: initialData.harga_paket ?? "",
        masa_aktif: initialData.masa_aktif ?? 1,
        satuan: initialData.satuan ?? "hari",
        deskripsi: initialData.deskripsi ?? "",
      });
    } else if (open && !initialData) {
      // Jika tambah, reset form
      setForm({
        nama_paket: "",
        harga_paket: "",
        masa_aktif: 1,
        satuan: "hari",
        deskripsi: "",
      });
    }
  }, [open, initialData]);

  // Handler penutupan dialog yang konsisten
  const handleDialogClose = () => {
    if (document.activeElement) document.activeElement.blur();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth aria-labelledby="paket-form-dialog-title">
      <DialogTitle id="paket-form-dialog-title">{initialData ? "Edit Paket" : "Tambah Paket"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            id="nama-paket"
            name="nama_paket"
            label="Nama Paket"
            variant="outlined"
            fullWidth
            value={form.nama_paket}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            disabled={loading}
          />
          <TextField
            id="harga-paket"
            name="harga_paket"
            label="Harga Paket"
            variant="outlined"
            fullWidth
            type="number"
            value={form.harga_paket}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            sx={{ mb: 2 }}
            required
            disabled={loading}
          />
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              id="masa-aktif"
              name="masa_aktif"
              value={form.masa_aktif}
              onChange={handleChange}
              required
              type="number"
              inputProps={{ min: 1 }}
              fullWidth
              variant="outlined"
              label="Masa Aktif"
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            />
            <TextField
              id="satuan"
              name="satuan"
              value={form.satuan}
              onChange={handleChange}
              select
              fullWidth
              variant="outlined"
              label="Satuan"
              InputLabelProps={{ shrink: true }}
              disabled={loading}
            >
              <MenuItem value="hari">Hari</MenuItem>
              <MenuItem value="bulan">Bulan</MenuItem>
            </TextField>
          </Box>
          <TextField
            id="deskripsi"
            name="deskripsi"
            value={form.deskripsi ?? ""}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            label="Deskripsi"
            rows={4}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
          <DialogActions sx={{ px: 0, mt: 2 }}>
            <Button onClick={handleDialogClose} color="primary" disabled={loading} type="button">
              Batal
            </Button>
            <Button color="primary" variant="contained" disabled={loading} type="submit">
              Simpan
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
