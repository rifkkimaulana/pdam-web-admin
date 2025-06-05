import * as React from "react";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { useLocation } from "react-router-dom";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const pageTitles = {
    dashboard: "Dashboard",
    laporan: "Laporan",
    pelanggan: "Daftar Pelanggan",
    paket: "Paket Layanan",
    tagihan: "Tagihan",
    komplain: "Keluhan & Komplain",
    penugasan: "Penugasan Petugas",
    list: "List Paket",
    "paket-pengelola": "Paket Pengelolaan",
    pengelola: "Pengelola",
  };

  // Ambil judul utama dan sub dari path
  const mainTitle = pathnames[0] ? pageTitles[pathnames[0]] || pathnames[0] : "Home";
  const subTitle = pathnames[1] ? pageTitles[pathnames[1]] || pathnames[1] : "List";

  return (
    <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextRoundedIcon fontSize="small" />}>
      <Typography variant="body1">{mainTitle}</Typography>
      {subTitle && (
        <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
          {subTitle.charAt(0).toUpperCase() + subTitle.slice(1)}
        </Typography>
      )}
    </StyledBreadcrumbs>
  );
}
