import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Checkbox from "@mui/material/Checkbox";
import ActionIconButton from "../components/ActionIconButton";
import { Edit, Delete } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function PengelolaDataGrid({
  rows,
  loading,
  checkedUserIds,
  setCheckedUserIds,
  setRowToDelete,
  setOpenDeleteDialog,
  navigate,
}) {
  const theme = useTheme();

  const dataGridRows = rows.map((row) => ({
    id: row.id,
    "user.id": row.user?.id || "-",
    "user.nama_lengkap": row.user?.nama_lengkap || "-",
    "user.email": row.user?.email || "-",
    "user.telpon": row.user?.telpon || "-",
    "user.alamat": row.user?.alamat || "-",
    "pengelola.nama_pengelola": row.pengelola?.nama_pengelola || "-",
    "pengelola.email": row.pengelola?.email || "-",
    "pengelola.telpon": row.pengelola?.telpon || "-",
    "langganan.status": row.langganan?.status || "-",
    "langganan.mulai_langganan": row.langganan?.mulai_langganan || "-",
    "langganan.akhir_langganan": row.langganan?.akhir_langganan || "-",
    "paket.nama_paket - paket.masa_aktif paket.satuan": row.paket
      ? `${row.paket.nama_paket} - ${row.paket.masa_aktif} ${row.paket.satuan}`
      : "-",
    "paket.harga_paket": row.paket?.harga_paket || "-",
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
        const allUserIds = dataGridRows.map((row) => row["user.id"]).filter((id) => id !== "-" && id !== undefined && id !== null);
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
          console.log("User ID terpilih:", newChecked);
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
        const userId = params.row["user.id"];
        const checked = checkedUserIds.includes(userId);
        const handleChange = (e) => {
          let newChecked;
          if (e.target.checked) {
            newChecked = [...checkedUserIds, userId];
          } else {
            newChecked = checkedUserIds.filter((id) => id !== userId);
          }
          setCheckedUserIds(newChecked);
          console.log("User ID terpilih:", newChecked);
        };
        return <Checkbox checked={checked} onChange={handleChange} sx={{ p: 0 }} color="primary" />;
      },
    },
    { field: "user.nama_lengkap", headerName: "Nama Pengelola", flex: 1, minWidth: 180 },
    { field: "user.email", headerName: "Email Pengelola", flex: 1, minWidth: 200 },
    { field: "user.telpon", headerName: "Nomor Telpon", flex: 1, minWidth: 150 },
    { field: "user.alamat", headerName: "Alamat Pengelola", flex: 1, minWidth: 200 },
    { field: "pengelola.nama_pengelola", headerName: "Nama PDAM", flex: 1, minWidth: 180 },
    { field: "pengelola.email", headerName: "Email PDAM", flex: 1, minWidth: 200 },
    { field: "pengelola.telpon", headerName: "Nomor Telpon PDAM", flex: 1, minWidth: 150 },
    { field: "langganan.status", headerName: "Status Langganan", flex: 1, minWidth: 150 },
    {
      field: "langganan.mulai_langganan",
      headerName: "Tanggal Mulai",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const raw = params.row["langganan.mulai_langganan"];
        if (!raw) return "-";
        const d = new Date(raw);
        if (isNaN(d)) return "-";
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day} / ${month} / ${year}`;
      },
    },
    {
      field: "langganan.akhir_langganan",
      headerName: "Tanggal Akhir",
      flex: 1,
      minWidth: 130,
      renderCell: (params) => {
        const raw = params.row["langganan.akhir_langganan"];
        if (!raw) return "-";
        const d = new Date(raw);
        if (isNaN(d)) return "-";
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day} / ${month} / ${year}`;
      },
    },
    { field: "paket.nama_paket - paket.masa_aktif paket.satuan", headerName: "Paket Langganan", flex: 1, minWidth: 150 },
    {
      field: "paket.harga_paket",
      headerName: "Harga Paket",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const value = params.row["paket.harga_paket"];
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
        const isAdmin = params.row.user?.jabatan === "Administrator";
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

  return <DataGrid rows={dataGridRows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 25, 50]} pagination loading={loading} />;
}
