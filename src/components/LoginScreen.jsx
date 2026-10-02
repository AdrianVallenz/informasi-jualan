"use client";

import React, { useState } from "react";
import { usePenjualan } from "../context/PenjualanContext";
import { ShieldCheck, Warehouse, UserCheck, Lock, User, AlertCircle, Database } from "lucide-react";
import { isSupabaseConfigured } from "../lib/supabaseClient";

export default function LoginScreen() {
  const { login, quickDemoLogin } = usePenjualan();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!username.trim() || !password) {
      setErrorMessage("Silakan masukkan username dan password!");
      return;
    }

    const result = login(username, password);
    if (!result.success) {
      setErrorMessage(result.message || "Kredensial tidak valid!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center items-center p-4">
      {/* Container with Auction Quad max width */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center shadow-lvl1">
              <Warehouse className="w-6 h-6 text-[#0064D2]" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              <span className="text-[#0064D2]">S</span>
              <span className="text-[#E53238]">I</span>
              <span className="text-[#F5AF02]">P</span>
              <span className="text-[#86B817]">B</span>
              <span className="text-[#191919] ml-2 text-2xl font-bold">WAREHOUSE</span>
            </h1>
          </div>
          <p className="text-sm text-[#707070] font-medium">
            Sistem Informasi Penjualan Barang Berbasis Warehouse & Retail
          </p>

          {/* Database indicator pill */}
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-white border border-[#E5E5E5] text-xs text-[#707070] shadow-sm">
            <Database className="w-3.5 h-3.5 text-[#0064D2]" />
            <span>Database:</span>
            <span className={`font-semibold ${isSupabaseConfigured ? "text-[#86B817]" : "text-[#0064D2]"}`}>
              {isSupabaseConfigured ? "Supabase Cloud Connected" : "Local Mode & Supabase Ready"}
            </span>
          </div>
        </div>

        {/* Center Card with Level 3 Elevation */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lvl3 p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#191919]">Masuk ke Sistem</h2>
            <p className="text-xs text-[#707070] mt-1">
              Pilih peran Anda atau masukkan akun untuk mengakses panel operasional.
            </p>
          </div>

          {/* Quick 1-Click Demo Buttons (Auction Quad signature pill CTAs) */}
          <div className="space-y-3 mb-6 pb-6 border-b border-[#E5E5E5]">
            <p className="text-xs font-semibold text-[#707070] uppercase tracking-wider">
              Akses Cepat Demo 1-Klik:
            </p>

            {/* Admin Quick Login Pill Button */}
            <button
              type="button"
              onClick={() => quickDemoLogin("admin")}
              className="w-full h-10 px-5 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-sm font-bold flex items-center justify-between transition-colors shadow-sm cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Masuk sebagai Admin Gudang
              </span>
              <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded-full">
                Full Akses & Laporan
              </span>
            </button>

            {/* Kasir Quick Login Pill Button */}
            <button
              type="button"
              onClick={() => quickDemoLogin("kasir")}
              className="w-full h-10 px-5 rounded-full bg-[#86B817] hover:bg-[#74a112] text-white text-sm font-bold flex items-center justify-between transition-colors shadow-sm cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Masuk sebagai Kasir Toko
              </span>
              <span className="text-[11px] font-mono bg-white/20 px-2 py-0.5 rounded-full">
                POS Kasir & Struk
              </span>
            </button>
          </div>

          {/* Manual Credentials Form */}
          <form onSubmit={handleManualSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-[#E53238]/30 flex items-center gap-2 text-xs text-[#E53238] font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#191919] mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin atau kasir"
                  className="w-full h-10 px-3 pl-9 rounded-lg border border-[#E5E5E5] text-sm text-[#191919] bg-white focus:outline-none focus:border-[#0064D2] focus:ring-1 focus:ring-[#0064D2] transition-colors"
                />
                <User className="w-4 h-4 text-[#707070] absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#191919] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 pl-9 rounded-lg border border-[#E5E5E5] text-sm text-[#191919] bg-white focus:outline-none focus:border-[#0064D2] focus:ring-1 focus:ring-[#0064D2] transition-colors"
                />
                <Lock className="w-4 h-4 text-[#707070] absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-10 px-5 rounded-full bg-[#191919] hover:bg-[#333333] text-white text-sm font-bold transition-colors cursor-pointer mt-2"
            >
              Masuk dengan Kredensial
            </button>
          </form>

          {/* Credentials Helper hint */}
          <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-center">
            <p className="text-[12px] text-[#707070]">
              Default: <span className="font-mono font-bold text-[#191919]">admin/admin123</span> atau{" "}
              <span className="font-mono font-bold text-[#191919]">kasir/kasir123</span>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-xs text-[#707070]">
          © {new Date().getFullYear()} SIPB Warehouse Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
