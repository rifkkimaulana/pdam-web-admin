import React from "react";
import TextField from "@mui/material/TextField";

/**
 * Komponen pencarian table reusable
 * @param {string} label - Label untuk TextField
 * @param {string} value - Value dari input
 * @param {function} onChange - Fungsi saat value berubah
 * @param {string} [placeholder] - Placeholder opsional
 * @param {object} [sx] - Style sx opsional
 * @param {string} [size] - Ukuran input (default: small)
 * @param {object} [textFieldProps] - Props tambahan untuk TextField
 */
const SearchTableContent = ({
  label = "Cari Data",
  value = "",
  onChange,
  placeholder = "",
  sx = {},
  size = "small",
  textFieldProps = {},
}) => {
  return (
    <TextField
      label={label}
      variant="outlined"
      size={size}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      sx={{ width: 250, height: 40, "& .MuiInputBase-root": { height: 40 }, ...sx }}
      {...textFieldProps}
    />
  );
};

export default SearchTableContent;
