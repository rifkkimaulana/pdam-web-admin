import React, { useState, useEffect } from "react";
import { Box, TextField, Typography, Button, Grid, MenuItem, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getPaketById } from "./paketApi";
import axios from "../../utils/api";

export default function EditPaket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nama_paket: "",
    biaya_admin: "",
    deskripsi: "",
    status: "enable",
    blok_tarif: [{ batas_atas: "", harga_per_m3: "" }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaketById(id);
        const data = res.data;
        setForm({
          nama_paket: data.nama_paket || "",
          biaya_admin: data.biaya_admin || "",
          deskripsi: data.deskripsi || "",
          status: data.status || "enable",
          blok_tarif:
            data.blok_tarif?.length > 0
              ? data.blok_tarif.map((b) => ({
                  batas_atas: b.batas_atas,
                  harga_per_m3: b.harga_per_m3,
                }))
              : [{ batas_atas: "", harga_per_m3: "" }],
        });
      } catch (err) {
        alert("Gagal memuat data paket");
        navigate("/paket");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlokChange = (idx, e) => {
    const newBlok = form.blok_tarif.map((blok, i) => (i === idx ? { ...blok, [e.target.name]: e.target.value } : blok));
    setForm({ ...form, blok_tarif: newBlok });
  };

  const handleAddBlok = () => {
    setForm({
      ...form,
      blok_tarif: [...form.blok_tarif, { batas_atas: "", harga_per_m3: "" }],
    });
  };

  const handleRemoveBlok = (idx) => {
    if (form.blok_tarif.length === 1) return;
    setForm({
      ...form,
      blok_tarif: form.blok_tarif.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Ganti dengan pengambilan pengelola_id yang benar
    const pengelola_id = 1;
    try {
      await axios.put(`/paket/${id}`, {
        pengelola_id,
        nama_paket: form.nama_paket,
        biaya_admin: Number(form.biaya_admin),
        deskripsi: form.deskripsi,
        status: form.status,
        blok_tarif: form.blok_tarif.map((b) => ({
          batas_atas: Number(b.batas_atas),
          harga_per_m3: Number(b.harga_per_m3),
        })),
      });
      alert("Paket berhasil diperbarui!");
      navigate("/paket");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui paket. Cek data dan koneksi.");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="flex-start"
      sx={{ minHeight: "100vh", backgroundColor: "background.default", py: { xs: 2, md: 6 } }}
    >
      <Grid item xs={12} sm={10} md={7} lg={5}>
        <Box sx={{ bgcolor: "background.paper", borderRadius: 3, boxShadow: 3, p: { xs: 2, sm: 4 }, mt: { xs: 2, md: 0 } }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Typography variant="h5" fontWeight={700} align="left">
              Edit Paket
            </Typography>
            <Box display="flex" gap={1}>
              <Button type="submit" form="form-edit-paket" variant="contained" color="primary" size="small" sx={{ minWidth: 100 }}>
                Simpan
              </Button>
              <Button variant="outlined" color="primary" onClick={() => navigate(-1)} size="small" sx={{ minWidth: 100 }}>
                Kembali
              </Button>
            </Box>
          </Box>
          <form id="form-edit-paket" onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="nama-paket"
                  name="nama_paket"
                  value={form.nama_paket}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoFocus
                  variant="outlined"
                  placeholder="Masukkan nama paket"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  id="biaya-admin"
                  name="biaya_admin"
                  value={form.biaya_admin}
                  onChange={handleChange}
                  required
                  type="number"
                  inputProps={{ min: 0 }}
                  fullWidth
                  variant="outlined"
                  placeholder="Masukkan biaya admin"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField id="status" name="status" value={form.status} onChange={handleChange} select fullWidth variant="outlined">
                  <MenuItem value="enable">Aktif</MenuItem>
                  <MenuItem value="disable">Nonaktif</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="deskripsi"
                  name="deskripsi"
                  value={form.deskripsi}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  placeholder="Masukkan deskripsi"
                />
              </Grid>
              <Grid item xs={12}>
                <Box mb={1}>
                  <Typography fontWeight={600}>Blok Tarif</Typography>
                </Box>
                {form.blok_tarif.map((blok, idx) => (
                  <Grid container spacing={1} alignItems="center" key={idx} mb={1}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        id={`batas-atas-${idx}`}
                        name="batas_atas"
                        value={blok.batas_atas}
                        onChange={(e) => handleBlokChange(idx, e)}
                        required
                        type="number"
                        inputProps={{ min: 1 }}
                        fullWidth
                        variant="outlined"
                        placeholder={`Batas Atas Blok ${idx + 1}`}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        id={`harga-per-m3-${idx}`}
                        name="harga_per_m3"
                        value={blok.harga_per_m3}
                        onChange={(e) => handleBlokChange(idx, e)}
                        required
                        type="number"
                        inputProps={{ min: 0 }}
                        fullWidth
                        variant="outlined"
                        placeholder="Harga per m³"
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2} display="flex" alignItems="center" justifyContent="center">
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRemoveBlok(idx)}
                        disabled={form.blok_tarif.length === 1}
                        size="small"
                        sx={{ minWidth: 0, px: 1 }}
                      >
                        Hapus
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <Button variant="outlined" color="primary" onClick={handleAddBlok} sx={{ mt: 1 }} size="small">
                  Tambah Blok
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}
