import React, { useState } from "react";
import { TextField, Grid, Box, Typography, MenuItem } from "@mui/material";
import PaketTarifTable from "./PaketTarifTable";

export default function FormUserJabatanFields({ userData, handleChange, handleFileChange, pengelolaList }) {
  const [paketList] = useState([
    { id: 1, nama_paket: "Paket A" },
    { id: 2, nama_paket: "Paket B" },
    { id: 3, nama_paket: "Paket C" },
  ]);
  const [blokTarif] = useState([
    { tarif: "Tarif 1", harga: "1000" },
    { tarif: "Tarif 2", harga: "2000" },
  ]);

  return (
    <Grid container spacing={2} direction="column">
      {/* Pilihan Jabatan (selalu tampil di atas field dinamis) */}
      <Grid item xs={12}>
        <TextField
          label="Jabatan"
          name="jabatan"
          value={userData.jabatan}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          select
        >
          <MenuItem value="Administrator">Administrator</MenuItem>
          <MenuItem value="Pengelola">Pengelola</MenuItem>
          <MenuItem value="Pelanggan">Pelanggan</MenuItem>
          <MenuItem value="Staf">Staf</MenuItem>
        </TextField>
      </Grid>

      {/* Pengelola untuk Pelanggan */}
      {userData.jabatan === "Pelanggan" && (
        <>
          <Grid item xs={12}>
            <TextField
              select
              label="Pilih Pengelola"
              name="pengelolaId"
              value={userData.pengelolaId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            >
              <MenuItem value="">-- Pilih Pengelola --</MenuItem>
              {pengelolaList.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {(p.user?.nama_lengkap || "-") + " - " + (p.nama_pengelola || "-")}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Paket"
              name="paketId"
              value={userData.paketId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
              disabled={!userData.pengelolaId}
            >
              <MenuItem value="">-- Pilih Paket --</MenuItem>
              {paketList.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nama_paket}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <PaketTarifTable blokTarif={blokTarif} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="No Meter" name="noMeter" value={userData.noMeter} onChange={handleChange} fullWidth variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Alamat Meter"
              name="alamatMeter"
              value={userData.alamatMeter}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </>
      )}

      {/* Pengelola */}
      {userData.jabatan === "Pengelola" && (
        <>
          <Grid item xs={12}>
            <TextField
              label="Nama Pengelola"
              name="namaPengelola"
              value={userData.namaPengelola}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Pengelola"
              name="emailPengelola"
              value={userData.emailPengelola}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Telpon Pengelola"
              name="telponPengelola"
              value={userData.telponPengelola}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Alamat Pengelola"
              name="alamatPengelola"
              value={userData.alamatPengelola}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Box mb={1}>
              <Typography variant="body2" fontWeight={500}>
                Logo (Opsional)
              </Typography>
              <input name="logo" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "block", marginTop: 4 }} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Deskripsi" name="deskripsi" value={userData.deskripsi} onChange={handleChange} fullWidth variant="outlined" />
          </Grid>
        </>
      )}

      {/* Staf */}
      {userData.jabatan === "Staf" && (
        <>
          <Grid item xs={12}>
            <TextField
              select
              label="Pilih Pengelola"
              name="pengelolaId"
              value={userData.pengelolaId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            >
              <MenuItem value="">-- Pilih Pengelola --</MenuItem>
              {pengelolaList.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {(p.user?.nama_lengkap || "-") + " - " + (p.nama_pengelola || "-")}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Jabatan Staf"
              name="jabatanStaf"
              value={userData.jabatanStaf}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
