"use client";

import React from "react";
import { usePenjualan } from "../context/PenjualanContext";
import {
  Warehouse,
  ShoppingCart,
  History,
  FileSpreadsheet,
  Boxes,
  Search,
  LogOut,
  ShieldCheck,
  UserCheck,
  Lock,
} from "lucide-react";

export default function Navbar() {
  const {
    currentUser,
    logout,
    activeTab,
    changeTab,
    searchQuery,
    setSearchQuery,
    cart,
  } = usePenjualan();

  const totalCartItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const isAdmin = currentUser?.role === "admin";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E5E5] shadow-sm no-print">
      {/* Top 48px Bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo (Multicolor Wordmark: Auction Quad Signature) */}
        <div
          onClick={() => changeTab("katalog")}
          className="flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center">
            <Warehouse className="w-5 h-5 text-[#0064D2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight leading-none">
              <span className="text-[#0064D2]">S</span>
              <span className="text-[#E53238]">I</span>
              <span className="text-[#F5AF02]">P</span>
              <span className="text-[#86B817]">B</span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#707070]">
              Warehouse System
            </span>
          </div>
        </div>

        {/* Center Pill Search Bar (44px height, 9999px radius, #F7F7F7 bg) */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari SKU, nama barang, atau lokasi rak gudang..."
              className="w-full h-11 px-4 pl-10 rounded-full bg-[#F7F7F7] border border-[#E5E5E5] text-sm text-[#191919] placeholder-[#707070] focus:outline-none focus:bg-white focus:border-[#0064D2] focus:ring-1 focus:ring-[#0064D2] transition-all"
            />
            <Search className="w-4 h-4 text-[#707070] absolute left-3.5 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-xs text-[#707070] hover:text-[#191919]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right User & Role Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Role Indicator Chip (28px height, 9999px radius) */}
          <div
            className={`h-7 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold border ${
              isAdmin
                ? "bg-blue-50 text-[#0064D2] border-blue-200"
                : "bg-green-50 text-[#86B817] border-green-200"
            }`}
          >
            {isAdmin ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <UserCheck className="w-3.5 h-3.5" />
            )}
            <span>{isAdmin ? "Admin Gudang" : "Kasir Toko"}</span>
          </div>

          {/* User Name */}
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-bold text-[#191919] leading-tight">
              {currentUser?.nama_lengkap || "User SIPB"}
            </span>
            <span className="text-[11px] text-[#707070]">
              {currentUser?.jabatan || "Staff"}
            </span>
          </div>

          {/* Logout Pill Button */}
          <button
            onClick={logout}
            title="Keluar dari akun dan kembali ke menu login"
            className="h-9 px-3.5 rounded-full border border-[#E5E5E5] hover:border-[#E53238] hover:bg-red-50 text-[#707070] hover:text-[#E53238] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="border-t border-[#E5E5E5] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1 sm:space-x-2 py-1">
            {/* 1. Tab Katalog */}
            <button
              onClick={() => changeTab("katalog")}
              className={`h-10 px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "katalog"
                  ? "bg-[#0064D2] text-white shadow-sm"
                  : "text-[#191919] hover:bg-[#F7F7F7] hover:text-[#0064D2]"
              }`}
            >
              <Warehouse className="w-4 h-4" />
              <span>Katalog Stok Gudang</span>
            </button>

            {/* 2. Tab POS Kasir */}
            <button
              onClick={() => changeTab("kasir")}
              className={`h-10 px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer relative ${
                activeTab === "kasir"
                  ? "bg-[#0064D2] text-white shadow-sm"
                  : "text-[#191919] hover:bg-[#F7F7F7] hover:text-[#0064D2]"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>POS Kasir Penjualan</span>
              {totalCartItems > 0 && (
                <span
                  className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === "kasir"
                      ? "bg-white text-[#0064D2]"
                      : "bg-[#E53238] text-white"
                  }`}
                >
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* 3. Tab Riwayat Transaksi */}
            <button
              onClick={() => changeTab("riwayat")}
              className={`h-10 px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "riwayat"
                  ? "bg-[#0064D2] text-white shadow-sm"
                  : "text-[#191919] hover:bg-[#F7F7F7] hover:text-[#0064D2]"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Transaksi</span>
            </button>

            {/* 4. Tab Master Data Gudang (Admin Only) */}
            <button
              onClick={() => changeTab("master_barang")}
              className={`h-10 px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "master_barang"
                  ? "bg-[#0064D2] text-white shadow-sm"
                  : "text-[#191919] hover:bg-[#F7F7F7] hover:text-[#0064D2]"
              } ${!isAdmin ? "opacity-60" : ""}`}
            >
              <Boxes className="w-4 h-4" />
              <span>Master Data Gudang</span>
              {!isAdmin && <Lock className="w-3 h-3 text-[#707070]" />}
            </button>

            {/* 5. Tab Seluruh Laporan & Cetak (Admin Only) */}
            <button
              onClick={() => changeTab("laporan")}
              className={`h-10 px-4 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "laporan"
                  ? "bg-[#0064D2] text-white shadow-sm"
                  : "text-[#191919] hover:bg-[#F7F7F7] hover:text-[#0064D2]"
              } ${!isAdmin ? "opacity-60" : ""}`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Laporan & Dokumen Cetak</span>
              {!isAdmin && <Lock className="w-3 h-3 text-[#707070]" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
