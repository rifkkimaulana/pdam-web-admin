import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState, useRef } from "react";
import { fetchPembayaranLangganan, fetchPrivateFile, fetchPengelola, createPembayaranLangganan } from "../../utils/pembayaran";
import { DataGrid } from "@mui/x-data-grid";
import CustomPaginationTable from "../components/content-components/CustomPaginationTable";
import { toast } from "react-toastify";

export default function KewajibanPengelola() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [bukti, setBukti] = React.useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [openBuktiDialog, setOpenBuktiDialog] = useState(false);
  const [buktiImage, setBuktiImage] = useState("");
  const [perusahaan, setPerusahaan] = useState(null);
  const [paketAktif, setPaketAktif] = useState(null);
  const [listPengelola, setListPengelola] = useState([]);

  // Tambahan state & ref untuk dialog tambah pembayaran
  const [openTambahDialog, setOpenTambahDialog] = useState(false);
  const [formTambah, setFormTambah] = useState({
    langganan_id: "",
    tanggal_bayar: dayjs().format("YYYY-MM-DD"),
    jumlah_bayar: "",
    metode: "Cash",
    bukti_bayar: null,
    bukti_bayar_url: "",
  });
  const fileInputRef = useRef();

  // State tambahan untuk filter dan search
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPengelola().then((data) => {
      if (data && data.length > 0) {
        setListPengelola(data);
        setPerusahaan({
          nama_lengkap: data[0].user?.nama_lengkap || "-",
          nama_pengelola: data[0].nama_pengelola || "-",
          email: data[0].email || "-",
          telpon: data[0].telpon || "-",
          alamat: data[0].alamat || "-",
        });
        // Cari langganan aktif (status == 'Aktif'), jika tidak ada ambil langganan terakhir
        let langgananAktif = data[0].langganan.find((l) => l.status === "Aktif") || data[0].langganan[0];
        if (langgananAktif) {
          setPaketAktif({
            nama: langgananAktif.paket?.nama_paket || "-",
            harga: langgananAktif.paket?.harga_paket || 0,
            mulai: langgananAktif.mulai_langganan,
            akhir: langgananAktif.akhir_langganan,
            masaAktif: (langgananAktif.paket?.masa_aktif || "-") + " " + (langgananAktif.paket?.satuan || ""),
            status: langgananAktif.status,
          });
        } else {
          setPaketAktif(null);
        }
      }
    });
  }, []);

  const today = dayjs();
  const akhir = paketAktif ? dayjs(paketAktif.akhir) : dayjs();
  const sisaHari = paketAktif ? akhir.diff(today, "day") : 0;
  // Update logic: aktifkan jika sisaHari < 10, atau kosong, null, atau NaN
  const enablePerpanjang = sisaHari < 10 || sisaHari === "" || sisaHari === null || Number.isNaN(sisaHari);

  const handleBukti = (e) => setBukti(e.target.value);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleKirim = () => {
    setOpenDialog(false);
    setBukti("");
  };

  // Handler paginasi
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPage(0);
  };

  useEffect(() => {
    setLoading(true);
    fetchPembayaranLangganan(page + 1, pageSize, "", "")
      .then((data) => {
        setRows(data.data || []);
        setTotalRows(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, pageSize]);

  // Handler lihat bukti gambar
  const handleLihatBukti = async (bukti) => {
    if (bukti && bukti !== "-") {
      // Ambil nama file dari database (misal: "bukti_bayar/namafile.jpg")
      const [folder, ...rest] = bukti.split("/");
      const filename = rest.join("/");
      try {
        const blob = await fetchPrivateFile(folder, filename);
        const url = URL.createObjectURL(blob);
        setBuktiImage(url);
        setOpenBuktiDialog(true);
      } catch (err) {
        // Anda bisa menambahkan notifikasi error di sini jika ingin
        setBuktiImage("");
        setOpenBuktiDialog(true);
      }
    }
  };

  // Handler lihat bukti baru (preview file upload)
  const handleLihatBuktiBaru = () => {
    if (formTambah.bukti_bayar_url) {
      setBuktiImage(formTambah.bukti_bayar_url);
      setOpenBuktiDialog(true);
    }
  };

  const dataGridRows = rows.map((row, idx) => ({
    id: row.id,
    no: page * pageSize + idx + 1,
    tanggal: row.tanggal_bayar || row.tanggal || "-",
    nominal: row.jumlah_bayar || row.nominal || "-",
    metode: row.metode || "-",
    status: row.status || "-",
    bukti: row.bukti_bayar || row.bukti || "-",
  }));

  const columns = [
    { field: "no", headerName: "No", width: 50 },
    {
      field: "tanggal",
      headerName: "Tanggal",
      minWidth: 120,
      flex: 1,
      renderCell: (params) =>
        params.row && params.row.tanggal && params.row.tanggal !== "-" ? dayjs(params.row.tanggal).format("DD-MM-YYYY") : "-",
    },
    {
      field: "nominal",
      headerName: "Nominal",
      minWidth: 120,
      flex: 1,
      renderCell: (params) =>
        params.row && params.row.nominal && params.row.nominal !== "-" ? `Rp ${Number(params.row.nominal).toLocaleString()}` : "-",
    },
    { field: "metode", headerName: "Metode", minWidth: 110, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 110,
      flex: 1,
      renderCell: (params) => {
        let color = "default";
        let label = params.value || "-";
        if (label === "Diterima") color = "success";
        else if (label === "Ditolak") color = "error";
        else if (label === "Menunggu") color = "warning";
        return <Chip label={label} color={color} size="small" variant="filled" />;
      },
    },
    {
      field: "bukti",
      headerName: "Bukti Pembayaran",
      minWidth: 110,
      flex: 1,
      renderCell: (params) =>
        params.value && params.value !== "-" ? (
          <Button size="small" variant="outlined" onClick={() => handleLihatBukti(params.value)}>
            Lihat
          </Button>
        ) : (
          "-"
        ),
    },
  ];

  // Handler untuk buka dialog tambah pembayaran dari tombol perpanjang langganan
  const handleOpenPerpanjangDialog = () => {
    fetchPengelola().then((data) => {
      if (data && data.length > 0 && data[0].langganan) {
        const langgananAktif = data[0].langganan.find((l) => l.status === "Aktif") || data[0].langganan[0];
        setFormTambah({
          langganan_id: langgananAktif ? langgananAktif.id : "",
          tanggal_bayar: dayjs().format("YYYY-MM-DD"),
          jumlah_bayar: langgananAktif ? langgananAktif.paket?.harga_paket || 0 : 0,
          metode: "Transfer",
          bukti_bayar: null,
          bukti_bayar_url: "",
        });
        setOpenTambahDialog(true);
      }
    });
  };

  // Handler close dialog tambah pembayaran
  const handleCloseTambahDialog = () => setOpenTambahDialog(false);

  // Handler perubahan form tambah pembayaran
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

  // Ambil data langganan untuk field Nama Pelanggan (readonly, otomatis)
  useEffect(() => {
    if (openTambahDialog) {
      fetchPengelola().then((data) => {
        if (data && data.length > 0 && data[0].langganan) {
          const langgananAktif = data[0].langganan.find((l) => l.status === "Aktif") || data[0].langganan[0];
          setFormTambah((prev) => ({
            ...prev,
            langganan_id: langgananAktif ? langgananAktif.id : "",
            jumlah_bayar: langgananAktif ? langgananAktif.paket?.harga_paket || 0 : 0,
          }));
        }
      });
    }
  }, [openTambahDialog]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Kewajiban Pengelola
      </Typography>

      {/* Box 1: Status & Tombol */}
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Status Pembayaran Aplikasi
          </Typography>
          <Button
            variant="contained"
            color="success"
            disabled={!enablePerpanjang}
            onClick={handleOpenPerpanjangDialog}
            sx={{ minWidth: 200 }}
          >
            {enablePerpanjang ? "Perpanjang Langganan" : "Lunas"}
          </Button>
        </CardContent>
      </Card>

      {/* Flexbox: Identitas & Paket, selalu sama tinggi */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        {/* Identitas */}
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: { md: "100%" },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Informasi Perusahaan
            </Typography>
            {perusahaan ? (
              <>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Nama Lengkap</Typography>
                  <Typography>: {perusahaan.nama_lengkap}</Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Nama Pengelola</Typography>
                  <Typography>: {perusahaan.nama_pengelola}</Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Email</Typography>
                  <Typography>: {perusahaan.email}</Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Telepon</Typography>
                  <Typography>: {perusahaan.telpon}</Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Alamat</Typography>
                  <Typography>: {perusahaan.alamat}</Typography>
                </Box>
              </>
            ) : (
              <Typography>Memuat data perusahaan...</Typography>
            )}
          </CardContent>
        </Card>

        {/* Paket */}
        <Card
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: { md: "100%" },
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Informasi Paket Langganan
            </Typography>
            {paketAktif ? (
              <>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Nama Paket</Typography>
                  <Typography>: {paketAktif.nama}</Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Masa Aktif</Typography>
                  <Typography>: {paketAktif.masaAktif}</Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Periode Aktif</Typography>
                  <Typography>
                    : {dayjs(paketAktif.mulai).format("DD-MM-YYYY")} s/d {dayjs(paketAktif.akhir).format("DD-MM-YYYY")}
                  </Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Harga Paket</Typography>
                  <Typography>: Rp {Number(paketAktif.harga || 0).toLocaleString()}</Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Status</Typography>
                  <Typography>
                    : <b style={{ color: paketAktif.status === "Aktif" ? "#388e3c" : "#fbc02d" }}>{paketAktif.status}</b>
                  </Typography>
                </Box>
                <Box display="flex" gap={1} mb={1}>
                  <Typography sx={{ minWidth: 130 }}>Sisa Hari Aktif</Typography>
                  <Typography>
                    : <b>{sisaHari} hari</b>
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography>Memuat data paket...</Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* DataGrid Riwayat Pembayaran */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Riwayat Pembayaran Pengelola
          </Typography>
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
            <CustomPaginationTable
              page={page}
              pageSize={pageSize}
              totalRows={totalRows}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Dialog Perpanjangan */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Perpanjang Langganan</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 300, mt: 1 }}>
            <TextField label="Nama Paket" value={paketAktif ? paketAktif.nama : "-"} disabled fullWidth sx={{ mb: 2 }} />
            <TextField
              label="Nominal"
              value={`Rp ${Number(paketAktif ? paketAktif.harga : 0).toLocaleString()}`}
              disabled
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField label="Upload Bukti Transfer" type="file" fullWidth onChange={handleBukti} InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleKirim} variant="contained" color="success" disabled={!bukti}>
            Kirim
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Lihat Bukti Pembayaran */}
      <Dialog open={openBuktiDialog} onClose={() => setOpenBuktiDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Lihat Bukti Pembayaran</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {buktiImage ? (
            <img src={buktiImage} alt="Bukti Pembayaran" style={{ maxWidth: "100%", maxHeight: 400 }} />
          ) : (
            <Typography variant="body2">Tidak ada gambar bukti pembayaran.</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah Langganan */}
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
              InputProps={{ readOnly: false }}
            >
              {listPengelola.flatMap((pengelola) =>
                (pengelola.langganan || []).map((langganan) => (
                  <MenuItem key={langganan.id} value={langganan.id}>
                    {(pengelola.user?.nama_lengkap || "-") + " - " + (pengelola.nama_pengelola || "-")}
                  </MenuItem>
                ))
              )}
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
            <TextField
              label="Metode Pembayaran"
              name="metode"
              value={formTambah.metode}
              fullWidth
              required
              InputProps={{ readOnly: true }}
            />
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
                  required
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
              if (
                !formTambah.langganan_id ||
                !formTambah.tanggal_bayar ||
                !formTambah.jumlah_bayar ||
                !formTambah.metode ||
                !formTambah.bukti_bayar
              ) {
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
                  metode: "Transfer",
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
    </Box>
  );
}
