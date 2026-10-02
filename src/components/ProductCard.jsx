"use client";

import React from "react";
import Image from "next/image";
import { usePenjualan } from "../context/PenjualanContext";
import { Plus, MapPin, AlertTriangle, CheckCircle, Eye } from "lucide-react";

export default function ProductCard({ barang, onSelectDetail }) {
  const { addToCart, currentUser, setRestockTargetBarang } = usePenjualan();

  const isLowStock = barang.stok > 0 && barang.stok <= barang.stok_minimum;
  const isOutOfStock = barang.stok === 0;
  const isAdmin = currentUser?.role === "admin";

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      alert("Stok barang ini sedang habis di gudang!");
      return;
    }
    addToCart(barang, 1);
  };

  return (
    <div
      onClick={() => onSelectDetail && onSelectDetail(barang)}
      className="group bg-white border border-[#E5E5E5] rounded-lg overflow-hidden flex flex-col transition-all duration-150 hover:border-[#0064D2] hover:shadow-lvl1 cursor-pointer"
    >
      {/* 1:1 Flush Top Artwork (Exact Auction Quad rule) */}
      <div className="relative aspect-square w-full bg-[#F7F7F7] overflow-hidden">
        {barang.gambar_url ? (
          <Image
            src={barang.gambar_url}
            alt={barang.nama_barang}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-[#707070]">
            No Photo
          </div>
        )}

        {/* Top Badges (Diskon / Urgency / Rating) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {barang.diskon_persen > 0 && (
            <span className="h-5 px-2 rounded-full bg-[#E53238] text-white text-[10px] font-bold uppercase tracking-wider flex items-center shadow-sm">
              Diskon {barang.diskon_persen}%
            </span>
          )}
        </div>

        {/* Quick View Icon Overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectDetail && onSelectDetail(barang);
          }}
          title="Lihat Detail Barang"
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#191919] shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-4 h-4 text-[#0064D2]" />
        </button>

        {/* Warehouse Rack Location (Bottom Badge) */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#F5AF02]" />
            {barang.lokasi_rak || "Gudang"}
          </span>
          <span className="bg-white/90 text-[#191919] text-[10px] font-bold px-1.5 py-0.5 rounded">
            {barang.satuan || "Pcs"}
          </span>
        </div>
      </div>

      {/* Content Area: 12px Padding (Exact Auction Quad rule) */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & SKU Subtitle */}
          <div className="flex items-center justify-between text-[11px] text-[#707070] mb-1">
            <span>{barang.kategori}</span>
            <span className="font-mono font-medium">{barang.kode_sku}</span>
          </div>

          {/* Product Title: 14px/500, 2-line clamp */}
          <h3 className="text-sm font-medium text-[#191919] line-clamp-2 leading-snug mb-2 group-hover:text-[#0064D2] transition-colors">
            {barang.nama_barang}
          </h3>

          {/* Pricing Section (JetBrains Mono 700 16px) */}
          <div className="mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#191919] font-mono">
                {formatRupiah(barang.harga_jual)}
              </span>
              {barang.harga_coret && barang.harga_coret > barang.harga_jual && (
                <span className="text-xs text-[#707070] line-through font-mono">
                  {formatRupiah(barang.harga_coret)}
                </span>
              )}
            </div>

            {/* Admin Cost (HPP) visible ONLY to Admin - Protected */}
            {isAdmin && (
              <div className="text-[11px] font-mono text-[#0064D2] mt-0.5">
                Modal Beli (HPP): {formatRupiah(barang.harga_beli)}
              </div>
            )}
          </div>
        </div>

        {/* Stock & Operational Status */}
        <div className="pt-2 border-t border-[#E5E5E5] space-y-2">
          {/* Stock Badge */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#707070]">Stok Fisik:</span>
            {isOutOfStock ? (
              <span className="font-bold text-[#E53238] flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                Habis (0)
              </span>
            ) : isLowStock ? (
              <span className="font-bold text-[#E53238] flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                Kritis ({barang.stok})
              </span>
            ) : (
              <span className="font-bold text-[#86B817] flex items-center gap-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                Ready ({barang.stok})
              </span>
            )}
          </div>

          {/* Action Button: Pill Button (rounded-full, 40px height, font 700) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 h-9 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                isOutOfStock
                  ? "bg-[#E5E5E5] text-[#707070] cursor-not-allowed"
                  : "bg-[#0064D2] hover:bg-[#004FB3] text-white shadow-sm"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ POS Kasir</span>
            </button>

            {isAdmin && isLowStock && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setRestockTargetBarang(barang);
                }}
                className="h-9 px-3 rounded-full bg-red-50 hover:bg-red-100 text-[#E53238] border border-[#E53238]/30 text-xs font-bold flex items-center justify-center cursor-pointer shrink-0"
                title="Restock Masuk Gudang"
              >
                Inbound
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
