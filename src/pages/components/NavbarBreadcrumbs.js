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
  };

  const mainTitle = pathnames.length ? pageTitles[pathnames[0]] || "Dashboard" : "Home";
  const subTitle = pathnames.length > 1 ? pageTitles[pathnames[1]] : "";

  return (
    <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextRoundedIcon fontSize="small" />}>
      <Typography variant="body1">{mainTitle}</Typography>
      <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
        {subTitle}
      </Typography>
    </StyledBreadcrumbs>
  );
}
