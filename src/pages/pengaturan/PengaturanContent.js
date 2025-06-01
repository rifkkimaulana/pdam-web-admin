import React, { useState } from "react";
import { Box, Button, TextField, Typography, Switch, FormControlLabel, Card, CardContent, Grid } from "@mui/material";
import { SaveAlt } from "@mui/icons-material";

export default function PengaturanContent() {
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [tarifAir, setTarifAir] = useState(3000);
  const [dendaPersen, setDendaPersen] = useState(5);
  const [appBranding, setAppBranding] = useState("PDAM Smart");

  return (
    <Box sx={{ width: "100%", maxWidth: "1700px", p: 3 }}>
      {/* Pengaturan WhatsApp Gateway & Telegram */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Pengaturan Notifikasi
          </Typography>
          <FormControlLabel
            control={<Switch checked={whatsappEnabled} onChange={(e) => setWhatsappEnabled(e.target.checked)} />}
            label="Aktifkan WhatsApp Gateway"
          />
          <FormControlLabel
            control={<Switch checked={telegramEnabled} onChange={(e) => setTelegramEnabled(e.target.checked)} />}
            label="Aktifkan Notifikasi Telegram"
          />
        </CardContent>
      </Card>

      {/* Pengaturan Tarif Air & Denda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Pengaturan Tarif & Denda
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Tarif Air per m³ (Rp)"
                variant="outlined"
                type="number"
                fullWidth
                value={tarifAir}
                onChange={(e) => setTarifAir(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Denda Keterlambatan (%)"
                variant="outlined"
                type="number"
                fullWidth
                value={dendaPersen}
                onChange={(e) => setDendaPersen(e.target.value)}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Pengaturan Aplikasi */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Pengaturan Aplikasi
          </Typography>
          <TextField
            label="Nama Aplikasi"
            variant="outlined"
            fullWidth
            value={appBranding}
            onChange={(e) => setAppBranding(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Tombol Simpan */}
      <Button variant="contained" color="success" startIcon={<SaveAlt />} sx={{ height: "40px", borderRadius: "8px", fontWeight: "bold" }}>
        Simpan Pengaturan
      </Button>
    </Box>
  );
}
