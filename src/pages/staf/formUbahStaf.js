import React from "react";
import { Box, Button, TextField, Typography, Card, CardContent } from "@mui/material";

export default function FormTambahStaf() {
  return (
    <Box
      sx={{
        width: "90%",
        maxWidth: "900px",
        margin: "40px auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography component="h2" variant="h6">
              Tambah Staf
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button type="submit" variant="contained" color="success" form="form-tambah-staf">
                Simpan
              </Button>
              <Button variant="contained" onClick={() => window.history.back()}>
                Kembali
              </Button>
            </Box>
          </Box>
          <form id="form-tambah-staf">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField label="Nama Lengkap" name="nama_lengkap" variant="outlined" fullWidth />
              <TextField label="Alamat" name="alamat" variant="outlined" fullWidth />
              <TextField label="Username" name="username" variant="outlined" fullWidth />
              <TextField label="Password" name="password" type="password" variant="outlined" fullWidth />
              <TextField label="Email" name="email" type="email" variant="outlined" fullWidth />
              <TextField label="Telepon" name="telpon" variant="outlined" fullWidth />
              <TextField select label="Jenis Identitas" name="jenis_identitas" variant="outlined" fullWidth SelectProps={{ native: true }}>
                <option value="KTP">KTP</option>
                <option value="SIM">SIM</option>
                <option value="PASPOR">PASPOR</option>
                <option value="ID Lainnya">ID Lainnya</option>
              </TextField>
              <TextField label="Nomor Identitas" name="nomor_identitas" variant="outlined" fullWidth />
              <TextField select label="Nama Pengelola" name="pengelola_id" variant="outlined" fullWidth SelectProps={{ native: true }}>
                <option value="">Pilih Pengelola</option>
                {/* Opsi pengelola di sini */}
              </TextField>
              <TextField label="Nama Jabatan Staf" name="jabatan_staf" variant="outlined" fullWidth />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  File Identitas
                </Typography>
                <Button component="label" variant="contained" sx={{ justifyContent: "flex-start" }}>
                  Upload File
                  <input name="file_identitas" type="file" hidden />
                </Button>
                {/* Nama file identitas yang diupload */}
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Foto Profil
                </Typography>
                <Button component="label" variant="contained" sx={{ justifyContent: "flex-start" }}>
                  Upload Foto
                  <input name="pictures" type="file" hidden />
                </Button>
                {/* Nama file foto profil yang diupload */}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
