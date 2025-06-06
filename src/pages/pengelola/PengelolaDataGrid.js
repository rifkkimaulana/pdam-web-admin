import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import ActionIconButton from "../components/ActionIconButton";
import { Edit, Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function PengelolaDataGrid({
  checkedUserIds,
  setCheckedUserIds,
  setRowToDelete,
  setOpenDeleteDialog,
  navigate,
  rows = [],
  loading = false,
  page = 0,
  pageSize = 10,
  rowCount = 0,
  onPageChange,
  onPageSizeChange,
  initialState = {},
}) {
  const theme = useTheme();

  // DataGrid expects each row to have a flat structure for columns.
  // We'll flatten the API data here for easier column mapping.
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
    { field: "no", headerName: "No", width: 70 },
    { field: "nama_lengkap", headerName: "Nama Pengelola", flex: 1, minWidth: 180 },
    { field: "email", headerName: "Email Pengelola", flex: 1, minWidth: 200 },
    { field: "telpon", headerName: "Nomor Telpon", flex: 1, minWidth: 150 },
    { field: "alamat", headerName: "Alamat Pengelola", flex: 1, minWidth: 200 },
    { field: "nama_pengelola", headerName: "Nama PDAM", flex: 1, minWidth: 180 },
    { field: "email_pengelola", headerName: "Email PDAM", flex: 1, minWidth: 200 },
    { field: "telpon_pengelola", headerName: "Nomor Telpon PDAM", flex: 1, minWidth: 150 },
    { field: "status_langganan", headerName: "Status Langganan", flex: 1, minWidth: 150 },
    // Jika ingin kolom status terpisah:
    // { field: "status", headerName: "Status", flex: 1, minWidth: 120 },
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

  return (
    <DataGrid
      rows={dataGridRows}
      columns={columns}
      loading={loading}
      page={page}
      pageSize={pageSize}
      rowCount={rowCount}
      paginationMode="server"
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[5, 10, 25, 50, 100]}
      initialState={initialState}
    />
  );
}
