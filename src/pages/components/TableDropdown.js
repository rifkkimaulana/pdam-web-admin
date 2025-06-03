import React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

/**
 * Komponen reusable untuk dropdown tabel (button hijau dengan menu)
 * @param {string} label - Label pada button
 * @param {Array<{label: string, icon: React.ReactNode, onClick: function}>} menuItems - Daftar menu
 * @param {object} buttonProps - Props tambahan untuk Button
 */
export default function TableDropdown({ label = "Tabel", menuItems = [], buttonProps = {} }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        endIcon={<ArrowDropDownIcon />}
        sx={{ height: "40px", textTransform: "none", fontWeight: 600, ...buttonProps.sx }}
        onClick={handleMenuClick}
        {...buttonProps}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          sx: (theme) => ({
            backgroundColor: theme.palette.mode === "dark" ? theme.palette.grey[900] : theme.palette.background.paper,
            boxShadow: 3,
            borderRadius: 2,
            minWidth: 180,
          }),
        }}
      >
        {menuItems.map((item, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              handleMenuClose();
              item.onClick && item.onClick();
            }}
          >
            {item.icon}
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
