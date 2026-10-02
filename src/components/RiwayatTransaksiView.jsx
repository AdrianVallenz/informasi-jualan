"use client";

import React, { useState } from "react";
import { usePenjualan } from "../context/PenjualanContext";
import {
  History,
  Download,
  Printer,
  Search,
  Filter,
  CreditCard,
  Banknote,
  QrCode,
  Calendar,
} from "lucide-react";

export default function RiwayatTransaksiView() {
  const {
    transaksiList,
    currentUser,
    setLastCompletedTransaction,
    setShowStrukModal,
  } = usePenjualan();

  const isAdmin = currentUser?.role === "admin";
  const [filterPeriod, setFilterPeriod] = useState("semua");
  const [searchInvoice, setSearchInvoice] = useState("");

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Filter transactions
  const displayedTransactions = transaksiList.filter((trx) => {
    // If not admin, kasir only sees their own transactions
    if (!isAdmin && trx.kasir_id !== currentUser?.id) {
      return false;
    }

    // Search query match
    if (searchInvoice.trim()) {
      const q = searchInvoice.toLowerCase();
      const matchNo = trx.no_faktur.toLowerCase().includes(q);
      const matchCust = trx.nama_pelanggan.toLowerCase().includes(q);
      const matchKasir = trx.nama_kasir.toLowerCase().includes(q);
      if (!matchNo && !matchCust && !matchKasir) return false;
    }

    // Period match
    if (filterPeriod !== "semua") {
      const now = new Date();
      const trxDate = new Date(trx.tanggal);
      if (filterPeriod === "hari_ini") {
        return (
          trxDate.getDate() === now.getDate() &&
          trxDate.getMonth() === now.getMonth() &&
          trxDate.getFullYear() === now.getFullYear()
        );
      }
      if (filterPeriod === "7_hari") {
        const diff = (now - trxDate) / (1000 * 60 * 60 * 24);
        return diff <= 7;
      }
    }

    return true;
  });

  const totalOmzetDisplayed = displayedTransactions.reduce(
    (acc, t) => acc + t.total_bayar,
    0
  );

  const handlePrintReceipt = (trx) => {
    setLastCompletedTransaction(trx);
    setShowStrukModal(true);
  };

  const handleExportCSV = () => {
    const headers = [
      "No Faktur",
      "Tanggal",
      "Nama Kasir",
      "Nama Pelanggan",
      "Metode Bayar",
      "Total Item",
      "Total Bayar",
      "Total HPP Modal",
      "Laba Kotor",
    ];

    const rows = displayedTransactions.map((t) => [
      t.no_faktur,
      new Date(t.tanggal).toLocaleString("id-ID"),
      t.nama_kasir,
      t.nama_pelanggan,
      t.metode_bayar,
      t.total_item,
      t.total_bayar,
      t.total_hpp || 0,
      t.laba_kotor || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Riwayat_Penjualan_SIPB_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-[#0064D2]" />
              <h2 className="text-xl font-bold text-[#191919]">
                {isAdmin
                  ? "Audit Riwayat Transaksi Toko & Kasir"
                  : "Riwayat Transaksi Shift Kasir Saya"}
              </h2>
            </div>
            <p className="text-xs text-[#707070] mt-1">
              {isAdmin
                ? "Daftar seluruh penjualan keluar dari gudang secara terperinci."
                : "Daftar struk transaksi penjualan yang telah Anda proses hari ini."}
            </p>
          </div>

          {/* Quick Metrics & Export Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-9 px-4 rounded-full bg-blue-50 border border-blue-200 text-[#0064D2] text-xs font-mono font-bold flex items-center gap-1.5">
              <span>Total Omzet:</span>
              <span className="text-sm">{formatRupiah(totalOmzetDisplayed)}</span>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="h-9 px-4 rounded-full bg-white hover:bg-[#F7F7F7] border border-[#E5E5E5] text-xs font-bold text-[#191919] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0064D2]" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Period Filter Chips */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none">
            <span className="text-xs text-[#707070] font-medium mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Periode:
            </span>
            {[
              { id: "semua", label: "Semua" },
              { id: "hari_ini", label: "Hari Ini" },
              { id: "7_hari", label: "7 Hari Terakhir" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setFilterPeriod(p.id)}
                className={`h-7 px-3 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  filterPeriod === p.id
                    ? "bg-[#0064D2] text-white font-bold"
                    : "bg-[#F7F7F7] text-[#191919] border border-[#E5E5E5] hover:bg-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Search by Invoice */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoice(e.target.value)}
              placeholder="Cari no faktur / pelanggan..."
              className="w-full h-9 px-3 pl-8 rounded-full bg-[#F7F7F7] border border-[#E5E5E5] text-xs text-[#191919] focus:bg-white focus:border-[#0064D2] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#707070] absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F7F7] border-b border-[#E5E5E5] text-[#707070] font-semibold">
                <th className="py-3 px-4">No. Faktur</th>
                <th className="py-3 px-4">Waktu Transaksi</th>
                <th className="py-3 px-4">Kasir</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4 text-center">Items</th>
                <th className="py-3 px-4 text-right">Total Bayar</th>
                {isAdmin && <th className="py-3 px-4 text-right">Laba Kotor</th>}
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E5E5]">
              {displayedTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 9 : 8}
                    className="py-12 text-center text-[#707070]"
                  >
                    Belum ada riwayat transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                displayedTransactions.map((trx) => (
                  <tr
                    key={trx.id}
                    className="hover:bg-[#F7F7F7] transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#0064D2]">
                      {trx.no_faktur}
                    </td>
                    <td className="py-3 px-4 text-[#707070]">
                      {new Date(trx.tanggal).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#191919]">
                      {trx.nama_kasir}
                    </td>
                    <td className="py-3 px-4 text-[#191919]">
                      <span className="font-medium">{trx.nama_pelanggan}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[#191919] font-medium text-[11px]">
                        {trx.metode_bayar === "Tunai" && (
                          <Banknote className="w-3 h-3 text-[#86B817]" />
                        )}
                        {trx.metode_bayar === "QRIS" && (
                          <QrCode className="w-3 h-3 text-[#0064D2]" />
                        )}
                        {trx.metode_bayar === "Transfer Bank" && (
                          <CreditCard className="w-3 h-3 text-[#F5AF02]" />
                        )}
                        {trx.metode_bayar}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {trx.total_item}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#191919]">
                      {formatRupiah(trx.total_bayar)}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#86B817]">
                        +{formatRupiah(trx.laba_kotor)}
                      </td>
                    )}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handlePrintReceipt(trx)}
                        className="h-7 px-3 rounded-full bg-white border border-[#E5E5E5] hover:border-[#0064D2] hover:text-[#0064D2] text-[#191919] text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Cetak Struk</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
