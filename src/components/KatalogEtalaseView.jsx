"use client";

import React, { useState } from "react";
import { usePenjualan } from "../context/PenjualanContext";
import ProductCard from "./ProductCard";
import { Plus, Boxes, AlertTriangle, CheckCircle, PackageOpen } from "lucide-react";

export default function KatalogEtalaseView() {
  const {
    barangList,
    kategoriList,
    selectedKategori,
    setSelectedKategori,
    searchQuery,
    currentUser,
    setShowTambahModal,
    setPreviewProduct,
  } = usePenjualan();

  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const isAdmin = currentUser?.role === "admin";

  // Filter items
  const filteredBarang = barangList.filter((item) => {
    const matchesCategory =
      selectedKategori === "Semua" || item.kategori === selectedKategori;
    const matchesQuery =
      !searchQuery.trim() ||
      item.nama_barang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode_sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi_rak.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = onlyLowStock
      ? item.stok <= item.stok_minimum
      : true;

    return matchesCategory && matchesQuery && matchesStock;
  });

  const lowStockCount = barangList.filter(
    (b) => b.stok <= b.stok_minimum
  ).length;
  const readyStockCount = barangList.filter(
    (b) => b.stok > b.stok_minimum
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#191919]">
                Katalog Persediaan Barang Gudang
              </h2>
              <span className="text-xs font-mono font-bold bg-[#F7F7F7] border border-[#E5E5E5] px-2.5 py-0.5 rounded-full text-[#707070]">
                {barangList.length} SKU Terdaftar
              </span>
            </div>
            <p className="text-xs text-[#707070] mt-1">
              Pantau ketersediaan fisik stok di rak penyimpanan dan masukkan langsung ke POS Kasir Penjualan.
            </p>
          </div>

          {/* Quick Metrics & Admin Action */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Ready Stock Chip */}
            <div className="h-8 px-3 rounded-full bg-green-50 border border-green-200 text-[#86B817] text-xs font-bold flex items-center gap-1.5 font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{readyStockCount} Aman</span>
            </div>

            {/* Low Stock Warning Chip / Toggle */}
            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`h-8 px-3 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer font-mono ${
                onlyLowStock
                  ? "bg-[#E53238] text-white shadow-sm"
                  : lowStockCount > 0
                  ? "bg-red-50 text-[#E53238] border border-red-200 hover:bg-red-100"
                  : "bg-gray-50 text-[#707070] border border-[#E5E5E5]"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lowStockCount} Perlu Restock</span>
            </button>

            {/* Admin Add Product Pill CTA */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowTambahModal(true)}
                className="h-10 px-5 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Barang Gudang</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips (28px height, 9999px radius - Exact Auction Quad rule) */}
        <div className="mt-5 pt-4 border-t border-[#E5E5E5] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs text-[#707070] font-medium mr-1 shrink-0">
            Kategori:
          </span>
          {kategoriList.map((kat) => {
            const isActive = selectedKategori === kat;
            return (
              <button
                key={kat}
                type="button"
                onClick={() => setSelectedKategori(kat)}
                className={`h-7 px-3 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#0064D2] text-white font-bold shadow-xs"
                    : "bg-white text-[#191919] border border-[#E5E5E5] hover:border-[#0064D2]"
                }`}
              >
                {kat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid: 4 columns desktop (gap 16px), 2 columns mobile (gap 12px) */}
      {filteredBarang.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredBarang.map((item) => (
            <ProductCard
              key={item.id}
              barang={item}
              onSelectDetail={(b) => setPreviewProduct(b)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F7F7F7] flex items-center justify-center mx-auto mb-4 text-[#707070]">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#191919] mb-1">
            Tidak ada barang yang cocok
          </h3>
          <p className="text-xs text-[#707070] max-w-sm mx-auto mb-4">
            Pencarian kata kunci atau filter kategori tidak menemukan barang di rak gudang.
          </p>
          <button
            onClick={() => {
              setSelectedKategori("Semua");
              setOnlyLowStock(false);
            }}
            className="h-9 px-4 rounded-full bg-[#F7F7F7] hover:bg-[#E5E5E5] text-[#191919] text-xs font-bold transition-colors cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}
