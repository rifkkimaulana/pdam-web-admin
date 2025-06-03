import React from "react";
import PropTypes from "prop-types";

/**
 * Komponen reusable untuk tombol aksi dengan icon di tabel.
 *
 * @param {string} color - Warna background tombol (gunakan theme.palette.primary.main, dsb)
 * @param {string} title - Tooltip/label tombol
 * @param {function} onClick - Fungsi yang dijalankan saat tombol diklik
 * @param {React.ReactNode} children - Icon atau isi tombol
 * @param {object} sx - Style tambahan (opsional)
 */
export default function ActionIconButton({ color, title, onClick, children, sx }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: color,
        color: "#fff",
        padding: 4,
        borderRadius: 4,
        fontSize: 18,
        marginRight: 4,
        cursor: "pointer",
        ...sx,
      }}
      title={title}
      onClick={onClick}
    >
      {children}
    </span>
  );
}

ActionIconButton.propTypes = {
  color: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};
