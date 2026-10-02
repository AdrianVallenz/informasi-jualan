"use client";

import React, { useState } from "react";
import { usePenjualan } from "../context/PenjualanContext";
import { X, ArrowDownToLine, MapPin, Truck, AlertCircle } from "lucide-react";

export default function InboundRestockModal() {
  const { restockTargetBarang, setRestockTargetBarang, restockBarang } =
    usePenjualan();

  const [qtyMasuk, setQtyMasuk] = useState("10");
  const [supplier, setSupplier] = useState("PT Distributor Resmi Indonesia");
  const [noSuratJalan, setNoSuratJalan] = useState("");
  const [catatan, setCatatan] = useState("");

  if (!restockTargetBarang) return null;

  const item = restockTargetBarang;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!qtyMasuk || Number(qtyMasuk) <= 0) {
      alert("Masukkan jumlah stok masuk valid!");
      return;
    }

    restockBarang(item.id, qtyMasuk, supplier, noSuratJalan, catatan);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lvl3 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-[#F7F7F7] border-b border-[#E5E5E5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="w-5 h-5 text-[#0064D2]" />
            <h3 className="text-base font-bold text-[#191919]">
              Inbound Restock Barang Masuk
            </h3>
          </div>
          <button
            onClick={() => setRestockTargetBarang(null)}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E5E5] hover:bg-[#E5E5E5] flex items-center justify-center text-[#707070] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Item summary */}
          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 text-xs">
            <div className="font-mono font-bold text-[#0064D2]">
              {item.kode_sku}
            </div>
            <div className="font-medium text-[#191919] mt-0.5">
              {item.nama_barang}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200/60 text-[#707070]">
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="w-3 h-3 text-[#F5AF02]" />
                {item.lokasi_rak}
              </span>
              <span>
                Stok Saat Ini:{" "}
                <b className="font-mono text-[#191919]">
                  {item.stok} {item.satuan}
                </b>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1">
              Jumlah Kuantitas Masuk Gudang *
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={qtyMasuk}
                onChange={(e) => setQtyMasuk(e.target.value)}
                placeholder="10"
                className="w-full h-10 px-3 pl-10 rounded-lg border border-[#0064D2] font-mono text-base font-bold text-[#0064D2] focus:outline-none"
              />
              <ArrowDownToLine className="w-4 h-4 text-[#0064D2] absolute left-3 top-3" />
            </div>
            <p className="text-[11px] text-[#707070] mt-1">
              Stok baru nantinya menjadi:{" "}
              <b className="font-mono text-[#191919]">
                {item.stok + (Number(qtyMasuk) || 0)} {item.satuan}
              </b>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1">
              Nama Supplier / Vendor Pengirim
            </label>
            <div className="relative">
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                placeholder="Nama Supplier"
                className="w-full h-10 px-3 pl-9 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
              />
              <Truck className="w-4 h-4 text-[#707070] absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1">
              No. Surat Jalan / No. PO Masuk
            </label>
            <input
              type="text"
              value={noSuratJalan}
              onChange={(e) => setNoSuratJalan(e.target.value)}
              placeholder="PO-INB-20261002-..."
              className="w-full h-10 px-3 rounded-lg border border-[#E5E5E5] font-mono text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#191919] mb-1">
              Catatan Inbound
            </label>
            <textarea
              rows={2}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Kondisi barang saat tiba di dock penerimaan..."
              className="w-full p-2.5 rounded-lg border border-[#E5E5E5] text-xs text-[#191919] focus:outline-none focus:border-[#0064D2]"
            />
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setRestockTargetBarang(null)}
              className="h-10 px-4 rounded-full bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-bold text-[#191919] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-10 px-6 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Konfirmasi Masuk Gudang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
