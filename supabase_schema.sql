-- =========================================================================
-- SIPB WAREHOUSE & SALES MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA
-- PostgreSQL schema for Warehouse Inventory, Inbound/Outbound, POS, & Reports
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE (Admin & Kasir)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'kasir')),
    nama_lengkap VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. BARANG / WAREHOUSE INVENTORY MASTER TABLE
CREATE TABLE IF NOT EXISTS barang (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode_sku VARCHAR(50) UNIQUE NOT NULL,
    nama_barang VARCHAR(150) NOT NULL,
    kategori VARCHAR(50) NOT NULL,
    brand VARCHAR(50),
    harga_beli NUMERIC(15, 2) NOT NULL DEFAULT 0, -- HPP Modal Beli Gudang (Admin only)
    harga_jual NUMERIC(15, 2) NOT NULL DEFAULT 0, -- Harga Jual ke Konsumen/Toko
    harga_coret NUMERIC(15, 2) DEFAULT 0,        -- Harga Asli Sebelum Diskon
    diskon_persen INT DEFAULT 0,
    stok INT NOT NULL DEFAULT 0,                 -- Stok Fisik di Gudang
    stok_minimum INT NOT NULL DEFAULT 5,         -- Safety Stock / Reorder Alert threshold
    satuan VARCHAR(20) NOT NULL DEFAULT 'Pcs',   -- Pcs, Box, Dus, Karton, Lusin
    lokasi_rak VARCHAR(50) NOT NULL,             -- Lokasi Fisik Gudang (misal: Rak A-01)
    deskripsi TEXT,
    gambar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. PELANGGAN / CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS pelanggan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kode_pelanggan VARCHAR(50) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    no_hp VARCHAR(20),
    tipe VARCHAR(20) DEFAULT 'Retail' CHECK (tipe IN ('Retail', 'Grosir', 'Mitra')),
    alamat TEXT,
    diskon_khusus NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. TRANSAKSI PENJUALAN TABLE (Header)
CREATE TABLE IF NOT EXISTS transaksi_penjualan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_faktur VARCHAR(50) UNIQUE NOT NULL,
    tanggal TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    kasir_id UUID REFERENCES users(id) ON DELETE SET NULL,
    nama_kasir VARCHAR(100) NOT NULL,
    pelanggan_id UUID REFERENCES pelanggan(id) ON DELETE SET NULL,
    nama_pelanggan VARCHAR(100) DEFAULT 'Pelanggan Umum',
    metode_bayar VARCHAR(30) NOT NULL CHECK (metode_bayar IN ('Tunai', 'QRIS', 'Transfer Bank')),
    total_item INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    diskon NUMERIC(15, 2) DEFAULT 0,
    total_bayar NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_hpp NUMERIC(15, 2) NOT NULL DEFAULT 0,      -- Total HPP untuk Laporan Laba Rugi
    laba_kotor NUMERIC(15, 2) NOT NULL DEFAULT 0,     -- Total Laba Kotor
    uang_diterima NUMERIC(15, 2) NOT NULL DEFAULT 0,
    uang_kembalian NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) DEFAULT 'Selesai' CHECK (status IN ('Selesai', 'Pending', 'Batal')),
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. TRANSAKSI PENJUALAN DETAIL TABLE (Items)
CREATE TABLE IF NOT EXISTS transaksi_penjualan_detail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaksi_id UUID REFERENCES transaksi_penjualan(id) ON DELETE CASCADE,
    barang_id UUID REFERENCES barang(id) ON DELETE SET NULL,
    kode_sku VARCHAR(50) NOT NULL,
    nama_barang VARCHAR(150) NOT NULL,
    harga_beli_saat_itu NUMERIC(15, 2) NOT NULL DEFAULT 0,
    harga_jual_saat_itu NUMERIC(15, 2) NOT NULL DEFAULT 0,
    qty INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0,
    laba_kotor NUMERIC(15, 2) NOT NULL DEFAULT 0,
    lokasi_rak VARCHAR(50)
);

