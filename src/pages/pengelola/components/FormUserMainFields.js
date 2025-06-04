import React from "react";
import { TextField, Grid, InputAdornment, Box, Typography, MenuItem } from "@mui/material";
import { Person, AccountCircle, Lock, Email, Phone } from "@mui/icons-material";

export default function FormUserMainFields({ userData, handleChange, handleFileChange, isEdit }) {
  return (
    <Grid container spacing={2} direction="column">
      <Grid item xs={12}>
        <TextField
          label="Nama Lengkap"
          name="namaLengkap"
          value={userData.namaLengkap}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          placeholder="Masukkan nama lengkap"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Username"
          name="username"
          value={userData.username}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          placeholder="Masukkan username"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label={isEdit ? "Password (Kosongkan jika tidak diubah)" : "Password"}
          name="password"
          value={userData.password}
          onChange={handleChange}
          fullWidth
          type="password"
          variant="outlined"
          placeholder={isEdit ? "Masukkan password baru" : "Masukkan password"}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
          required={!isEdit}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          placeholder="Masukkan email"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Telepon"
          name="telpon"
          value={userData.telpon}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          placeholder="Masukkan telepon"
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Phone />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Jenis Identitas"
          name="jenisIdentitas"
          value={userData.jenisIdentitas}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          select
        >
          <MenuItem value="KTP">KTP</MenuItem>
          <MenuItem value="SIM">SIM</MenuItem>
          <MenuItem value="PASPOR">PASPOR</MenuItem>
          <MenuItem value="ID Lainnya">ID Lainnya</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Nomor Identitas"
          name="nomorIdentitas"
          value={userData.nomorIdentitas}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          placeholder="Masukkan nomor identitas"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Alamat"
          name="alamat"
          value={userData.alamat}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          placeholder="Masukkan alamat"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <Box mb={1}>
          <Typography variant="body2" fontWeight={500}>
            Foto Identitas (Opsional)
          </Typography>
          <input name="fileIdentitas" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "block", marginTop: 4 }} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box mb={1}>
          <Typography variant="body2" fontWeight={500}>
            Foto Profil (Opsional)
          </Typography>
          <input name="pictures" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "block", marginTop: 4 }} />
        </Box>
      </Grid>
      {/* Hapus field jabatan dari sini, akan dipindah ke FormUserJabatanFields */}
    </Grid>
  );
}
