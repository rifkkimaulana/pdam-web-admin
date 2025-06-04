import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Box, CircularProgress } from "@mui/material";

const initialState = {
  user_id: "",
  pengelola_id: "",
  no_meter: "",
  alamat_meter: "",
  status: "enable",
};

export default function FormPelanggan({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [pengelolaList] = useState([
    { id: 1, nama_pengelola: "Pengelola A" },
    { id: 2, nama_pengelola: "Pengelola B" },
    { id: 3, nama_pengelola: "Pengelola C" },
  ]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSuccess();
      onClose();
      setLoading(false);
    }, 2000); // Simulasi delay untuk penyimpanan data
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{form.user_id ? "Edit Pelanggan" : "Tambah Pelanggan"}</DialogTitle>
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
