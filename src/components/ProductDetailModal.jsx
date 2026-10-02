"use client";

import React from "react";
import Image from "next/image";
import { usePenjualan } from "../context/PenjualanContext";
import { X, MapPin, Plus, CheckCircle, AlertTriangle, Star } from "lucide-react";

export default function ProductDetailModal() {
  const { previewProduct, setPreviewProduct, addToCart, currentUser } =
    usePenjualan();

  if (!previewProduct) return null;

  const item = previewProduct;
  const isAdmin = currentUser?.role === "admin";
  const isOutOfStock = item.stok === 0;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lvl3 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="relative aspect-video w-full bg-[#F7F7F7]">
          {item.gambar_url ? (
            <Image
              src={item.gambar_url}
              alt={item.nama_barang}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[#707070]">
              No Photo Available
            </div>
          )}
          <button
            onClick={() => setPreviewProduct(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#191919] shadow-sm flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-[#707070] mb-1">
              <span>{item.kategori}</span>
              <span className="font-mono font-bold text-[#0064D2]">
                {item.kode_sku}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#191919]">
              {item.nama_barang}
            </h3>
            <p className="text-xs text-[#707070] mt-1">{item.deskripsi}</p>
          </div>

          {/* Pricing & Stock Details */}
          <div className="p-3 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5] space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-[#707070]">Harga Jual:</span>
              <span className="text-xl font-bold font-mono text-[#191919]">
                {formatRupiah(item.harga_jual)}
              </span>
            </div>

            {isAdmin && (
              <div className="flex items-baseline justify-between text-xs text-[#0064D2] font-mono">
                <span>Harga Pokok Modal (HPP):</span>
                <span>{formatRupiah(item.harga_beli)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E5E5E5]">
              <span className="flex items-center gap-1 font-mono text-[#191919]">
                <MapPin className="w-3.5 h-3.5 text-[#F5AF02]" />
                {item.lokasi_rak}
              </span>
              <span
                className={`font-mono font-bold ${
                  item.stok <= item.stok_minimum
                    ? "text-[#E53238]"
                    : "text-[#86B817]"
                }`}
              >
                Tersedia: {item.stok} {item.satuan}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPreviewProduct(null)}
              className="h-10 px-5 rounded-full bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-bold text-[#191919] cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={() => {
                addToCart(item, 1);
                setPreviewProduct(null);
              }}
              className={`h-10 px-6 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isOutOfStock
                  ? "bg-[#E5E5E5] text-[#707070] cursor-not-allowed"
                  : "bg-[#0064D2] hover:bg-[#004FB3] text-white shadow-sm"
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>+ Masukkan ke POS Kasir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
