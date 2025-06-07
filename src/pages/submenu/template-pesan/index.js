import React, { useState, useRef } from "react";
import { Box, Typography, Paper, Divider, Stack, TextField, Button, MenuItem, Card } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const templatesDefault = [
  {
    kode: "pemasangan",
    nama: "Notifikasi Pemasangan Baru",
    pesan: "Selamat {nama},\npemasangan sambungan air baru Anda telah diproses.\nNomor pelanggan: {nomor_pelanggan}.",
  },
  {
    kode: "tagihan",
    nama: "Notifikasi Tagihan",
    pesan: "Halo {nama},\ntagihan air bulan {periode} Anda sebesar Rp {total_tagihan}.\nSilakan bayar sebelum {jatuh_tempo}.",
  },
  {
    kode: "pembayaran",
    nama: "Konfirmasi Pembayaran",
    pesan:
      "Pembayaran untuk nomor pelanggan {nomor_pelanggan} sebesar Rp {jumlah_bayar}\ntelah diterima pada {tanggal_bayar}.\nTerima kasih.",
  },
];

const VARIABEL = [
  { keterangan: "Nama Pelanggan", variabel: "{nama}" },
  { keterangan: "Periode Tagihan", variabel: "{periode}" },
  { keterangan: "Total Tagihan", variabel: "{total_tagihan}" },
  { keterangan: "Jatuh Tempo", variabel: "{jatuh_tempo}" },
  { keterangan: "Nomor Pelanggan", variabel: "{nomor_pelanggan}" },
  { keterangan: "Jumlah Bayar", variabel: "{jumlah_bayar}" },
  { keterangan: "Tanggal Bayar", variabel: "{tanggal_bayar}" },
];

export default function TemplatePesanOtomatis({ onBack }) {
  const [templates, setTemplates] = useState(templatesDefault);
  const [selected, setSelected] = useState(templatesDefault[0].kode);
  const [pesan, setPesan] = useState(templatesDefault[0].pesan);
  const textareaRef = useRef(null);

  const handleChangeTemplate = (e) => {
    const kode = e.target.value;
    setSelected(kode);
    const found = templates.find((t) => t.kode === kode);
    setPesan(found.pesan);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
      }
    }, 10);
  };

  const handleChangePesan = (e) => {
    setPesan(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  };

  // Insert variabel ke posisi kursor
  const handleInsertVariable = (variabel) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = pesan.substring(0, start);
    const after = pesan.substring(end);
    const next = before + variabel + after;
    setPesan(next);

    // Setelah setPesan, pindahkan kursor ke setelah variabel
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + variabel.length;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }, 0);
  };

  const handleSimpan = () => {
    setTemplates(templates.map((t) => (t.kode === selected ? { ...t, pesan } : t)));
    alert("Template pesan otomatis berhasil disimpan!\nBaris baru akan dikirim ke WhatsApp sebagai \\n");
  };

  // Preview dummy WhatsApp (baris baru tampil sesuai template)
  const preview = pesan
    .replace("{nama}", "Budi")
    .replace("{periode}", "Juni 2024")
    .replace("{total_tagihan}", "200.000")
    .replace("{jatuh_tempo}", "15 Juni 2024")
    .replace("{nomor_pelanggan}", "A123456")
    .replace("{jumlah_bayar}", "200.000")
    .replace("{tanggal_bayar}", "07 Juni 2024");

  return (
    <Box width="100%">
      <Paper sx={{ p: 3, width: "100%" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} gap={2}>
          <Typography variant="h6" fontWeight={600}>
            Template Pesan Otomatis
          </Typography>
          <Box display="flex" gap={1}>
            <Button variant="outlined" color="primary" startIcon={<ArrowBackIcon />} onClick={onBack}>
              Kembali
            </Button>
            <Button variant="contained" color="primary" onClick={handleSimpan}>
              Simpan
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="caption" color="text.secondary" mb={1} display="block">
          Klik variabel di bawah untuk memasukkan ke template pesan:
        </Typography>
        <Box mb={2}>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15 }}>
            {VARIABEL.map((v) => (
              <li key={v.variabel} style={{ marginBottom: 8, display: "flex", alignItems: "center" }}>
                <span style={{ minWidth: 140 }}>{v.keterangan}</span>
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    ml: 1,
                    minWidth: "28px",
                    px: 1,
                    height: 28,
                    fontSize: 13,
                    fontWeight: 500,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "none",
                    fontFamily: "monospace",
                  }}
                  onClick={() => handleInsertVariable(v.variabel)}
                  title={`Masukkan ${v.variabel}`}
                >
                  "{v.variabel}"
                </Button>
              </li>
            ))}
          </ul>
        </Box>
        <Stack spacing={2}>
          <TextField select label="Jenis Template" value={selected} onChange={handleChangeTemplate} fullWidth>
            {templates.map((t) => (
              <MenuItem key={t.kode} value={t.kode}>
                {t.nama}
              </MenuItem>
            ))}
          </TextField>
          <Box position="relative">
            <textarea
              ref={textareaRef}
              value={pesan}
              onChange={handleChangePesan}
              rows={4}
              style={{
                width: "100%",
                resize: "none",
                borderRadius: 8,
                border: "1px solid #6663",
                padding: 14,
                fontSize: 15,
                fontFamily: "inherit",
                minHeight: 90,
                background: "inherit",
                color: "inherit",
                boxSizing: "border-box",
                lineHeight: 1.5,
              }}
              placeholder={`Contoh:\nHalo {nama},\ntagihan bulan {periode} Anda sebesar Rp {total_tagihan}.`}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                position: "absolute",
                top: 3,
                right: 8,
                pointerEvents: "none",
              }}
            >
              Baris baru: Enter
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" mb={0.5}>
              Preview WhatsApp:
            </Typography>
            <Card
              variant="outlined"
              sx={{
                p: 1.5,
                display: "flex",
                justifyContent: "flex-end",
                background: "none",
                boxShadow: "none",
                border: "none",
              }}
            >
              <Box
                sx={{
                  borderRadius: "16px 16px 4px 16px",
                  p: 2,
                  maxWidth: 350,
                  minWidth: 150,
                  fontSize: 14,
                  fontFamily: "inherit",
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "divider",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  lineHeight: 1.6,
                }}
              >
                {preview}
              </Box>
            </Card>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
