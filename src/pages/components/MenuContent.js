import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
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
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { Link, useLocation } from "react-router-dom";

const mainListItems = [
  { text: "Dashboard", icon: <DashboardRoundedIcon />, link: "/dashboard" },
  { text: "Laporan", icon: <BarChartRoundedIcon />, link: "/laporan" },
  { text: "Pelanggan", icon: <GroupsRoundedIcon />, link: "/pelanggan" },
  { text: "Tagihan", icon: <ReceiptRoundedIcon />, link: "/tagihan" },
  { text: "Komplain", icon: <ReportProblemRoundedIcon />, link: "/komplain" },
  { text: "Penugasan", icon: <AssignmentTurnedInRoundedIcon />, link: "/penugasan" },
];
const secondaryListItems = [
  {
    text: "Pengaturan",
    icon: <SettingsApplicationsRoundedIcon />,
    children: [
      { text: "Profil Pengelola & Perusahaan", link: "/pengaturan/profil", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Akun & Keamanan", link: "/pengaturan/akun", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Pengaturan Tarif & Paket", link: "/pengaturan/tarif-paket", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Pengaturan Rekening/Bank", link: "/pengaturan/rekening", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Notifikasi", link: "/pengaturan/notifikasi", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Kelola Staf", link: "/pengaturan/staf", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Template Pesan Otomatis", link: "/pengaturan/template-pesan", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Log Aktivitas", link: "/pengaturan/log-aktivitas", icon: <ChevronRightRoundedIcon fontSize="small" /> },
    ],
  },
  { text: "Kewajiban", icon: <FactCheckRoundedIcon />, link: "/kewajiban" },
  {
    text: "Master Admin",
    icon: <FactCheckRoundedIcon />,
    children: [
      { text: "Paket Pengelola", link: "/paket-pengelola", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Pengelola", link: "/pengelola", icon: <ChevronRightRoundedIcon fontSize="small" /> },
      { text: "Pembayaran", link: "/pembayaran-langganan", icon: <ChevronRightRoundedIcon fontSize="small" /> },
    ],
  },
];

export default function MenuContent() {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = React.useState(null);

  React.useEffect(() => {
    if (location.pathname.startsWith("/pengaturan")) {
      setOpenDropdown(0);
    } else if (
      location.pathname.startsWith("/paket-pengelola") ||
      location.pathname.startsWith("/pengelola") ||
      location.pathname.startsWith("/pembayaran-langganan")
    ) {
      setOpenDropdown(2); // index 2 untuk Master Admin
    } else {
      setOpenDropdown(null);
    }
  }, [location.pathname]);

  const handleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

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
          <React.Fragment key={index}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={item.children ? undefined : Link}
                to={item.children ? undefined : item.link}
                selected={item.children ? openDropdown === index : location.pathname === item.link}
                onClick={item.children ? () => handleDropdown(index) : undefined}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse in={openDropdown === index} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 4 }}>
                  {item.children.map((child, cidx) => (
                    <ListItem key={cidx} disablePadding sx={{ display: "block" }}>
                      <ListItemButton component={Link} to={child.link} selected={location.pathname === child.link}>
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Stack>
  );
}
