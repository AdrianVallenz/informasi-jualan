"use client";

import React from "react";
import { usePenjualan } from "../context/PenjualanContext";
import { Printer, CheckCircle, X, Warehouse, MapPin } from "lucide-react";

export default function StrukPenjualanModal() {
  const {
    showStrukModal,
    setShowStrukModal,
    lastCompletedTransaction,
  } = usePenjualan();

  if (!showStrukModal || !lastCompletedTransaction) return null;

  const trx = lastCompletedTransaction;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      {/* Modal Container: Level 3 Shadow */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-lvl3 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Action Bar (Hidden when printing) */}
        <div className="p-4 bg-[#F7F7F7] border-b border-[#E5E5E5] flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#86B817]" />
            <span className="text-sm font-bold text-[#191919]">
              Transaksi Berhasil Disimpan
            </span>
          </div>
          <button
            onClick={() => setShowStrukModal(false)}
            className="w-8 h-8 rounded-full bg-white border border-[#E5E5E5] hover:bg-[#E5E5E5] flex items-center justify-center text-[#707070] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PRINTABLE RECEIPT BODY */}
        <div className="p-6 font-mono text-[#191919] printable-area bg-white text-xs">
          {/* Warehouse Header */}
          <div className="text-center pb-4 border-b border-dashed border-[#191919]">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Warehouse className="w-4 h-4 text-[#0064D2] no-print" />
              <h2 className="text-base font-bold font-sans tracking-tight">
                SIPB WAREHOUSE & LOGISTICS
              </h2>
            </div>
            <p className="text-[11px] text-[#707070]">
              Pusat Distribusi Pergudangan & Penjualan Retail
            </p>
            <p className="text-[10px] text-[#707070]">
              Jl. Kawasan Logistik Pergudangan No. 88, Blok A
            </p>
            <p className="text-[10px] text-[#707070]">Telp: (021) 8899-7700</p>
          </div>

          {/* Meta Info */}
          <div className="py-3 border-b border-dashed border-[#191919] space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>No Faktur:</span>
              <span className="font-bold">{trx.no_faktur}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>{new Date(trx.tanggal).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Kasir:</span>
              <span>{trx.nama_kasir}</span>
            </div>
            <div className="flex justify-between">
              <span>Pelanggan:</span>
              <span className="font-bold">{trx.nama_pelanggan}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-[#191919] space-y-2">
            {trx.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-sans font-medium text-[12px] truncate">
                  {item.nama_barang}
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#707070]">
                  <span>
                    {item.qty} x {formatRupiah(item.harga_jual)}
                  </span>
                  <span className="font-bold text-[#191919]">
                    {formatRupiah(item.subtotal)}
                  </span>
                </div>
                <div className="text-[10px] text-[#707070] flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-[#F5AF02] no-print" />
                  <span>Ambil di: {item.lokasi_rak}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Totals */}
          <div className="py-3 border-b border-dashed border-[#191919] space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(trx.subtotal)}</span>
            </div>
            {trx.diskon > 0 && (
              <div className="flex justify-between text-[#86B817]">
                <span>Potongan Diskon:</span>
                <span>-{formatRupiah(trx.diskon)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-1 border-t border-dotted border-[#191919]">
              <span>TOTAL BAYAR:</span>
              <span>{formatRupiah(trx.total_bayar)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span>Metode Bayar:</span>
              <span>{trx.metode_bayar}</span>
            </div>
            <div className="flex justify-between">
              <span>Uang Diterima:</span>
              <span>{formatRupiah(trx.uang_diterima)}</span>
            </div>
            <div className="flex justify-between">
              <span>Kembalian:</span>
              <span>{formatRupiah(trx.uang_kembalian)}</span>
            </div>
          </div>

          {/* Footer Receipt Note */}
          <div className="pt-4 text-center text-[10px] text-[#707070] space-y-1">
            <p>Terima kasih atas kunjungan & transaksi Anda.</p>
            <p>Barang yang sudah dibeli dapat ditukar maksimal 2x24 jam</p>
            <p>dengan menyertakan struk asli kasir gudang.</p>
          </div>
        </div>

        {/* Action Buttons (Hidden when printing) */}
        <div className="p-4 bg-[#F7F7F7] border-t border-[#E5E5E5] flex items-center gap-3 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 h-10 px-5 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk Pembeli</span>
          </button>
          <button
            type="button"
            onClick={() => setShowStrukModal(false)}
            className="h-10 px-5 rounded-full bg-white hover:bg-[#E5E5E5] border border-[#E5E5E5] text-[#191919] text-xs font-bold cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
