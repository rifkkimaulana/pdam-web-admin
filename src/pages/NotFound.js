import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 12 }}>
      <Box>
        <Typography variant="h1" color="error" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Halaman Tidak Ditemukan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary" size="large">
          Kembali ke Beranda
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
