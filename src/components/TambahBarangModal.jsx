"use client";

import React, { useState } from "react";
import { usePenjualan } from "../context/PenjualanContext";
import { X, Plus, Boxes, MapPin, DollarSign } from "lucide-react";

export default function TambahBarangModal() {
  const { showTambahModal, setShowTambahModal, tambahBarang, kategoriList } =
    usePenjualan();

  const [formData, setFormData] = useState({
    kode_sku: "",
    nama_barang: "",
    kategori: "Elektronik & Audio",
    brand: "",
    harga_beli: "",
    harga_jual: "",
    harga_coret: "",
    diskon_persen: 0,
    stok: "",
    stok_minimum: "5",
    satuan: "Unit",
    lokasi_rak: "Rak A-01",
    deskripsi: "",
    gambar_url: "",
  });

  if (!showTambahModal) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.kode_sku.trim() || !formData.nama_barang.trim()) {
      alert("Kode SKU dan Nama Barang wajib diisi!");
      return;
    }

    tambahBarang(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lvl3 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-[#F7F7F7] border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#0064D2]" />
            <h3 className="text-base font-bold text-[#191919]">
              Tambah Master Barang Gudang Baru
            </h3>
          </div>
          <button
            onClick={() => setShowTambahModal(false)}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E5E5] hover:bg-[#E5E5E5] flex items-center justify-center text-[#707070] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: SKU & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1">
                Kode SKU / Barcode *
              </label>
              <input
                type="text"
                name="kode_sku"
                required
                value={formData.kode_sku}
                onChange={handleChange}
                placeholder="contoh: WH-ELC-009"
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] font-mono uppercase text-sm text-[#191919] focus:outline-none focus:border-[#0064D2]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#191919] mb-1">
                Nama Barang Lengkap *
              </label>
              <input
                type="text"
                name="nama_barang"
                required
                value={formData.nama_barang}
                onChange={handleChange}
                placeholder="Nama spesifikasi barang..."
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-sm text-[#191919] focus:outline-none focus:border-[#0064D2]"
              />
            </div>
          </div>

          {/* Row 2: Category, Brand, Satuan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1">
                Kategori
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] bg-[#F7F7F7] focus:bg-white focus:border-[#0064D2]"
              >
                {kategoriList
                  .filter((k) => k !== "Semua")
                  .map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1">
                Brand / Merk
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Merk produk"
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1">
                Satuan Gudang
              </label>
              <select
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] bg-[#F7F7F7] focus:bg-white focus:border-[#0064D2]"
              >
                <option value="Unit">Unit</option>
                <option value="Pcs">Pcs</option>
                <option value="Box">Box</option>
                <option value="Dus">Dus</option>
                <option value="Lusin">Lusin</option>
                <option value="Rol">Rol</option>
                <option value="Set">Set</option>
              </select>
            </div>
          </div>

          {/* Row 3: Rack Location & Stocks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5]">
            <div>
              <label className="block text-xs font-bold text-[#191919] mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#F5AF02]" />
                Lokasi Rak Gudang *
              </label>
              <input
                type="text"
                name="lokasi_rak"
                required
                value={formData.lokasi_rak}
                onChange={handleChange}
                placeholder="misal: Rak A-02"
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] font-mono text-xs text-[#191919] bg-white focus:outline-none focus:border-[#0064D2]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1">
                Stok Awal Fisik *
              </label>
              <input
                type="number"
                name="stok"
                required
                min="0"
                value={formData.stok}
                onChange={handleChange}
                placeholder="0"
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] font-mono text-sm text-[#191919] bg-white focus:outline-none focus:border-[#0064D2]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#191919] mb-1">
                Safety Stock (Min) *
              </label>
              <input
                type="number"
                name="stok_minimum"
                required
                min="1"
                value={formData.stok_minimum}
                onChange={handleChange}
                placeholder="5"
                className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] font-mono text-sm text-[#191919] bg-white focus:outline-none focus:border-[#0064D2]"
              />
            </div>
          </div>

          {/* Row 4: Pricing (HPP Modal vs Selling Price) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#707070] mb-1">
                Harga Modal Beli (HPP) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="harga_beli"
                  required
                  min="0"
                  value={formData.harga_beli}
                  onChange={handleChange}
                  placeholder="Rp 0"
                  className="w-full h-10 px-3 pl-8 rounded-lg border border-[#E5E5E5] font-mono text-sm text-[#191919] focus:outline-none focus:border-[#0064D2]"
                />
                <span className="absolute left-2.5 top-3 text-[11px] font-mono text-[#707070]">
                  Rp
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0064D2] mb-1">
                Harga Jual Kasir *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="harga_jual"
                  required
                  min="0"
                  value={formData.harga_jual}
                  onChange={handleChange}
                  placeholder="Rp 0"
                  className="w-full h-10 px-3 pl-8 rounded-lg border border-[#0064D2] font-mono font-bold text-sm text-[#0064D2] focus:outline-none"
                />
                <span className="absolute left-2.5 top-3 text-[11px] font-mono text-[#0064D2]">
                  Rp
                </span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#707070] mb-1">
                Harga Coret (Jika Diskon)
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="harga_coret"
                  min="0"
                  value={formData.harga_coret}
                  onChange={handleChange}
                  placeholder="Rp 0"
                  className="w-full h-10 px-3 pl-8 rounded-lg border border-[#E5E5E5] font-mono text-sm text-[#707070] focus:outline-none"
                />
                <span className="absolute left-2.5 top-3 text-[11px] font-mono text-[#707070]">
                  Rp
                </span>
              </div>
            </div>
          </div>

          {/* Row 5: Image URL & Description */}
          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1">
              URL Foto Barang
            </label>
            <input
              type="url"
              name="gambar_url"
              value={formData.gambar_url}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1">
              Deskripsi & Catatan Gudang
            </label>
            <textarea
              name="deskripsi"
              rows={2}
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Keterangan spesifikasi teknis barang..."
              className="w-full p-2.5 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
            />
          </div>

          {/* Action Submit */}
          <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowTambahModal(false)}
              className="h-10 px-5 rounded-full bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] text-[#191919] text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Simpan Master Barang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
