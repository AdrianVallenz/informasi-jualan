"use client";

import React, { useState } from "react";
import { usePenjualan } from "../context/PenjualanContext";
import {
  FileSpreadsheet,
  Printer,
  TrendingUp,
  DollarSign,
  Package,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  Warehouse,
  PieChart,
  Layers,
  ArrowUpRight,
  MapPin,
} from "lucide-react";

export default function LaporanAdminView() {
  const {
    getLaporanPenjualan,
    getLaporanLabaRugi,
    getLaporanStokGudang,
    getLaporanTop5Terlaris,
    currentUser,
    barangList,
  } = usePenjualan();

  // Active subtab: 'penjualan' | 'laba_rugi' | 'stok' | 'terlaris'
  const [activeReportTab, setActiveReportTab] = useState("penjualan");
  const [selectedPeriod, setSelectedPeriod] = useState("semua");

  // Print Preview state
  const [isPrintMode, setIsPrintMode] = useState(false);

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const salesData = getLaporanPenjualan(selectedPeriod);
  const profitData = getLaporanLabaRugi(selectedPeriod);
  const stockData = getLaporanStokGudang();
  const top5Data = getLaporanTop5Terlaris();

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card (Hidden on print) */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#0064D2]" />
              <h2 className="text-xl font-bold text-[#191919]">
                Pusat Laporan & Cetak Dokumen Eksekutif
              </h2>
            </div>
            <p className="text-xs text-[#707070] mt-1">
              Akses komprehensif laporan penjualan, analisis laba rugi, valuasi persediaan stok gudang, dan barang terlaris.
            </p>
          </div>

          {/* Action Print Button: Pill Button 40px height, 9999px radius */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTriggerPrint}
              className="h-10 px-6 rounded-full bg-[#0064D2] hover:bg-[#004FB3] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan Ini (PDF / Print)</span>
            </button>
          </div>
        </div>

        {/* Subtab Navigation & Period Filter (28px chips) */}
        <div className="mt-5 pt-4 border-t border-[#E5E5E5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Report Subtabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: "penjualan", label: "Laporan Penjualan", icon: TrendingUp },
              { id: "laba_rugi", label: "Laporan Laba & Rugi", icon: DollarSign },
              { id: "stok", label: "Valuasi Stok Gudang", icon: Package },
              { id: "terlaris", label: "Top 5 Barang Terlaris", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeReportTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveReportTab(tab.id)}
                  className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#0064D2] text-white shadow-xs"
                      : "bg-[#F7F7F7] text-[#191919] hover:bg-[#E5E5E5]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Period Filter (If applicable to report) */}
          {["penjualan", "laba_rugi"].includes(activeReportTab) && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-[#707070] font-medium mr-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Periode:
              </span>
              {[
                { id: "semua", label: "Semua" },
                { id: "hari_ini", label: "Hari Ini" },
                { id: "7_hari", label: "7 Hari" },
                { id: "bulan_ini", label: "Bulan Ini" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPeriod(p.id)}
                  className={`h-7 px-3 rounded-full text-xs font-medium cursor-pointer transition-all ${
                    selectedPeriod === p.id
                      ? "bg-[#191919] text-white font-bold"
                      : "bg-[#F7F7F7] text-[#707070] hover:text-[#191919]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PRINTABLE REPORT DOCUMENT CONTAINER */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 sm:p-8 shadow-sm printable-area">
        {/* OFFICIAL LETTERHEAD (Visible both on screen and on print) */}
        <div className="border-b-2 border-[#191919] pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Warehouse className="w-6 h-6 text-[#0064D2]" />
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#191919]">
                  SIPB WAREHOUSE & DISTRIBUTION
                </h1>
              </div>
              <p className="text-xs text-[#707070] mt-0.5">
                Sistem Manajemen Pergudangan, Inventaris, dan Penjualan Terpadu
              </p>
              <p className="text-[11px] text-[#707070]">
                Jl. Kawasan Industri Pergudangan No. 88 | Telp: (021) 8899-7700 | Email: contact@sipb-warehouse.co.id
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs text-[#191919] space-y-0.5">
              <div className="font-bold text-sm text-[#0064D2]">
                {activeReportTab === "penjualan" && "DOKUMEN: LAPORAN PENJUALAN TOKO"}
                {activeReportTab === "laba_rugi" && "DOKUMEN: LAPORAN LABA & RUGI (HPP)"}
                {activeReportTab === "stok" && "DOKUMEN: LAPORAN VALUASI & AUDIT STOK"}
                {activeReportTab === "terlaris" && "DOKUMEN: LAPORAN BARANG TERLARIS (TOP 5)"}
              </div>
              <div className="text-[#707070]">
                No: RPT-WH-{new Date().getFullYear()}{String(new Date().getMonth() + 1).padStart(2, "0")}-00
                {activeReportTab === "penjualan" ? "1" : activeReportTab === "laba_rugi" ? "2" : activeReportTab === "stok" ? "3" : "4"}
              </div>
              <div className="text-[#707070]">
                Tanggal Cetak: {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
              </div>
              <div className="text-[#707070]">
                Dicetak Oleh: <b className="text-[#191919]">{currentUser?.nama_lengkap} (Admin)</b>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SUBTAB 1: LAPORAN PENJUALAN                              */}
        {/* ======================================================== */}
        {activeReportTab === "penjualan" && (
          <div className="space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <span className="text-xs text-[#707070]">Total Omzet Penjualan:</span>
                <div className="text-xl font-bold font-mono text-[#0064D2] mt-1">
                  {formatRupiah(salesData.totalOmzet)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5]">
                <span className="text-xs text-[#707070]">Total Transaksi:</span>
                <div className="text-xl font-bold font-mono text-[#191919] mt-1">
                  {salesData.totalTransaksi} Faktur
                </div>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5]">
                <span className="text-xs text-[#707070]">Barang Terjual:</span>
                <div className="text-xl font-bold font-mono text-[#191919] mt-1">
                  {salesData.totalItemTerjual} Unit Fisik
                </div>
              </div>
              <div className="p-4 rounded-xl bg-green-50/50 border border-green-200">
                <span className="text-xs text-[#707070]">Rata-Rata Belanja:</span>
                <div className="text-xl font-bold font-mono text-[#86B817] mt-1">
                  {formatRupiah(salesData.rataRataTransaksi)}
                </div>
              </div>
            </div>

            {/* Breakdown Methods & Cashiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7]">
                <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider mb-2">
                  Penjualan Berdasarkan Metode Bayar:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(salesData.metodeBreakdown).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-[#E5E5E5] last:border-0">
                      <span className="text-[#707070]">{k}:</span>
                      <span className="font-mono font-bold text-[#191919]">{formatRupiah(v)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7]">
                <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider mb-2">
                  Performa Transaksi Kasir:
                </h4>
                <div className="space-y-1.5 text-xs">
                  {Object.entries(salesData.kasirBreakdown).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-[#E5E5E5] last:border-0">
                      <span className="text-[#707070]">{k}:</span>
                      <span className="font-mono font-bold text-[#191919]">{formatRupiah(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales Invoices Table */}
            <div>
              <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider mb-3">
                Rincian Transaksi Penjualan ({salesData.list.length} Data):
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs border border-[#E5E5E5]">
                  <thead>
                    <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#191919] font-bold">
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">No. Faktur</th>
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">Tanggal</th>
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">Kasir</th>
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">Pelanggan</th>
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">Metode</th>
                      <th className="py-2.5 px-3 text-center border-r border-[#E5E5E5]">Item</th>
                      <th className="py-2.5 px-3 text-right">Total Bayar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {salesData.list.map((trx) => (
                      <tr key={trx.id}>
                        <td className="py-2 px-3 font-mono font-bold text-[#0064D2] border-r border-[#E5E5E5]">
                          {trx.no_faktur}
                        </td>
                        <td className="py-2 px-3 text-[#707070] border-r border-[#E5E5E5]">
                          {new Date(trx.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-2 px-3 border-r border-[#E5E5E5]">{trx.nama_kasir}</td>
                        <td className="py-2 px-3 border-r border-[#E5E5E5] font-medium">{trx.nama_pelanggan}</td>
                        <td className="py-2 px-3 border-r border-[#E5E5E5]">{trx.metode_bayar}</td>
                        <td className="py-2 px-3 text-center font-mono border-r border-[#E5E5E5]">{trx.total_item}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#191919]">
                          {formatRupiah(trx.total_bayar)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#F7F7F7] font-bold border-t-2 border-[#191919]">
                      <td colSpan={6} className="py-3 px-3 text-right border-r border-[#E5E5E5]">
                        TOTAL KESELURUHAN OMZET:
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm text-[#0064D2]">
                        {formatRupiah(salesData.totalOmzet)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 2: LAPORAN LABA & RUGI (PROFIT & LOSS)            */}
        {/* ======================================================== */}
        {activeReportTab === "laba_rugi" && (
          <div className="space-y-6">
            {/* P&L Financial Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <span className="text-xs text-[#707070]">Pendapatan Penjualan:</span>
                <div className="text-xl font-bold font-mono text-[#0064D2] mt-1">
                  {formatRupiah(profitData.totalOmzet)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-[#E5E5E5]">
                <span className="text-xs text-[#707070]">Harga Pokok Penjualan (HPP):</span>
                <div className="text-xl font-bold font-mono text-[#707070] mt-1">
                  {formatRupiah(profitData.totalHpp)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <span className="text-xs text-green-800">Laba Kotor (Gross Profit):</span>
                <div className="text-xl font-bold font-mono text-[#86B817] mt-1">
                  +{formatRupiah(profitData.totalLaba)}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <span className="text-xs text-green-800">Margin Laba Rata-rata:</span>
                <div className="text-xl font-bold font-mono text-[#86B817] mt-1">
                  {profitData.marginPersen}%
                </div>
              </div>
            </div>

            {/* Profit Margin Breakdown per Category Table */}
            <div>
              <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider mb-3">
                Rincian Laba & Margin per Kategori Barang:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs border border-[#E5E5E5]">
                  <thead>
                    <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#191919] font-bold">
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">Kategori Barang</th>
                      <th className="py-2.5 px-3 text-center border-r border-[#E5E5E5]">Qty Terjual</th>
                      <th className="py-2.5 px-3 text-right border-r border-[#E5E5E5]">Omzet Penjualan</th>
                      <th className="py-2.5 px-3 text-right border-r border-[#E5E5E5]">HPP Modal</th>
                      <th className="py-2.5 px-3 text-right border-r border-[#E5E5E5]">Laba Bersih Kotor</th>
                      <th className="py-2.5 px-3 text-center">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {Object.entries(profitData.kategoriProfit).map(([kat, d]) => {
                      const pct = d.omzet > 0 ? ((d.laba / d.omzet) * 100).toFixed(1) : 0;
                      return (
                        <tr key={kat}>
                          <td className="py-2 px-3 font-bold text-[#191919] border-r border-[#E5E5E5]">{kat}</td>
                          <td className="py-2 px-3 text-center font-mono border-r border-[#E5E5E5]">{d.qty}</td>
                          <td className="py-2 px-3 text-right font-mono border-r border-[#E5E5E5]">{formatRupiah(d.omzet)}</td>
                          <td className="py-2 px-3 text-right font-mono text-[#707070] border-r border-[#E5E5E5]">{formatRupiah(d.hpp)}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-[#86B817] border-r border-[#E5E5E5]">+{formatRupiah(d.laba)}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-[#86B817]">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#F7F7F7] font-bold border-t-2 border-[#191919]">
                      <td className="py-3 px-3 border-r border-[#E5E5E5]">TOTAL FINANSIAL</td>
                      <td className="py-3 px-3 text-center font-mono border-r border-[#E5E5E5]">{salesData.totalItemTerjual}</td>
                      <td className="py-3 px-3 text-right font-mono text-[#0064D2] border-r border-[#E5E5E5]">{formatRupiah(profitData.totalOmzet)}</td>
                      <td className="py-3 px-3 text-right font-mono text-[#707070] border-r border-[#E5E5E5]">{formatRupiah(profitData.totalHpp)}</td>
                      <td className="py-3 px-3 text-right font-mono text-[#86B817] border-r border-[#E5E5E5]">+{formatRupiah(profitData.totalLaba)}</td>
                      <td className="py-3 px-3 text-center font-mono text-[#86B817]">{profitData.marginPersen}%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 3: LAPORAN STOK & VALUASI PERSEDIAAN GUDANG       */}
        {/* ======================================================== */}
        {activeReportTab === "stok" && (
          <div className="space-y-6">
            {/* Inventory Valuation Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                <span className="text-xs text-[#707070]">Valuasi Aset Modal (HPP):</span>
                <div className="text-xl font-bold font-mono text-[#0064D2] mt-1">
                  {formatRupiah(stockData.totalAsetModal)}
                </div>
                <span className="text-[11px] text-[#707070]">Modal persediaan di rak</span>
              </div>
              <div className="p-4 rounded-xl bg-green-50/50 border border-green-200">
                <span className="text-xs text-[#707070]">Potensi Nilai Jual:</span>
                <div className="text-xl font-bold font-mono text-[#86B817] mt-1">
                  {formatRupiah(stockData.potensiOmzet)}
                </div>
                <span className="text-[11px] text-[#86B817]">
                  Potensi Laba: +{formatRupiah(stockData.potensiOmzet - stockData.totalAsetModal)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5]">
                <span className="text-xs text-[#707070]">Total Unit Fisik Gudang:</span>
                <div className="text-xl font-bold font-mono text-[#191919] mt-1">
                  {stockData.totalUnitFisik} Unit
                </div>
                <span className="text-[11px] text-[#707070]">{stockData.totalSku} SKU Terdaftar</span>
              </div>
              <div className="p-4 rounded-xl bg-red-50/50 border border-red-200">
                <span className="text-xs text-[#E53238] font-bold">Peringatan Safety Stock:</span>
                <div className="text-xl font-bold font-mono text-[#E53238] mt-1">
                  {stockData.stokMenipisCount} Kritis / {stockData.stokHabisCount} Habis
                </div>
                <span className="text-[11px] text-[#E53238]">Perlu order ke supplier</span>
              </div>
            </div>

            {/* Warehouse Stock Audit Table */}
            <div>
              <h4 className="text-xs font-bold text-[#191919] uppercase tracking-wider mb-3">
                Tabel Audit Stock Opname & Alokasi Rak:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs border border-[#E5E5E5]">
                  <thead>
                    <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#191919] font-bold">
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">SKU / Kode</th>
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">Nama Barang</th>
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">Kategori</th>
                      <th className="py-2.5 px-3 border-r border-[#E5E5E5]">Lokasi Rak</th>
                      <th className="py-2.5 px-3 text-center border-r border-[#E5E5E5]">Stok Fisik</th>
                      <th className="py-2.5 px-3 text-right border-r border-[#E5E5E5]">HPP Beli</th>
                      <th className="py-2.5 px-3 text-right border-r border-[#E5E5E5]">Total Nilai Modal</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E5]">
                    {barangList.map((item) => {
                      const isLow = item.stok > 0 && item.stok <= item.stok_minimum;
                      const isOut = item.stok === 0;
                      const assetValue = item.stok * item.harga_beli;

                      return (
                        <tr key={item.id}>
                          <td className="py-2 px-3 font-mono font-bold text-[#0064D2] border-r border-[#E5E5E5]">
                            {item.kode_sku}
                          </td>
                          <td className="py-2 px-3 font-medium text-[#191919] border-r border-[#E5E5E5]">
                            {item.nama_barang}
                          </td>
                          <td className="py-2 px-3 text-[#707070] border-r border-[#E5E5E5]">
                            {item.kategori}
                          </td>
                          <td className="py-2 px-3 font-mono border-r border-[#E5E5E5]">
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#191919]">
                              <MapPin className="w-3 h-3 text-[#F5AF02] no-print" />
                              {item.lokasi_rak}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-bold border-r border-[#E5E5E5]">
                            {item.stok} {item.satuan}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-[#707070] border-r border-[#E5E5E5]">
                            {formatRupiah(item.harga_beli)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-[#191919] border-r border-[#E5E5E5]">
                            {formatRupiah(assetValue)}
                          </td>
                          <td className="py-2 px-3 text-center font-bold">
                            {isOut ? (
                              <span className="text-[#E53238]">HABIS</span>
                            ) : isLow ? (
                              <span className="text-[#E53238]">KRITIS</span>
                            ) : (
                              <span className="text-[#86B817]">AMAN</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#F7F7F7] font-bold border-t-2 border-[#191919]">
                      <td colSpan={4} className="py-3 px-3 text-right border-r border-[#E5E5E5]">
                        TOTAL PERSIS AUDIT FISIK GUDANG:
                      </td>
                      <td className="py-3 px-3 text-center font-mono border-r border-[#E5E5E5]">
                        {stockData.totalUnitFisik} Unit
                      </td>
                      <td className="py-3 px-3 border-r border-[#E5E5E5]"></td>
                      <td className="py-3 px-3 text-right font-mono text-sm text-[#0064D2] border-r border-[#E5E5E5]">
                        {formatRupiah(stockData.totalAsetModal)}
                      </td>
                      <td className="py-3 px-3 text-center text-[#86B817]">VALID</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUBTAB 4: LAPORAN BARANG TERLARIS (TOP 5)                 */}
        {/* ======================================================== */}
        {activeReportTab === "terlaris" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <Award className="w-4 h-4 text-[#F5AF02]" />
                <span>Analisis Perputaran Cepat Barang Gudang (Fast-Moving Analysis)</span>
              </div>
              <p>
                Daftar 5 produk dengan perputaran penjualan tertinggi. Dianjurkan untuk menjaga stok minimum lebih tinggi di rak agar tidak terjadi kekosongan persediaan (stockout).
              </p>
            </div>

            {/* Top 5 Leaderboard Cards */}
            <div className="space-y-3">
              {top5Data.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#E5E5E5] bg-[#F7F7F7] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-sm ${
                        item.rank === 1
                          ? "bg-[#F5AF02] text-white"
                          : item.rank === 2
                          ? "bg-gray-300 text-[#191919]"
                          : item.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-white border border-[#E5E5E5] text-[#191919]"
                      }`}
                    >
                      #{item.rank}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#0064D2]">
                          {item.kode_sku}
                        </span>
                        <span className="text-[10px] text-[#707070] bg-white px-2 py-0.5 rounded-full border border-[#E5E5E5]">
                          {item.kategori}
                        </span>
                        <span className="text-[10px] font-mono text-[#F5AF02] flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" />
                          {item.lokasi_rak}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#191919] mt-0.5">
                        {item.nama_barang}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                    <div>
                      <div className="text-xs text-[#707070]">Kuantitas Terjual:</div>
                      <div className="text-base font-bold font-mono text-[#191919]">
                        {item.terjual || 0} {item.satuan}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-[#707070]">Kontribusi Omzet:</div>
                      <div className="text-base font-bold font-mono text-[#0064D2]">
                        {formatRupiah(item.totalRevenue)}
                      </div>
                    </div>

                    <div className="hidden md:block w-28">
                      <div className="text-[10px] text-[#707070] mb-1">
                        Pangsa Penjualan:
                      </div>
                      <div className="w-full bg-[#E5E5E5] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#0064D2] h-2 rounded-full"
                          style={{ width: `${Math.min(100, item.persentase * 3)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OFFICIAL SIGNATURE FOOTER FOR PRINTED REPORTS */}
        <div className="mt-12 pt-8 border-t border-[#191919] grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-[#707070] mb-16">
              Dibuat & Diverifikasi Oleh:
              <br />
              <b className="text-[#191919]">Penanggung Jawab Gudang / Kasir</b>
            </p>
            <p className="font-bold underline text-[#191919]">
              {currentUser?.nama_lengkap || "Budi Santoso"}
            </p>
            <p className="text-[10px] text-[#707070]">Kepala Operasional SIPB</p>
          </div>

          <div>
            <p className="text-[#707070] mb-16">
              Mengetahui & Menyetujui:
              <br />
              <b className="text-[#191919]">Direktur / Pimpinan Perusahaan</b>
            </p>
            <p className="font-bold underline text-[#191919]">
              ( .................................................. )
            </p>
            <p className="text-[10px] text-[#707070]">Manajemen Pusat Distribusi</p>
          </div>
        </div>
      </div>
    </div>
  );
}
