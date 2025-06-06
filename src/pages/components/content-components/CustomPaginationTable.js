import React from "react";
import { Box, Typography, Button } from "@mui/material";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";

const CustomPaginationTable = ({ page, pageSize, totalRows, onPageChange }) => {
  const totalPages = Math.ceil(totalRows / pageSize);
  return (
    <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", mb: 1 }}>
      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
        {`Halaman ${page + 1} dari ${totalPages}`}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button onClick={() => onPageChange(0)} disabled={page === 0} size="small">
          <FirstPageIcon fontSize="small" />
        </Button>
        <Button onClick={() => onPageChange(page - 1)} disabled={page === 0} size="small">
          <NavigateBeforeIcon fontSize="small" />
        </Button>
        <Button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages - 1} size="small">
          <NavigateNextIcon fontSize="small" />
        </Button>
        <Button onClick={() => onPageChange(Math.max(0, totalPages - 1))} disabled={page >= totalPages - 1} size="small">
          <LastPageIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
};

export default CustomPaginationTable;
