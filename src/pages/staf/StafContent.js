import React from "react";
import { Box, Typography } from "@mui/material";

export default function StafContent() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Daftar Staf
      </Typography>
      {/* TODO: Tambahkan DataGrid/fungsi CRUD staf di sini */}
      <Typography variant="body1">Halaman staf siap dikembangkan.</Typography>
    </Box>
  );
}
