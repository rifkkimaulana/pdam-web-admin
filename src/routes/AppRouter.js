import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import UserManagement from "../pages/manajemen-user/ManajemenUser";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />}>
          <Route index element={<DashboardContent />} />
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="laporan" element={<LaporanContent />} />
          <Route path="pelanggan" element={<PelangganContent />} />
          <Route path="paket" element={<PaketContent />} />
          <Route path="tagihan" element={<TagihanContent />} />
          <Route path="komplain" element={<KomplainContent />} />
          <Route path="penugasan" element={<PenugasanContent />} />
          <Route path="pengaturan" element={<PengaturanContent />} />
          <Route path="kewajiban" element={<KewajibanContent />} />

          <Route path="manajemen-user" element={<UserManagement />} />
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
