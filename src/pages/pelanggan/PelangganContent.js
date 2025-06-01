import { useState } from "react";
import { utils, writeFile } from "xlsx";

import Copyright from "../components/internals/components/Copyright";

import { SparkLineChart } from "@mui/x-charts/SparkLineChart";
import Chip from "@mui/material/Chip";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Box, Typography } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";

function getDaysInMonth(month, year) {
  const date = new Date(year, month, 0);
  const monthName = date.toLocaleDateString("en-US", {
    month: "short",
  });
  const daysInMonth = date.getDate();
  const days = [];
  let i = 1;
  while (days.length < daysInMonth) {
    days.push(`${monthName} ${i}`);
    i += 1;
  }
  return days;
}

function renderStatus(status) {
  const colors = {
    Online: "success",
    Offline: "default",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}

const columns = [
  { field: "customerName", headerName: "Nama Pelanggan", flex: 1.5, minWidth: 200 },
  { field: "customerId", headerName: "ID Pelanggan", flex: 1, minWidth: 120 },
  { field: "packageId", headerName: "ID Paket", flex: 1, minWidth: 100 },
  { field: "totalBill", headerName: "Total Tagihan", headerAlign: "right", align: "right", flex: 1, minWidth: 100 },
  { field: "status", headerName: "Status Pembayaran", flex: 1, minWidth: 150, renderCell: (params) => renderStatus(params.value) },
  { field: "customerType", headerName: "Jenis Pelanggan", flex: 1, minWidth: 120 },
  { field: "lastPaymentMethod", headerName: "Metode Pembayaran Terakhir", flex: 1, minWidth: 150 },
];
const rows = [
  {
    id: 1,
    customerName: "John Doe",
    customerId: "PLG12345",
    packageId: "PKG01",
    totalBill: "Rp 500.000",
    status: "Belum Lunas",
    customerType: "Rumah Tangga",
    lastPaymentMethod: "Transfer Bank",
    color: "red",
  },
  {
    id: 2,
    customerName: "Jane Smith",
    customerId: "PLG12346",
    packageId: "PKG02",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Perusahaan",
    lastPaymentMethod: "Virtual Account",
    color: "green",
  },
  {
    id: 3,
    customerName: "Michael Johnson",
    customerId: "PLG12347",
    packageId: "PKG03",
    totalBill: "Rp 750.000",
    status: "Belum Lunas",
    customerType: "Industri",
    lastPaymentMethod: "Kartu Kredit",
    color: "red",
  },
  {
    id: 4,
    customerName: "Emily Davis",
    customerId: "PLG12348",
    packageId: "PKG01",
    totalBill: "Rp 200.000",
    status: "Belum Lunas",
    customerType: "Rumah Tangga",
    lastPaymentMethod: "E-Wallet",
    color: "red",
  },
  {
    id: 5,
    customerName: "Chris Brown",
    customerId: "PLG12349",
    packageId: "PKG04",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Perusahaan",
    lastPaymentMethod: "Transfer Bank",
    color: "green",
  },
  {
    id: 6,
    customerName: "Laura Wilson",
    customerId: "PLG12350",
    packageId: "PKG05",
    totalBill: "Rp 900.000",
    status: "Belum Lunas",
    customerType: "Industri",
    lastPaymentMethod: "Virtual Account",
    color: "red",
  },
  {
    id: 7,
    customerName: "Daniel Martinez",
    customerId: "PLG12351",
    packageId: "PKG02",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Rumah Tangga",
    lastPaymentMethod: "Kartu Kredit",
    color: "green",
  },
  {
    id: 8,
    customerName: "Sophia Taylor",
    customerId: "PLG12352",
    packageId: "PKG03",
    totalBill: "Rp 650.000",
    status: "Belum Lunas",
    customerType: "Perusahaan",
    lastPaymentMethod: "E-Wallet",
    color: "red",
  },
  {
    id: 9,
    customerName: "Oliver Anderson",
    customerId: "PLG12353",
    packageId: "PKG06",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Industri",
    lastPaymentMethod: "Transfer Bank",
    color: "green",
  },
  {
    id: 10,
    customerName: "Lucas Hernandez",
    customerId: "PLG12354",
    packageId: "PKG01",
    totalBill: "Rp 300.000",
    status: "Belum Lunas",
    customerType: "Rumah Tangga",
    lastPaymentMethod: "Virtual Account",
    color: "red",
  },
  {
    id: 11,
    customerName: "Mia Thompson",
    customerId: "PLG12355",
    packageId: "PKG04",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Perusahaan",
    lastPaymentMethod: "Kartu Kredit",
    color: "green",
  },
  {
    id: 12,
    customerName: "Ethan White",
    customerId: "PLG12356",
    packageId: "PKG02",
    totalBill: "Rp 450.000",
    status: "Belum Lunas",
    customerType: "Industri",
    lastPaymentMethod: "E-Wallet",
    color: "red",
  },
  {
    id: 13,
    customerName: "Madison Lewis",
    customerId: "PLG12357",
    packageId: "PKG05",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Rumah Tangga",
    lastPaymentMethod: "Transfer Bank",
    color: "green",
  },
  {
    id: 14,
    customerName: "Jacob Scott",
    customerId: "PLG12358",
    packageId: "PKG06",
    totalBill: "Rp 850.000",
    status: "Belum Lunas",
    customerType: "Perusahaan",
    lastPaymentMethod: "Virtual Account",
    color: "red",
  },
  {
    id: 15,
    customerName: "Abigail Carter",
    customerId: "PLG12359",
    packageId: "PKG03",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Industri",
    lastPaymentMethod: "Kartu Kredit",
    color: "green",
  },
  {
    id: 16,
    customerName: "Elijah Green",
    customerId: "PLG12360",
    packageId: "PKG01",
    totalBill: "Rp 700.000",
    status: "Belum Lunas",
    customerType: "Rumah Tangga",
    lastPaymentMethod: "E-Wallet",
    color: "red",
  },
  {
    id: 17,
    customerName: "Charlotte Hall",
    customerId: "PLG12361",
    packageId: "PKG04",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Perusahaan",
    lastPaymentMethod: "Transfer Bank",
    color: "green",
  },
  {
    id: 18,
    customerName: "Benjamin Adams",
    customerId: "PLG12362",
    packageId: "PKG02",
    totalBill: "Rp 550.000",
    status: "Belum Lunas",
    customerType: "Industri",
    lastPaymentMethod: "Virtual Account",
    color: "red",
  },
  {
    id: 19,
    customerName: "Amelia Nelson",
    customerId: "PLG12363",
    packageId: "PKG05",
    totalBill: "Rp 0",
    status: "Lunas",
    customerType: "Rumah Tangga",
    lastPaymentMethod: "Kartu Kredit",
    color: "green",
  },
  {
    id: 20,
    customerName: "William Baker",
    customerId: "PLG12364",
    packageId: "PKG06",
    totalBill: "Rp 900.000",
    status: "Belum Lunas",
    customerType: "Perusahaan",
    lastPaymentMethod: "E-Wallet",
    color: "red",
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredRows = rows.filter((row) => row.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleExport = () => {
    const ws = utils.json_to_sheet(rows); // Mengubah data ke format Excel
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Pelanggan");

    writeFile(wb, "Daftar_Pelanggan.xlsx"); // Mengunduh sebagai Excel
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography component="h2" variant="h6">
          Daftar Pelanggan
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Tombol Export dengan warna hijau MUI */}
          <Button
            variant="contained"
            color="success" // Warna hijau bawaan Material UI
            startIcon={<SaveAlt />}
            onClick={handleExport}
            sx={{ height: "40px" }} // Menyamakan tinggi dengan TextField
          >
            Export
          </Button>

          {/* Kolom Pencarian */}
          <TextField
            label="Cari Pelanggan"
            variant="outlined"
            size="small"
            sx={{ width: "300px", height: "40px" }} // Menyamakan tinggi dengan tombol
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>
      <DataGrid
        checkboxSelection
        rows={filteredRows}
        columns={columns}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: "outlined",
                size: "small",
              },
              columnInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              operatorInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: "outlined",
                  size: "small",
                },
              },
            },
          },
        }}
      />
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}

export default App;
