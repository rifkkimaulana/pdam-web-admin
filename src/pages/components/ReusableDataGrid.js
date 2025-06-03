import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function ReusableDataGrid({ columns, rows, searchTerm = "", onSearchChange = () => {}, toolbar = null, ...props }) {
  const theme = useTheme();
  const filteredRows =
    searchTerm && searchTerm.length > 0
      ? rows.filter((row) => {
          return Object.values(row).some((val) => typeof val === "string" && val.toLowerCase().includes(searchTerm.toLowerCase()));
        })
      : rows;

  return (
    <Box sx={{ width: "100%", backgroundColor: theme.palette.background.paper, borderRadius: 2, boxShadow: 1 }}>
      {toolbar}
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")}
        density="compact"
        autoHeight
        {...props}
      />
    </Box>
  );
}
