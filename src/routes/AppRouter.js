import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Form } from "react-router-dom";
import SignIn from "../pages/auth/sign-in/SignIn";
import SignUp from "../pages/auth/sign-up/SignUp";
import ForgotPasswordPage from "../pages/auth/forgot-password/ForgotPassword";
import NotFound from "../pages/NotFound";

import Index from "../pages/Index";
import DashboardContent from "../pages/dashboard/DashboardContent";
import LaporanContent from "../pages/laporan/LaporanContent";
import PelangganContent from "../pages/pelanggan/PelangganContent";
import PaketContent from "../pages/paket/PaketContent";
import TagihanContent from "../pages/tagihan/TagihanContent";
import KomplainContent from "../pages/komplain/KomplainContent";
import PenugasanContent from "../pages/penugasan/PenugasanContent";
import PengaturanContent from "../pages/pengaturan/PengaturanContent";
import KewajibanContent from "../pages/kewajiban/KewajibanContent";

import FormUser from "../pages/pengelola/FormUser";
import TambahPaket from "../pages/paket/TambahPaket";
import EditPaket from "../pages/paket/EditPaket";
import StafContent from "../pages/staf/StafContent";
import FormTambahStaf from "../pages/staf/formTambahStaf";
import FormUbahStaf from "../pages/staf/formUbahStaf";

import Pengelola from "../pages/pengelola/PengelolaContent";
import PaketPengelolaContent from "../pages/paket-pengelola/PaketContent";

import { getToken } from "../utils/auth";
import { toast } from "react-toastify";

function PrivateRoute({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!getToken()) {
      navigate("/sign-in");
      toast.error("Silahkan login terlebih dahulu!");
    }
  }, [navigate]);
  return getToken() ? children : null;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route
            index
            element={
              <PrivateRoute>
                <DashboardContent />
              </PrivateRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <DashboardContent />
              </PrivateRoute>
            }
          />
          <Route
            path="laporan"
            element={
              <PrivateRoute>
                <LaporanContent />
              </PrivateRoute>
            }
          />
          <Route
            path="pelanggan"
            element={
              <PrivateRoute>
                <PelangganContent />
              </PrivateRoute>
            }
          />
          <Route
            path="paket/list"
            element={
              <PrivateRoute>
                <PaketContent />
              </PrivateRoute>
            }
          />
          <Route
            path="tagihan"
            element={
              <PrivateRoute>
                <TagihanContent />
              </PrivateRoute>
            }
          />
          <Route
            path="komplain"
            element={
              <PrivateRoute>
                <KomplainContent />
              </PrivateRoute>
            }
          />
          <Route
            path="penugasan"
            element={
              <PrivateRoute>
                <PenugasanContent />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan"
            element={
              <PrivateRoute>
                <PengaturanContent />
              </PrivateRoute>
            }
          />
          <Route
            path="kewajiban"
            element={
              <PrivateRoute>
                <KewajibanContent />
              </PrivateRoute>
            }
          />
          <Route
            path="pengelola"
            element={
              <PrivateRoute>
                <Pengelola />
              </PrivateRoute>
            }
          />
          <Route
            path="paket-pengelola"
            element={
              <PrivateRoute>
                <PaketPengelolaContent />
              </PrivateRoute>
            }
          />

          <Route
            path="pengelola/tambah"
            element={
              <PrivateRoute>
                <FormUser />
              </PrivateRoute>
            }
          />
          <Route
            path="user/edit/:id"
            element={
              <PrivateRoute>
                <FormUser />
              </PrivateRoute>
            }
          />
          <Route
            path="paket/tambah"
            element={
              <PrivateRoute>
                <TambahPaket />
              </PrivateRoute>
            }
          />
          <Route
            path="/paket/edit/:id"
            element={
              <PrivateRoute>
                <EditPaket />
              </PrivateRoute>
            }
          />
          <Route
            path="staf"
            element={
              <PrivateRoute>
                <StafContent />
              </PrivateRoute>
            }
          />
          <Route
            path="staf/tambah"
            element={
              <PrivateRoute>
                <FormTambahStaf />
              </PrivateRoute>
            }
          />
          <Route
            path="staf/edit/:id"
            element={
              <PrivateRoute>
                <FormUbahStaf />
              </PrivateRoute>
            }
          />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
