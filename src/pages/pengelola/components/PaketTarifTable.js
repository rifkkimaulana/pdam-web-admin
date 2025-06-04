import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

export default function PaketTarifTable({ blokTarif }) {
  if (!blokTarif || blokTarif.length === 0) return null;
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Typography variant="subtitle1" sx={{ p: 2, pb: 0 }}>
        Detail Tarif Paket
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Blok</TableCell>
            <TableCell>Batas Atas (m³)</TableCell>
            <TableCell>Harga per m³</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blokTarif.map((row, idx) => (
            <TableRow key={row.id || idx}>
              <TableCell>{row.nama_blok || row.blok_ke || `Blok ${idx + 1}`}</TableCell>
              <TableCell>{row.batas_atas ?? row.range_akhir ?? row.rangeAkhir ?? ""}</TableCell>
              <TableCell>
                Rp{(row.harga_per_m3 ?? row.harga ?? row.hargaPerM3 ?? "").toLocaleString?.() ?? row.harga_per_m3 ?? row.harga ?? ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
