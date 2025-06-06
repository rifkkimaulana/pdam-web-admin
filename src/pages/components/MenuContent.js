import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
//icon
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";

import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";

import { Link, useLocation } from "react-router-dom";

const mainListItems = [
  { text: "Dashboard", icon: <DashboardRoundedIcon />, link: "/dashboard" },
  { text: "Laporan", icon: <BarChartRoundedIcon />, link: "/laporan" },
  { text: "Pelanggan", icon: <GroupsRoundedIcon />, link: "/pelanggan" },
  { text: "Staf", icon: <GroupsRoundedIcon />, link: "/staf" },
  { text: "Paket", icon: <InventoryRoundedIcon />, link: "/paket/list" },
  { text: "Tagihan", icon: <ReceiptRoundedIcon />, link: "/tagihan" },
  { text: "Komplain", icon: <ReportProblemRoundedIcon />, link: "/komplain" },
  { text: "Penugasan", icon: <AssignmentTurnedInRoundedIcon />, link: "/penugasan" },
];
const secondaryListItems = [
  { text: "Pengaturan", icon: <SettingsApplicationsRoundedIcon />, link: "/pengaturan" },
  { text: "Kewajiban", icon: <FactCheckRoundedIcon />, link: "/kewajiban" },
  { text: "Paket Pengelola", icon: <InventoryRoundedIcon />, link: "/paket-pengelola" },
  { text: "Pengelola", icon: <GroupsRoundedIcon />, link: "/pengelola" },
];

export default function MenuContent() {
  const location = useLocation();
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to={item.link} selected={location.pathname === item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to={item.link} selected={location.pathname === item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
