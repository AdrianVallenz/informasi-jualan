"use client";

import React from "react";
import { PenjualanProvider, usePenjualan } from "../context/PenjualanContext";
import LoginScreen from "../components/LoginScreen";
import Navbar from "../components/Navbar";
import KatalogEtalaseView from "../components/KatalogEtalaseView";
import KasirPosView from "../components/KasirPosView";
import RiwayatTransaksiView from "../components/RiwayatTransaksiView";
import ManajemenBarangView from "../components/ManajemenBarangView";
import LaporanAdminView from "../components/LaporanAdminView";
import StrukPenjualanModal from "../components/StrukPenjualanModal";
import TambahBarangModal from "../components/TambahBarangModal";
import InboundRestockModal from "../components/InboundRestockModal";
import EditBarangModal from "../components/EditBarangModal";
import ProductDetailModal from "../components/ProductDetailModal";
import AccessDeniedModal from "../components/AccessDeniedModal";

function DashboardContent() {
  const { currentUser, activeTab } = usePenjualan();

  // 1. Initial Gatekeeper: Must be logged in
  if (!currentUser) {
    return <LoginScreen />;
  }

  // 2. Authenticated Dashboard with Role-based Views
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === "katalog" && <KatalogEtalaseView />}
        {activeTab === "kasir" && <KasirPosView />}
        {activeTab === "riwayat" && <RiwayatTransaksiView />}
        {activeTab === "master_barang" && <ManajemenBarangView />}
        {activeTab === "laporan" && <LaporanAdminView />}
      </main>

      {/* Global Modals */}
      <StrukPenjualanModal />
      <TambahBarangModal />
      <InboundRestockModal />
      <EditBarangModal />
      <ProductDetailModal />
      <AccessDeniedModal />

      {/* Footer (Hidden on print) */}
      <footer className="bg-white border-t border-[#E5E5E5] py-4 text-center text-xs text-[#707070] no-print mt-auto">
        <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-[#191919]">SIPB Warehouse v2.4</span> • Sistem Informasi Penjualan Barang Berbasis Warehouse
          </div>
          <div>
            Role Aktif: <b className="text-[#0064D2]">{currentUser.role === "admin" ? "Super Admin" : "Kasir Shift"}</b> ({currentUser.nama_lengkap})
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Page() {
  return (
    <PenjualanProvider>
      <DashboardContent />
    </PenjualanProvider>
  );
}
