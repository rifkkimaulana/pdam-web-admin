import { useState } from "react";
import { IconButton, Button, TextField, Box, Typography, Divider } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { SaveAlt, Edit, Delete } from "@mui/icons-material";

const handleEdit = (user) => {
  console.log("Mengedit pengguna:", user);
};

const handleDelete = (selectedUsers) => {
  console.log("Menghapus pengguna:", selectedUsers);
};

const columns = [
  {
    field: "action",
    headerName: "*",
    width: 60,
    renderCell: (params) => (
      <IconButton
        color="primary"
        size="small"
        sx={{ padding: "2px 4px", fontSize: "10px", height: "20px" }}
        onClick={() => handleEdit(params.row)}
      >
        <Edit />
      </IconButton>
    ),
  },
  { field: "namaLengkap", headerName: "Nama Lengkap", flex: 1.5, minWidth: 200 },
  { field: "username", headerName: "Username", flex: 1, minWidth: 120 },
  { field: "jabatan", headerName: "Jabatan", flex: 1, minWidth: 100 },
  { field: "email", headerName: "Email", headerAlign: "right", align: "right", flex: 1, minWidth: 200 },
  { field: "telpon", headerName: "Telpon", flex: 1, minWidth: 150 },
];

const rows = [
  { id: 1, namaLengkap: "Rifki", username: "rifki123", jabatan: "Admin", email: "rifki@example.com", telpon: "081234567890" },
  { id: 2, namaLengkap: "Andi Saputra", username: "andi_sap", jabatan: "User", email: "andi@example.com", telpon: "081298765432" },
  { id: 3, namaLengkap: "Siti Rahma", username: "siti_rahma", jabatan: "Moderator", email: "siti@example.com", telpon: "081356789012" },
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredRows = rows.filter((row) => row.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px", p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Manajemen Pengguna
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Button variant="contained" color="success" startIcon={<SaveAlt />}>
            Tambah Pengguna
          </Button>

          <Button variant="contained" color="error" startIcon={<Delete />}>
            Hapus
          </Button>
        </Box>

        <TextField
          label="Pencarian"
          variant="outlined"
          size="small"
          sx={{ width: "300px" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <DataGrid
        checkboxSelection
        onRowSelectionModelChange={(ids) => setSelectedUsers(ids)}
        rows={filteredRows}
        columns={columns}
        pageSize={5}
        density="compact"
      />
    </Box>
  );
}

export default App;
