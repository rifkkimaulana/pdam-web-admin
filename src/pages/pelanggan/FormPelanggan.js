import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Box, CircularProgress } from "@mui/material";
import { getPelangganById, createPelanggan, updatePelanggan } from "./pelangganApi";
import { getPengelolaList } from "../manajemen-user/userApi";

const initialState = {
  user_id: "",
  pengelola_id: "",
  no_meter: "",
  alamat_meter: "",
  status: "enable",
};

export default function FormPelanggan({ open, onClose, onSuccess, pelangganId }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [pengelolaList, setPengelolaList] = useState([]);
  const isEdit = Boolean(pelangganId);

  useEffect(() => {
    setForm(initialState);
    if (open) {
      getPengelolaList().then(setPengelolaList);
      if (isEdit) {
        setLoading(true);
        getPelangganById(pelangganId).then((data) => {
          setForm({ ...data });
          setLoading(false);
        });
      }
    }
  }, [open, pelangganId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updatePelanggan(pelangganId, form);
      } else {
        await createPelanggan(form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("Gagal menyimpan data pelanggan");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Pelanggan" : "Tambah Pelanggan"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TextField label="ID User" name="user_id" value={form.user_id} onChange={handleChange} fullWidth margin="normal" required />
              <TextField
                select
                label="Pengelola"
                name="pengelola_id"
                value={form.pengelola_id}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              >
                {pengelolaList.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.nama_pengelola}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="No Meter"
                name="no_meter"
                value={form.no_meter}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Alamat Meter"
                name="alamat_meter"
                value={form.alamat_meter}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField select label="Status" name="status" value={form.status} onChange={handleChange} fullWidth margin="normal" required>
                <MenuItem value="enable">Aktif</MenuItem>
                <MenuItem value="disable">Nonaktif</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            Simpan
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
