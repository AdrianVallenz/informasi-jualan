"use client";

import React from "react";
import { usePenjualan } from "../context/PenjualanContext";
import { ShieldAlert, X, ArrowRight } from "lucide-react";

export default function AccessDeniedModal() {
  const {
    accessDeniedMessage,
    setAccessDeniedMessage,
    quickDemoLogin,
  } = usePenjualan();

  if (!accessDeniedMessage) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lvl3 w-full max-w-md overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4 text-[#E53238]">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-center text-[#191919] mb-2">
          Akses Khusus Administrator Gudang
        </h3>

        <p className="text-xs text-[#707070] text-center mb-6 leading-relaxed">
          {accessDeniedMessage}
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              setAccessDeniedMessage(null);
              quickDemoLogin("admin");
            }}
            className="w-full h-10 px-5 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Beralih ke Akun Admin Gudang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setAccessDeniedMessage(null)}
            className="w-full h-10 px-5 rounded-full bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-bold text-[#191919] cursor-pointer"
          >
            Kembali ke Operasional Kasir
          </button>
        </div>
      </div>
    </div>
  );
}
