import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import SignIn from "../pages/auth/sign-in/SignIn";
import SignUp from "../pages/auth/sign-up/SignUp";
import ForgotPasswordPage from "../pages/auth/forgot-password/ForgotPassword";
import NotFound from "../pages/NotFound";

import Index from "../pages/Index";
import DashboardContent from "../pages/dashboard/DashboardContent";
import LaporanContent from "../pages/laporan/LaporanContent";
import PelangganContent from "../pages/pelanggan/PelangganContent";

import TagihanContent from "../pages/tagihan/TagihanContent";
import KomplainContent from "../pages/komplain/KomplainContent";
import PenugasanContent from "../pages/penugasan/PenugasanContent";
import KewajibanContent from "../pages/kewajiban/KewajibanContent";

import TambahPaket from "../pages/submenu/tarif-paket/tambahPaket";

import Pengelola from "../pages/pengelola/PengelolaContent";
import TambahPengelola from "../pages/pengelola/TambahPengelola";
import UbahPengelola from "../pages/pengelola/EditPengelola";
import PaketPengelolaContent from "../pages/paket-pengelola/PaketContent";
import PembayaranLanggananContent from "../pages/pembayaran-langganan/PembayaranLanggananContent";

import { getToken } from "../utils/auth";
import { toast } from "react-toastify";
import ProfilPengelolaPerusahaan from "../pages/submenu/profil";
import AkunKeamanan from "../pages/submenu/akun";
import TarifPaket from "../pages/submenu/tarif-paket";
import Rekening from "../pages/submenu/rekening";
import Notifikasi from "../pages/submenu/notifikasi";
import KelolaStaf from "../pages/submenu/staf";
import TemplatePesan from "../pages/submenu/template-pesan";
import LogAktivitas from "../pages/submenu/log-aktivitas";

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
            path="pengelola/tambah"
            element={
              <PrivateRoute>
                <TambahPengelola />
              </PrivateRoute>
            }
          />
          <Route
            path="pengelola/edit/:id"
            element={
              <PrivateRoute>
                <UbahPengelola />
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
            path="pembayaran-langganan"
            element={
              <PrivateRoute>
                <PembayaranLanggananContent />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan/profil"
            element={
              <PrivateRoute>
                <ProfilPengelolaPerusahaan />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan/akun"
            element={
              <PrivateRoute>
                <AkunKeamanan />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan/tarif-paket"
            element={
              <PrivateRoute>
                <TarifPaket />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan/tarif-paket/tambah"
            element={
              <PrivateRoute>
                <TambahPaket />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan/rekening"
            element={
              <PrivateRoute>
                <Rekening />
              </PrivateRoute>
            }
          />

          <Route
            path="pengaturan/notifikasi"
            element={
              <PrivateRoute>
                <Notifikasi />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan/staf"
            element={
              <PrivateRoute>
                <KelolaStaf />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan/template-pesan"
            element={
              <PrivateRoute>
                <TemplatePesan />
              </PrivateRoute>
            }
          />
          <Route
            path="pengaturan/log-aktivitas"
            element={
              <PrivateRoute>
                <LogAktivitas />
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
