"use client";

import React, { useState } from "react";
import { usePenjualan } from "../context/PenjualanContext";
import { X, Save, Edit3, MapPin } from "lucide-react";

function EditBarangForm({ item, onCancel, onSave, kategoriList }) {
  const [formData, setFormData] = useState({
    nama_barang: item.nama_barang || "",
    kategori: item.kategori || "Elektronik & Audio",
    brand: item.brand || "",
    harga_beli: item.harga_beli || 0,
    harga_jual: item.harga_jual || 0,
    harga_coret: item.harga_coret || 0,
    diskon_persen: item.diskon_persen || 0,
    stok_minimum: item.stok_minimum || 5,
    satuan: item.satuan || "Unit",
    lokasi_rak: item.lokasi_rak || "Rak A-01",
    deskripsi: item.deskripsi || "",
    gambar_url: item.gambar_url || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, {
      ...formData,
      harga_beli: Number(formData.harga_beli) || 0,
      harga_jual: Number(formData.harga_jual) || 0,
      harga_coret: Number(formData.harga_coret) || 0,
      stok_minimum: Number(formData.stok_minimum) || 5,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
      <div>
        <label className="block text-xs font-semibold text-[#191919] mb-1">
          Nama Barang
        </label>
        <input
          type="text"
          name="nama_barang"
          required
          value={formData.nama_barang}
          onChange={handleChange}
          className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-sm text-[#191919] focus:outline-none focus:border-[#0064D2]"
        />
      </div>

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
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#191919] mb-1">
            Satuan
          </label>
          <input
            type="text"
            name="satuan"
            value={formData.satuan}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#F7F7F7] rounded-lg border border-[#E5E5E5]">
        <div>
          <label className="block text-xs font-bold text-[#191919] mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#F5AF02]" />
            Alokasi Rak Gudang
          </label>
          <input
            type="text"
            name="lokasi_rak"
            required
            value={formData.lokasi_rak}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] font-mono text-xs text-[#191919] bg-white focus:outline-none focus:border-[#0064D2]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#191919] mb-1">
            Safety Stock Minimum
          </label>
          <input
            type="number"
            name="stok_minimum"
            required
            min="1"
            value={formData.stok_minimum}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] font-mono text-xs text-[#191919] bg-white focus:outline-none focus:border-[#0064D2]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#707070] mb-1">
            Harga Modal Beli (HPP)
          </label>
          <input
            type="number"
            name="harga_beli"
            required
            min="0"
            value={formData.harga_beli}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] font-mono text-sm text-[#191919] focus:outline-none focus:border-[#0064D2]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#0064D2] mb-1">
            Harga Jual Kasir
          </label>
          <input
            type="number"
            name="harga_jual"
            required
            min="0"
            value={formData.harga_jual}
            onChange={handleChange}
            className="w-full h-10 px-3 rounded-lg border border-[#0064D2] font-mono font-bold text-sm text-[#0064D2] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#191919] mb-1">
          URL Foto Produk
        </label>
        <input
          type="url"
          name="gambar_url"
          value={formData.gambar_url}
          onChange={handleChange}
          className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
        />
      </div>

      <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 px-4 rounded-full bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] text-[#191919] text-xs font-bold cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          className="h-10 px-6 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan</span>
        </button>
      </div>
    </form>
  );
}

export default function EditBarangModal() {
  const { editTargetBarang, setEditTargetBarang, updateBarang, kategoriList } =
    usePenjualan();

  if (!editTargetBarang) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lvl3 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-[#F7F7F7] border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#0064D2]" />
            <h3 className="text-base font-bold text-[#191919]">
              Edit Data Barang ({editTargetBarang.kode_sku})
            </h3>
          </div>
          <button
            onClick={() => setEditTargetBarang(null)}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E5E5] hover:bg-[#E5E5E5] flex items-center justify-center text-[#707070] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <EditBarangForm
          key={editTargetBarang.id}
          item={editTargetBarang}
          kategoriList={kategoriList}
          onCancel={() => setEditTargetBarang(null)}
          onSave={updateBarang}
        />
      </div>
    </div>
  );
}
