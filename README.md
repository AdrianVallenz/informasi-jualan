# 📦 SIPB WAREHOUSE - Sistem Informasi Penjualan Barang Berbasis Warehouse

Aplikasi modern pengelolaan pergudangan, inventaris rak gudang, kasir POS penjualan cepat, dan pusat seluruh laporan bisnis eksekutif siap cetak resmi.

Didesain secara ketat menggunakan **Auction Quad Design System** (palet 4 warna khas: Blue `#0064D2`, Red `#E53238`, Yellow `#F5AF02`, Green `#86B817`, DM Sans & JetBrains Mono).

---

## 🌟 Fitur Utama

### 1. Multi-Role & Keamanan (RBAC)
- **Admin Gudang (`admin` / `admin123`)**:
  - Full akses master data barang & alokasi rak fisik (CRUD).
  - Inbound restock penerimaan barang supplier dengan nomor PO / Surat Jalan.
  - POS kasir penjualan & audit riwayat seluruh transaksi toko (CSV Export).
  - **Pusat Seluruh Laporan Eksekutif Bisa Diakses & Dicetak Resmi** (`window.print()` layout A4 formal).
- **Kasir Toko (`kasir` / `kasir123`)**:
  - POS Kasir Penjualan Cepat dengan pencarian/scan SKU instan.
  - Katalog stok barang dengan informasi letak rak gudang (tanpa menampilkan harga beli/HPP modal).
  - Kalkulator uang tunai, QRIS, dan transfer bank.
  - Cetak struk belanja pelanggan / slip pengambilan barang gudang.
  - Dibatasi secara aman dari akses manajemen gudang dan laporan laba rugi.

### 2. Seluruh Laporan Bisnis (Khusus Admin & Bisa Dicetak)
1. **Laporan Penjualan**: Rekap omzet, total transaksi, total item terjual, basket size, dan rincian per metode bayar.
2. **Laporan Laba & Rugi (HPP)**: Omzet penjualan, Harga Pokok Penjualan (modal barang keluar), Laba Kotor (Gross Profit), dan Margin Keuntungan (%).
3. **Laporan Valuasi & Stok Gudang (Stock Opname)**: Total nilai aset modal persediaan gudang, potensi omzet penjualan, dan audit stok fisik di rak.
4. **Laporan Barang Terlaris (Top 5 Best Seller)**: Peringkat 1–5 barang paling laku dan analisis perputaran barang (*Fast-Moving Goods*).
5. **Format Dokumen Resmi**: Dilengkapi kop surat (*letterhead*), nomor dokumen laporan, tabel angka JetBrains Mono rapi, dan kolom tanda tangan penanggung jawab gudang & direktur.

---

## 🚀 Teknologi yang Digunakan
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4 + Auction Quad Design System
- **Database Cloud**: PostgreSQL Supabase Cloud
- **Tipografi**: DM Sans (Display & Body) & JetBrains Mono (Prices, SKU, Invoice, Numbers)
- **Icons**: Lucide React
