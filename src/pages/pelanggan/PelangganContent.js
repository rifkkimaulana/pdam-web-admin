import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Box, Typography, IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { SaveAlt, Add } from "@mui/icons-material";
import { utils, writeFile } from "xlsx";
import Copyright from "../components/internals/components/Copyright";
import FormPelanggan from "./FormPelanggan";
import { getPelangganList, deletePelanggan } from "./pelangganApi";
import ActionIconButton from "../components/ActionIconButton";
import { Edit, Delete } from "@mui/icons-material";

function renderStatus(status) {
  const colors = {
    enable: "success",
    disable: "default",
  };
  return <span style={{ color: status === "enable" ? "green" : "gray" }}>{status === "enable" ? "Aktif" : "Nonaktif"}</span>;
}

export default function PelangganContent() {
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await getPelangganList();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditId(null);
    setOpenForm(true);
  };
  const handleEdit = (id) => {
    setEditId(id);
    setOpenForm(true);
  };
  const handleDelete = async () => {
    await deletePelanggan(deleteId);
    setDeleteId(null);
    fetchData();
  };

  const handleExport = () => {
    const exportRows = rows.map(({ renderActions, ...rest }) => rest);
    const ws = utils.json_to_sheet(exportRows);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Pelanggan");
    writeFile(wb, "Daftar_Pelanggan.xlsx");
  };

  const filteredRows = rows.filter(
    (row) =>
      row.no_meter?.toLowerCase().includes(searchTerm.toLowerCase()) || row.alamat_meter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "user_id", headerName: "ID User", width: 120 },
    { field: "pengelola_id", headerName: "ID Pengelola", width: 120 },
    { field: "no_meter", headerName: "No Meter", width: 120 },
    { field: "alamat_meter", headerName: "Alamat Meter", flex: 1, minWidth: 180 },
    { field: "status", headerName: "Status", width: 100, renderCell: (params) => renderStatus(params.value) },
    {
      field: "actions",
      headerName: "Aksi",
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, height: "100%" }}>
          <ActionIconButton
            color="#1976d2"
            title="Edit"
            onClick={() => handleEdit(params.row.id)}
            sx={{ width: "30px", height: "30px", minWidth: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Edit fontSize="small" />
          </ActionIconButton>
          <ActionIconButton
            color="#d32f2f"
            title="Hapus"
            onClick={() => setDeleteId(params.row.id)}
            sx={{ width: "30px", height: "30px", minWidth: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Delete fontSize="small" />
          </ActionIconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Daftar Pelanggan Pengelola
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="success" startIcon={<SaveAlt />} onClick={handleExport} sx={{ height: "40px" }}>
            Export
          </Button>
          <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAdd} sx={{ height: "40px" }}>
            Tambah
          </Button>
          <TextField
            label="Cari Pelanggan"
            variant="outlined"
            size="small"
            sx={{ width: "300px", height: "40px" }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        autoHeight
      />
      <FormPelanggan open={openForm} onClose={() => setOpenForm(false)} onSuccess={fetchData} pelangganId={editId} />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>Yakin ingin menghapus pelanggan ini?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Batal</Button>
          <Button color="error" onClick={handleDelete}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
