"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePenjualan } from "../context/PenjualanContext";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  CreditCard,
  QrCode,
  Banknote,
  Search,
  User,
  AlertCircle,
  Receipt,
  MapPin,
} from "lucide-react";

export default function KasirPosView() {
  const {
    barangList,
    pelangganList,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    checkoutTransaksi,
    currentUser,
  } = usePenjualan();

  const [selectedPelangganId, setSelectedPelangganId] = useState(
    pelangganList[0]?.id || ""
  );
  const [metodeBayar, setMetodeBayar] = useState("Tunai");
  const [uangDiterima, setUangDiterima] = useState("");
  const [catatan, setCatatan] = useState("");
  const [posSearch, setPosSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const activePelanggan =
    pelangganList.find((p) => p.id === selectedPelangganId) || pelangganList[0];

  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const diskonPersen = activePelanggan?.diskon_khusus || 0;
  const diskonNominal = (subtotal * diskonPersen) / 100;
  const totalBayar = Math.max(0, subtotal - diskonNominal);

  const numericUangDiterima = Number(uangDiterima) || 0;
  const uangKembalian =
    metodeBayar === "Tunai" && numericUangDiterima >= totalBayar
      ? numericUangDiterima - totalBayar
      : 0;

  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Quick cash buttons
  const quickCashAmounts = [
    { label: "Uang Pas", value: totalBayar },
    { label: "50 Ribu", value: 50000 },
    { label: "100 Ribu", value: 100000 },
    { label: "200 Ribu", value: 200000 },
    { label: "500 Ribu", value: 500000 },
  ];

  // Filtered goods for POS quick lookup
  const filteredBarang = barangList.filter((item) => {
    if (!posSearch.trim()) return true;
    const query = posSearch.toLowerCase();
    return (
      item.nama_barang.toLowerCase().includes(query) ||
      item.kode_sku.toLowerCase().includes(query) ||
      item.lokasi_rak.toLowerCase().includes(query)
    );
  });

  const handleCheckout = () => {
    setErrorMessage("");

    if (cart.length === 0) {
      setErrorMessage("Pilih minimal satu barang untuk checkout!");
      return;
    }

    if (metodeBayar === "Tunai" && numericUangDiterima < totalBayar) {
      setErrorMessage(
        `Uang tunai yang diterima kurang sebesar ${formatRupiah(
          totalBayar - numericUangDiterima
        )}!`
      );
      return;
    }

    const res = checkoutTransaksi({
      pelanggan: activePelanggan,
      metodeBayar,
      diskonNominal,
      uangDiterima: numericUangDiterima || totalBayar,
      catatan,
    });

    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setUangDiterima("");
      setCatatan("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Fast Item Lookup & Grid (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Search & Scan SKU Bar */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-base font-bold text-[#191919]">
              Pilih Barang dari Gudang (Scan / Cari)
            </h2>
          </div>
          <div className="relative">
            <input
              type="text"
              value={posSearch}
              onChange={(e) => setPosSearch(e.target.value)}
              placeholder="Ketik nama produk, kode SKU (misal: WH-ELC-001), atau rak..."
              className="w-full h-11 px-4 pl-10 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5] text-sm text-[#191919] placeholder-[#707070] focus:outline-none focus:bg-white focus:border-[#0064D2] focus:ring-1 focus:ring-[#0064D2] transition-all"
            />
            <Search className="w-4 h-4 text-[#707070] absolute left-3.5 top-3.5" />
            {posSearch && (
              <button
                onClick={() => setPosSearch("")}
                className="absolute right-3 top-3 text-xs text-[#707070] hover:text-[#191919]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Quick Item Selection List */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-4 shadow-sm">
          <div className="max-h-[560px] overflow-y-auto space-y-2 pr-1">
            {filteredBarang.map((barang) => {
              const inCart = cart.find((c) => c.id === barang.id);
              const isOutOfStock = barang.stok === 0;

              return (
                <div
                  key={barang.id}
                  onClick={() => !isOutOfStock && addToCart(barang, 1)}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isOutOfStock
                      ? "bg-gray-50 border-[#E5E5E5] opacity-60 cursor-not-allowed"
                      : inCart
                      ? "bg-blue-50/50 border-[#0064D2] shadow-xs"
                      : "bg-white border-[#E5E5E5] hover:border-[#0064D2] hover:bg-[#F7F7F7]"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-md bg-[#F7F7F7] overflow-hidden shrink-0 relative border border-[#E5E5E5]">
                      {barang.gambar_url ? (
                        <Image
                          src={barang.gambar_url}
                          alt={barang.nama_barang}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-[#707070]">
                          {barang.kode_sku}
                        </span>
                        <span className="text-[10px] font-mono bg-gray-100 text-[#191919] px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-[#F5AF02]" />
                          {barang.lokasi_rak}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-medium text-[#191919] truncate">
                        {barang.nama_barang}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#191919] font-mono">
                          {formatRupiah(barang.harga_jual)}
                        </span>
                        <span
                          className={`text-[11px] font-mono font-medium ${
                            barang.stok <= barang.stok_minimum
                              ? "text-[#E53238]"
                              : "text-[#86B817]"
                          }`}
                        >
                          Stok: {barang.stok} {barang.satuan}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {inCart ? (
                      <span className="h-8 px-3 rounded-full bg-[#0064D2] text-white text-xs font-mono font-bold flex items-center justify-center">
                        {inCart.qty} di keranjang
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        className={`h-8 px-3 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
                          isOutOfStock
                            ? "bg-[#E5E5E5] text-[#707070]"
                            : "bg-white border border-[#0064D2] text-[#0064D2] hover:bg-[#0064D2] hover:text-white"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Pilih</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Cart & Checkout Terminal (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-5 shadow-lvl2 sticky top-24">
          {/* Header Cart */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#0064D2]" />
              <h2 className="text-base font-bold text-[#191919]">
                Keranjang Kasir
              </h2>
              <span className="text-xs font-mono font-bold bg-blue-50 text-[#0064D2] px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.qty, 0)} Item
              </span>
            </div>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-[#E53238] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Kosongkan
              </button>
            )}
          </div>

          {/* Select Customer */}
          <div className="py-3 border-b border-[#E5E5E5]">
            <label className="block text-xs font-medium text-[#707070] mb-1">
              Pelanggan / Mitra Pembeli:
            </label>
            <div className="relative">
              <select
                value={selectedPelangganId}
                onChange={(e) => setSelectedPelangganId(e.target.value)}
                className="w-full h-10 px-3 pl-8 rounded-lg border border-[#E5E5E5] text-xs sm:text-sm text-[#191919] bg-[#F7F7F7] focus:bg-white focus:border-[#0064D2] focus:outline-none"
              >
                {pelangganList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.tipe} {p.diskon_khusus > 0 ? `- Diskon ${p.diskon_khusus}%` : ""})
                  </option>
                ))}
              </select>
              <User className="w-4 h-4 text-[#707070] absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="py-3 max-h-60 overflow-y-auto space-y-2 border-b border-[#E5E5E5] pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#707070]">
                Keranjang masih kosong. Klik barang di sebelah kiri untuk menambah ke transaksi.
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-medium text-[#191919] truncate">
                      {item.nama_barang}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-[#707070]">
                      <span className="font-mono">{formatRupiah(item.harga_jual)}</span>
                      <span>•</span>
                      <span className="font-mono text-[#F5AF02]">
                        {item.lokasi_rak}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Controller (Pill Shape) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => updateCartQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] hover:border-[#0064D2] flex items-center justify-center text-xs font-bold text-[#191919] cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-mono font-bold text-xs text-[#191919]">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] hover:border-[#0064D2] flex items-center justify-center text-xs font-bold text-[#191919] cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-7 h-7 ml-1 rounded-full bg-white text-[#707070] hover:text-[#E53238] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="py-3 border-b border-[#E5E5E5] space-y-1.5 text-xs">
            <div className="flex justify-between text-[#707070]">
              <span>Subtotal Barang:</span>
              <span className="font-mono font-semibold text-[#191919]">
                {formatRupiah(subtotal)}
              </span>
            </div>
            {diskonNominal > 0 && (
              <div className="flex justify-between text-[#86B817]">
                <span>Diskon Mitra ({diskonPersen}%):</span>
                <span className="font-mono font-bold">
                  -{formatRupiah(diskonNominal)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-[#E5E5E5]">
              <span className="text-sm font-bold text-[#191919]">Total Tagihan:</span>
              <span className="text-xl font-bold font-mono text-[#0064D2]">
                {formatRupiah(totalBayar)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="py-3 border-b border-[#E5E5E5]">
            <label className="block text-xs font-semibold text-[#707070] uppercase tracking-wider mb-2">
              Metode Pembayaran:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "Tunai", label: "Tunai", icon: Banknote },
                { id: "QRIS", label: "QRIS", icon: QrCode },
                { id: "Transfer Bank", label: "Transfer", icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = metodeBayar === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMetodeBayar(m.id)}
                    className={`h-9 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#0064D2] text-white shadow-xs"
                        : "bg-[#F7F7F7] text-[#191919] border border-[#E5E5E5] hover:bg-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Calculator (If Tunai) */}
          {metodeBayar === "Tunai" && (
            <div className="py-3 border-b border-[#E5E5E5] space-y-2">
              <label className="block text-xs font-medium text-[#191919]">
                Nominal Uang Diterima:
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={uangDiterima}
                  onChange={(e) => setUangDiterima(e.target.value)}
                  placeholder="0"
                  className="w-full h-10 px-3 pl-10 rounded-lg border border-[#E5E5E5] text-sm font-mono font-bold text-[#191919] bg-white focus:outline-none focus:border-[#0064D2]"
                />
                <span className="absolute left-3 top-2.5 text-xs font-mono font-bold text-[#707070]">
                  Rp
                </span>
              </div>

              {/* Quick Cash Suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {quickCashAmounts.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => setUangDiterima(q.value)}
                    className="h-6 px-2 rounded bg-[#F7F7F7] hover:bg-[#E5E5E5] border border-[#E5E5E5] text-[11px] font-mono text-[#191919] cursor-pointer"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Kembalian Display */}
              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-green-900">Uang Kembalian:</span>
                <span className="text-sm font-bold font-mono text-[#86B817]">
                  {formatRupiah(uangKembalian)}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="my-2 p-2.5 rounded-lg bg-red-50 border border-[#E53238]/30 flex items-center gap-1.5 text-xs text-[#E53238] font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Checkout CTA Button: Pill Button 40px height, 9999px radius, font 700 */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full h-11 px-6 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                cart.length === 0
                  ? "bg-[#E5E5E5] text-[#707070] cursor-not-allowed"
                  : "bg-[#0064D2] hover:bg-[#004FB3] text-white"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Proses Transaksi & Cetak Struk</span>
            </button>
            <p className="text-[11px] text-center text-[#707070] mt-2">
              Operator Kasir: <span className="font-bold text-[#191919]">{currentUser?.nama_lengkap}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