-- 7. MUTASI GUDANG TABLE (Audit Log Inbound & Outbound)
CREATE TABLE IF NOT EXISTS mutasi_gudang (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    no_referensi VARCHAR(50) NOT NULL,
    tipe VARCHAR(30) NOT NULL CHECK (tipe IN ('INBOUND_RESTOCK', 'OUTBOUND_PENJUALAN', 'PENYESUAIAN_STOK')),
    barang_id UUID REFERENCES barang(id) ON DELETE CASCADE,
    nama_barang VARCHAR(150) NOT NULL,
    qty INT NOT NULL,
    stok_sebelum INT NOT NULL,
    stok_sesudah INT NOT NULL,
    catatan TEXT,
    operator_nama VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. INDEXES FOR HIGH-PERFORMANCE SEARCH & REPORTING
CREATE INDEX IF NOT EXISTS idx_barang_sku ON barang(kode_sku);
CREATE INDEX IF NOT EXISTS idx_barang_kategori ON barang(kategori);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi_penjualan(tanggal);
CREATE INDEX IF NOT EXISTS idx_transaksi_kasir ON transaksi_penjualan(kasir_id);
CREATE INDEX IF NOT EXISTS idx_mutasi_barang ON mutasi_gudang(barang_id);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE barang ENABLE ROW LEVEL SECURITY;
ALTER TABLE pelanggan ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi_penjualan ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi_penjualan_detail ENABLE ROW LEVEL SECURITY;
ALTER TABLE mutasi_gudang ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read & write for public demo mode or anon key
CREATE POLICY "Public Read Barang" ON barang FOR SELECT USING (true);
CREATE POLICY "Public Write Barang" ON barang FOR ALL USING (true);

CREATE POLICY "Public Read Users" ON users FOR SELECT USING (true);
CREATE POLICY "Public Write Users" ON users FOR ALL USING (true);

CREATE POLICY "Public Read Transaksi" ON transaksi_penjualan FOR SELECT USING (true);
CREATE POLICY "Public Write Transaksi" ON transaksi_penjualan FOR ALL USING (true);

CREATE POLICY "Public Read Transaksi Detail" ON transaksi_penjualan_detail FOR SELECT USING (true);
CREATE POLICY "Public Write Transaksi Detail" ON transaksi_penjualan_detail FOR ALL USING (true);

CREATE POLICY "Public Read Mutasi" ON mutasi_gudang FOR SELECT USING (true);
CREATE POLICY "Public Write Mutasi" ON mutasi_gudang FOR ALL USING (true);

CREATE POLICY "Public Read Pelanggan" ON pelanggan FOR SELECT USING (true);
CREATE POLICY "Public Write Pelanggan" ON pelanggan FOR ALL USING (true);

-- 10. INITIAL SEED DATA
-- Default Users
INSERT INTO users (username, password_hash, role, nama_lengkap, no_hp)
VALUES 
('admin', 'admin123', 'admin', 'Budi Santoso (Kepala Gudang & Toko)', '081234567890'),
('kasir', 'kasir123', 'kasir', 'Siti Rahmawati (Kasir Shift Pagi)', '089876543210')
ON CONFLICT (username) DO NOTHING;

-- Default Customers
INSERT INTO pelanggan (kode_pelanggan, nama, no_hp, tipe, alamat, diskon_khusus)
VALUES
('CUST-001', 'Pelanggan Umum (Retail)', '0800000000', 'Retail', 'Langsung di Toko', 0),
('CUST-002', 'CV Sumber Jaya Grosir', '0811223344', 'Grosir', 'Kawasan Industri Cikarang Blok B2', 5),
('CUST-003', 'Toko Berkah Elektronik', '0822334455', 'Mitra', 'Jl. Merdeka No. 45 Jakarta Pusat', 3)
ON CONFLICT (kode_pelanggan) DO NOTHING;
