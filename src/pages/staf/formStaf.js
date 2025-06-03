import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Card, CardContent } from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getStafById, createStaf, updateStaf, fetchPengelolaOptions } from "./stafApi";

export default function FormStaf() {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    nama_lengkap: "",
    alamat: "",
    username: "",
    password: "",
    email: "",
    telpon: "",
    jenis_identitas: "KTP",
    nomor_identitas: "",
    file_identitas: null,
    pictures: null,
    jabatan: "Staf",
    pengelola_id: "",
  });

  const [pengelolaOptions, setPengelolaOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const pengelolaData = await fetchPengelolaOptions();
        setPengelolaOptions(pengelolaData);
      } catch (error) {
        console.error("Error fetching pengelola options:", error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchStafData = async () => {
        try {
          const stafData = await getStafById(id);
          setUserId(stafData.user?.id || null);
          setFormData({
            nama_lengkap: stafData.user?.nama_lengkap || "",
            alamat: stafData.user?.alamat || "",
            username: stafData.user?.username || "",
            password: "",
            email: stafData.user?.email || "",
            telpon: stafData.user?.telpon || "",
            jenis_identitas: stafData.user?.jenis_identitas || "KTP",
            nomor_identitas: stafData.user?.nomor_identitas || "",
            file_identitas: null,
            pictures: null,
            jabatan: stafData.jabatan || "Staf",
            pengelola_id: stafData.pengelola?.id || "",
          });
        } catch (error) {
          console.error("Error fetching staf data:", error);
        }
      };

      fetchStafData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const isFileIdentitasFile = formData.file_identitas instanceof File;
      const isPicturesFile = formData.pictures instanceof File;
      let payload;

      if (isFileIdentitasFile || isPicturesFile) {
        payload = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            payload.append(key, formData[key]);
          }
        });
      } else {
        payload = { ...formData };
      }

      if (isEditMode) {
        await updateStaf(id, payload);
      } else {
        await createStaf(payload);
      }

      toast.success("Data staf berhasil disimpan.", { position: "top-right" });
    } catch (error) {
      console.error("Error submitting data:", error);
      if (error.response && error.response.status === 422) {
        toast.error("Data yang diberikan tidak valid. Periksa kembali input Anda.", { position: "top-right" });
      } else {
        toast.error("Gagal menyimpan data staf. Silakan coba lagi.", { position: "top-right" });
      }
    }
  };

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
              {isEditMode ? "Edit Staf" : "Tambah Staf"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button type="submit" variant="contained" color="success" form="form-staf">
                {isEditMode ? "Simpan Perubahan" : "Simpan"}
              </Button>
              <Button variant="contained" onClick={() => window.history.back()}>
                Kembali
              </Button>
            </Box>
          </Box>
          <form id="form-staf" onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="Nama Lengkap"
                name="nama_lengkap"
                variant="outlined"
                fullWidth
                value={formData.nama_lengkap}
                onChange={handleChange}
              />
              <TextField label="Alamat" name="alamat" variant="outlined" fullWidth value={formData.alamat} onChange={handleChange} />
              <TextField label="Username" name="username" variant="outlined" fullWidth value={formData.username} onChange={handleChange} />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleChange}
              />
              <TextField label="Telepon" name="telpon" variant="outlined" fullWidth value={formData.telpon} onChange={handleChange} />
              <TextField
                select
                label="Jenis Identitas"
                name="jenis_identitas"
                variant="outlined"
                fullWidth
                value={formData.jenis_identitas}
                onChange={handleChange}
                SelectProps={{ native: true }}
              >
                <option value="KTP">KTP</option>
                <option value="SIM">SIM</option>
                <option value="PASPOR">PASPOR</option>
                <option value="ID Lainnya">ID Lainnya</option>
              </TextField>
              <TextField
                label="Nomor Identitas"
                name="nomor_identitas"
                variant="outlined"
                fullWidth
                value={formData.nomor_identitas}
                onChange={handleChange}
              />
              <TextField
                select
                label="Nama Pengelola"
                name="pengelola_id"
                variant="outlined"
                fullWidth
                value={formData.pengelola_id || ""}
                onChange={handleChange}
                SelectProps={{ native: true }}
              >
                <option value="">Pilih Pengelola</option>
                {pengelolaOptions.map((pengelola) => (
                  <option key={pengelola.id} value={pengelola.id}>
                    {pengelola.nama_lengkap}
                  </option>
                ))}
              </TextField>
              <TextField
                label="Nama Jabatan"
                name="nama_jabatan"
                variant="outlined"
                fullWidth
                value={formData.jabatan || ""}
                onChange={handleChange}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  File Identitas
                </Typography>
                <Button component="label" variant="contained" sx={{ justifyContent: "flex-start" }}>
                  Upload File
                  <input name="file_identitas" type="file" hidden onChange={handleChange} />
                </Button>
                {formData.file_identitas && (
                  <Typography variant="caption" color="text.secondary">
                    {formData.file_identitas.name}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Foto Profil
                </Typography>
                <Button component="label" variant="contained" sx={{ justifyContent: "flex-start" }}>
                  Upload Foto
                  <input name="pictures" type="file" hidden onChange={handleChange} />
                </Button>
                {formData.pictures && (
                  <Typography variant="caption" color="text.secondary">
                    {formData.pictures.name}
                  </Typography>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
