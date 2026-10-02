"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePenjualan } from "../context/PenjualanContext";
import {
  Boxes,
  Plus,
  Edit2,
  Trash2,
  ArrowDownToLine,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Search,
  DollarSign,
  Package,
} from "lucide-react";

export default function ManajemenBarangView() {
  const {
    barangList,
    hapusBarang,
    setShowTambahModal,
    setRestockTargetBarang,
    setEditTargetBarang,
  } = usePenjualan();

  const [tableSearch, setTableSearch] = useState("");
  const [selectedKategoriFilter, setSelectedKategoriFilter] = useState("Semua");

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filteredBarang = barangList.filter((b) => {
    const matchCategory =
      selectedKategoriFilter === "Semua" || b.kategori === selectedKategoriFilter;
    const matchSearch =
      !tableSearch.trim() ||
      b.nama_barang.toLowerCase().includes(tableSearch.toLowerCase()) ||
      b.kode_sku.toLowerCase().includes(tableSearch.toLowerCase()) ||
      b.lokasi_rak.toLowerCase().includes(tableSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalAsetGudang = barangList.reduce(
    (acc, b) => acc + b.stok * b.harga_beli,
    0
  );
  const totalUnitGudang = barangList.reduce((acc, b) => acc + b.stok, 0);

  return (
    <div className="space-y-6">
      {/* Top Warehouse Header Banner */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-[#0064D2]" />
              <h2 className="text-xl font-bold text-[#191919]">
                Manajemen Master Data & Stok Gudang
              </h2>
            </div>
            <p className="text-xs text-[#707070] mt-1">
              Kelola penomoran SKU, alokasi penempatan rak penyimpanan, harga pokok pembelian (HPP), dan restock barang masuk.
            </p>
          </div>

          {/* Quick Metrics & Add Product CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-9 px-3.5 rounded-full bg-blue-50 border border-blue-200 text-[#0064D2] text-xs font-mono font-bold flex items-center gap-1.5">
              <span>Valuasi Aset HPP:</span>
              <span className="text-sm">{formatRupiah(totalAsetGudang)}</span>
            </div>

            <div className="h-9 px-3 rounded-full bg-gray-50 border border-[#E5E5E5] text-[#191919] text-xs font-mono font-bold flex items-center gap-1.5">
              <span>Total:</span>
              <span>{totalUnitGudang} Unit Fisik</span>
            </div>

            <button
              type="button"
              onClick={() => setShowTambahModal(true)}
              className="h-10 px-5 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Master Barang</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Cari SKU, nama barang, atau lokasi rak..."
              className="w-full h-9 px-3 pl-8 rounded-full bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#191919] focus:bg-white focus:border-[#0064D2] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#707070] absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-[#707070] font-medium shrink-0">
              Kategori:
            </span>
            <select
              value={selectedKategoriFilter}
              onChange={(e) => setSelectedKategoriFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] bg-[#F7F7F7] focus:bg-white focus:border-[#0064D2] focus:outline-none"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Elektronik & Audio">Elektronik & Audio</option>
              <option value="Komputer & Jaringan">Komputer & Jaringan</option>
              <option value="Perkakas & Tools">Perkakas & Tools</option>
              <option value="Kabel & Aksesoris">Kabel & Aksesoris</option>
              <option value="Penyimpanan & Rak">Penyimpanan & Rak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Warehouse Master Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#707070] font-semibold">
                <th className="py-3 px-3">Item / SKU</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3">Lokasi Rak Gudang</th>
                <th className="py-3 px-3 text-right">Harga Modal (HPP)</th>
                <th className="py-3 px-3 text-right">Harga Jual</th>
                <th className="py-3 px-3 text-center">Stok Fisik</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Operasional & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {filteredBarang.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#707070]">
                    Tidak ada barang yang cocok.
                  </td>
                </tr>
              ) : (
                filteredBarang.map((item) => {
                  const isOutOfStock = item.stok === 0;
                  const isLowStock =
                    item.stok > 0 && item.stok <= item.stok_minimum;
                  const marginRp = item.harga_jual - item.harga_beli;
                  const marginPct =
                    item.harga_jual > 0
                      ? ((marginRp / item.harga_jual) * 100).toFixed(0)
                      : 0;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F7F7F7] transition-colors"
                    >
                      {/* Product image & title */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-[#F7F7F7] overflow-hidden shrink-0 relative border border-[#E5E5E5]">
                            {item.gambar_url ? (
                              <Image
                                src={item.gambar_url}
                                alt={item.nama_barang}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <span className="font-mono font-bold text-[#0064D2]">
                              {item.kode_sku}
                            </span>
                            <div className="font-medium text-[#191919] max-w-xs truncate">
                              {item.nama_barang}
                            </div>
                            <span className="text-[10px] text-[#707070]">
                              Brand: {item.brand || "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[#707070]">
                        {item.kategori}
                      </td>

                      {/* Rack location badge */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#191919] font-mono text-[11px]">
                          <MapPin className="w-3 h-3 text-[#F5AF02]" />
                          {item.lokasi_rak}
                        </span>
                      </td>

                      {/* Cost price HPP */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-[#707070]">
                        {formatRupiah(item.harga_beli)}
                      </td>

                      {/* Selling price & profit margin */}
                      <td className="py-3 px-3 text-right font-mono">
                        <div className="font-bold text-[#191919]">
                          {formatRupiah(item.harga_jual)}
                        </div>
                        <div className="text-[10px] text-[#86B817]">
                          +{formatRupiah(marginRp)} ({marginPct}%)
                        </div>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3 px-3 text-center font-mono">
                        <span className="text-sm font-bold text-[#191919]">
                          {item.stok}
                        </span>
                        <span className="text-[10px] text-[#707070] ml-1">
                          {item.satuan}
                        </span>
                        <div className="text-[10px] text-[#707070]">
                          Min: {item.stok_minimum}
                        </div>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="py-3 px-3 text-center">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-[#E53238] font-bold text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            Habis
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-[#E53238] font-bold text-[10px]">
                            <AlertTriangle className="w-3 h-3" />
                            Kritis
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-[#86B817] font-bold text-[10px]">
                            <CheckCircle className="w-3 h-3" />
                            Aman
                          </span>
                        )}
                      </td>

                      {/* Operational Action Buttons */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Restock Inbound button */}
                          <button
                            type="button"
                            onClick={() => setRestockTargetBarang(item)}
                            title="Restock Inbound Masuk Gudang"
                            className="h-7 px-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0064D2] border border-blue-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <ArrowDownToLine className="w-3 h-3" />
                            <span>Inbound</span>
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => setEditTargetBarang(item)}
                            title="Edit Data Barang"
                            className="w-7 h-7 rounded-full bg-[#F7F7F7] hover:bg-[#E5E5E5] text-[#191919] flex items-center justify-center cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => hapusBarang(item.id)}
                            title="Hapus Barang"
                            className="w-7 h-7 rounded-full bg-white hover:bg-red-50 text-[#707070] hover:text-[#E53238] border border-[#E5E5E5] flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
