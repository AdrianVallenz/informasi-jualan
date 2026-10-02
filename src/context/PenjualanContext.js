"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initialUsers,
  initialKategoriList,
  initialBarang,
  initialPelanggan,
  initialTransaksiPenjualan,
  initialMutasiGudang,
} from "../data/initialData";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

const PenjualanContext = createContext(null);

export function PenjualanProvider({ children }) {
  // 1. AUTH STATE (Null means landing on LoginScreen)
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sipb_current_user");
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // 2. ACTIVE VIEW NAVIGATION
  const [activeTab, setActiveTab] = useState("katalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("Semua");

  // 3. WAREHOUSE MASTER INVENTORY
  const [barangList, setBarangList] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sipb_barang");
        return saved ? JSON.parse(saved) : initialBarang;
      } catch {
        return initialBarang;
      }
    }
    return initialBarang;
  });

  // 4. CUSTOMERS
  const [pelangganList] = useState(initialPelanggan);

  // 5. TRANSACTIONS & MUTASI
  const [transaksiList, setTransaksiList] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sipb_transaksi");
        return saved ? JSON.parse(saved) : initialTransaksiPenjualan;
      } catch {
        return initialTransaksiPenjualan;
      }
    }
    return initialTransaksiPenjualan;
  });

  const [mutasiList, setMutasiList] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sipb_mutasi");
        return saved ? JSON.parse(saved) : initialMutasiGudang;
      } catch {
        return initialMutasiGudang;
      }
    }
    return initialMutasiGudang;
  });

  // 6. POS CASHIER CART
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sipb_cart");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // 7. ACTIVE MODALS & DIALOGS
  const [lastCompletedTransaction, setLastCompletedTransaction] = useState(null);
  const [showStrukModal, setShowStrukModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showTambahModal, setShowTambahModal] = useState(false);
  const [restockTargetBarang, setRestockTargetBarang] = useState(null);
  const [editTargetBarang, setEditTargetBarang] = useState(null);
  const [accessDeniedMessage, setAccessDeniedMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem("sipb_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("sipb_current_user");
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sipb_barang", JSON.stringify(barangList));
    }
  }, [barangList]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sipb_transaksi", JSON.stringify(transaksiList));
    }
  }, [transaksiList]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sipb_mutasi", JSON.stringify(mutasiList));
    }
  }, [mutasiList]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sipb_cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Optional Live sync with Supabase
  useEffect(() => {
    async function syncFromSupabase() {
      if (!isSupabaseConfigured || !supabase) return;
      try {
        const { data: remoteBarang, error } = await supabase
          .from("barang")
          .select("*")
          .order("kode_sku", { ascending: true });

        if (!error && remoteBarang && remoteBarang.length > 0) {
          setBarangList(remoteBarang);
        }
      } catch (err) {
        console.warn("Supabase fetch fallback:", err);
      }
    }
    syncFromSupabase();
  }, []);

  // ==========================================
  // AUTHENTICATION FUNCTIONS
  // ==========================================
  const login = (username, password) => {
    const user = initialUsers.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );

    if (user) {
      const sessionUser = {
        id: user.id,
        username: user.username,
        role: user.role,
        nama_lengkap: user.nama_lengkap,
        jabatan: user.jabatan,
        email: user.email,
      };
      setCurrentUser(sessionUser);
      // Route appropriately
      if (user.role === "admin") {
        setActiveTab("katalog");
      } else {
        setActiveTab("kasir"); // Kasir lands immediately on POS terminal
      }
      return { success: true };
    }
    return { success: false, message: "Username atau password salah!" };
  };

  const quickDemoLogin = (role) => {
    const targetUser = initialUsers.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      if (role === "admin") {
        setActiveTab("katalog");
      } else {
        setActiveTab("kasir");
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setActiveTab("katalog");
    if (typeof window !== "undefined") {
      localStorage.removeItem("sipb_current_user");
      localStorage.removeItem("sipb_cart");
    }
  };

  // RBAC Tab Switch Guard
  const changeTab = (tabName) => {
    // Protected admin tabs
    if (["master_barang", "laporan"].includes(tabName)) {
      if (currentUser?.role !== "admin") {
        setAccessDeniedMessage(
          "Fitur ini khusus untuk Administrator Gudang. Akun Kasir hanya diizinkan untuk operasional penjualan dan etalase."
        );
        return;
      }
    }
    setActiveTab(tabName);
  };

  // ==========================================
  // POS CASHIER OPERATIONS
  // ==========================================
  const addToCart = (barang, qtyToAdd = 1) => {
    const existing = cart.find((item) => item.id === barang.id);
    const currentQty = existing ? existing.qty : 0;
    const requestedQty = currentQty + qtyToAdd;

    if (requestedQty > barang.stok) {
      alert(
        `Stok di ${barang.lokasi_rak} hanya tersisa ${barang.stok} ${barang.satuan}! Tidak dapat menambahkan lebih.`
      );
      return false;
    }

    const price = barang.harga_jual;
    const hpp = barang.harga_beli;

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === barang.id
            ? {
                ...item,
                qty: requestedQty,
                subtotal: requestedQty * price,
                laba: requestedQty * (price - hpp),
              }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          ...barang,
          qty: qtyToAdd,
          subtotal: qtyToAdd * price,
          laba: qtyToAdd * (price - hpp),
        },
      ]);
    }
    return true;
  };

  const updateCartQty = (barangId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(barangId);
      return;
    }

    const barang = barangList.find((b) => b.id === barangId);
    if (!barang) return;

    if (newQty > barang.stok) {
      alert(`Stok di gudang hanya tersisa ${barang.stok} ${barang.satuan}!`);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === barangId
          ? {
              ...item,
              qty: newQty,
              subtotal: newQty * item.harga_jual,
              laba: newQty * (item.harga_jual - item.harga_beli),
            }
          : item
      )
    );
  };

  const removeFromCart = (barangId) => {
    setCart((prev) => prev.filter((item) => item.id !== barangId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkoutTransaksi = ({
    pelanggan,
    metodeBayar = "Tunai",
    diskonNominal = 0,
    uangDiterima = 0,
    catatan = "",
  }) => {
    if (cart.length === 0) {
      return { success: false, message: "Keranjang kasir masih kosong!" };
    }

    // Verify stock availability
    for (const item of cart) {
      const liveBarang = barangList.find((b) => b.id === item.id);
      if (!liveBarang || liveBarang.stok < item.qty) {
        return {
          success: false,
          message: `Stok untuk "${item.nama_barang}" tidak mencukupi di rak!`,
        };
      }
    }

    const now = new Date();
    const invoiceNumber = `INV-SIPB-${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
      100 + Math.random() * 900
    )}`;

    const rawSubtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const totalHpp = cart.reduce(
      (acc, item) => acc + item.harga_beli * item.qty,
      0
    );
    const finalTotal = Math.max(0, rawSubtotal - diskonNominal);
    const totalLaba = Math.max(0, finalTotal - totalHpp);

    const receivedMoney =
      metodeBayar === "Tunai" ? Number(uangDiterima) : finalTotal;
    const changeMoney = Math.max(0, receivedMoney - finalTotal);

    const transactionData = {
      id: `trx-${Date.now()}`,
      no_faktur: invoiceNumber,
      tanggal: now.toISOString(),
      kasir_id: currentUser ? currentUser.id : "usr-kasir-01",
      nama_kasir: currentUser ? currentUser.nama_lengkap : "Kasir SIPB",
      pelanggan_id: pelanggan ? pelanggan.id : "cust-01",
      nama_pelanggan: pelanggan
        ? pelanggan.nama
        : "Pelanggan Umum (Walk-in Retail)",
      metode_bayar: metodeBayar,
      total_item: cart.reduce((acc, item) => acc + item.qty, 0),
      items: cart.map((c) => ({
        barang_id: c.id,
        kode_sku: c.kode_sku,
        nama_barang: c.nama_barang,
        harga_beli: c.harga_beli,
        harga_jual: c.harga_jual,
        qty: c.qty,
        subtotal: c.subtotal,
        laba: c.laba,
        lokasi_rak: c.lokasi_rak,
      })),
      subtotal: rawSubtotal,
      diskon: diskonNominal,
      total_bayar: finalTotal,
      total_hpp: totalHpp,
      laba_kotor: totalLaba,
      uang_diterima: receivedMoney,
      uang_kembalian: changeMoney,
      status: "Selesai",
      catatan: catatan || "Penjualan Kasir Outbound Gudang",
    };

    // 1. Deduct warehouse stock and increment units sold
    setBarangList((prevList) =>
      prevList.map((b) => {
        const itemInCart = cart.find((c) => c.id === b.id);
        if (itemInCart) {
          return {
            ...b,
            stok: Math.max(0, b.stok - itemInCart.qty),
            terjual: (b.terjual || 0) + itemInCart.qty,
          };
        }
        return b;
      })
    );

    // 2. Append transaction record
    setTransaksiList((prev) => [transactionData, ...prev]);

    // 3. Record warehouse outbound mutation
    const newMutations = cart.map((item) => {
      const orig = barangList.find((b) => b.id === item.id);
      const stockBefore = orig ? orig.stok : item.qty;
      return {
        id: `mut-${Date.now()}-${item.id}`,
        no_referensi: invoiceNumber,
        tipe: "OUTBOUND_PENJUALAN",
        barang_id: item.id,
        nama_barang: item.nama_barang,
        qty: -item.qty,
        stok_sebelum: stockBefore,
        stok_sesudah: Math.max(0, stockBefore - item.qty),
        catatan: `Penjualan Kasir ${transactionData.nama_kasir} (${transactionData.nama_pelanggan})`,
        operator_nama: currentUser?.nama_lengkap || "Kasir",
        created_at: now.toISOString(),
      };
    });
    setMutasiList((prev) => [...newMutations, ...prev]);

    // 4. Sync with Supabase if online
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("transaksi_penjualan")
        .insert({
          no_faktur: invoiceNumber,
          nama_kasir: transactionData.nama_kasir,
          nama_pelanggan: transactionData.nama_pelanggan,
          metode_bayar: metodeBayar,
          total_item: transactionData.total_item,
          subtotal: rawSubtotal,
          diskon: diskonNominal,
          total_bayar: finalTotal,
          total_hpp: totalHpp,
          laba_kotor: totalLaba,
          uang_diterima: receivedMoney,
          uang_kembalian: changeMoney,
          status: "Selesai",
          catatan: transactionData.catatan,
        })
        .then(() => {});
    }

    // 5. Clean up cart and prepare receipt modal
    clearCart();
    setLastCompletedTransaction(transactionData);
    setShowStrukModal(true);

    return { success: true, transaction: transactionData };
  };

  // ==========================================
  // WAREHOUSE INVENTORY MANAGEMENT (ADMIN ONLY)
  // ==========================================
  const tambahBarang = (barangData) => {
    if (currentUser?.role !== "admin") {
      alert("Hanya Admin yang berwenang menambah data barang!");
      return;
    }

    const newBarang = {
      id: `brg-${Date.now()}`,
      kode_sku: barangData.kode_sku.trim().toUpperCase(),
      nama_barang: barangData.nama_barang.trim(),
      kategori: barangData.kategori,
      brand: barangData.brand || "Generik",
      harga_beli: Number(barangData.harga_beli) || 0,
      harga_jual: Number(barangData.harga_jual) || 0,
      harga_coret: Number(barangData.harga_coret) || Number(barangData.harga_jual),
      diskon_persen: Number(barangData.diskon_persen) || 0,
      stok: Number(barangData.stok) || 0,
      stok_minimum: Number(barangData.stok_minimum) || 5,
      satuan: barangData.satuan || "Pcs",
      lokasi_rak: barangData.lokasi_rak || "Rak A-01",
      deskripsi: barangData.deskripsi || "",
      gambar_url:
        barangData.gambar_url ||
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=80",
      terjual: 0,
      rating: 5.0,
    };

    setBarangList((prev) => [newBarang, ...prev]);

    // Record initial inbound mutation
    if (newBarang.stok > 0) {
      const mutasi = {
        id: `mut-${Date.now()}`,
        no_referensi: `INB-INIT-${newBarang.kode_sku}`,
        tipe: "INBOUND_RESTOCK",
        barang_id: newBarang.id,
        nama_barang: newBarang.nama_barang,
        qty: newBarang.stok,
        stok_sebelum: 0,
        stok_sesudah: newBarang.stok,
        catatan: `Registrasi Master Barang Baru di ${newBarang.lokasi_rak}`,
        operator_nama: currentUser?.nama_lengkap || "Admin Gudang",
        created_at: new Date().toISOString(),
      };
      setMutasiList((prev) => [mutasi, ...prev]);
    }

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase
        .from("barang")
        .insert({
          kode_sku: newBarang.kode_sku,
          nama_barang: newBarang.nama_barang,
          kategori: newBarang.kategori,
          brand: newBarang.brand,
          harga_beli: newBarang.harga_beli,
          harga_jual: newBarang.harga_jual,
          harga_coret: newBarang.harga_coret,
          diskon_persen: newBarang.diskon_persen,
          stok: newBarang.stok,
          stok_minimum: newBarang.stok_minimum,
          satuan: newBarang.satuan,
          lokasi_rak: newBarang.lokasi_rak,
          deskripsi: newBarang.deskripsi,
          gambar_url: newBarang.gambar_url,
        })
        .then(() => {});
    }

    setShowTambahModal(false);
  };

  const updateBarang = (barangId, updatedFields) => {
    if (currentUser?.role !== "admin") {
      alert("Hanya Admin yang berwenang mengedit data barang!");
      return;
    }

    setBarangList((prev) =>
      prev.map((item) =>
        item.id === barangId ? { ...item, ...updatedFields } : item
      )
    );
    setEditTargetBarang(null);
  };

  const hapusBarang = (barangId) => {
    if (currentUser?.role !== "admin") {
      alert("Hanya Admin yang berwenang menghapus data barang!");
      return;
    }

    const barang = barangList.find((b) => b.id === barangId);
    if (!barang) return;

    if (
      window.confirm(
        `Yakin ingin menghapus "${barang.nama_barang}" (${barang.kode_sku}) dari gudang?`
      )
    ) {
      setBarangList((prev) => prev.filter((b) => b.id !== barangId));
      setCart((prev) => prev.filter((c) => c.id !== barangId));
    }
  };

  const restockBarang = (barangId, qtyMasuk, supplier, noSuratJalan, catatan) => {
    if (currentUser?.role !== "admin") {
      alert("Hanya Admin yang berwenang menambah stok masuk gudang!");
      return;
    }

    const qty = Number(qtyMasuk);
    if (qty <= 0) {
      alert("Jumlah stok masuk harus lebih dari 0!");
      return;
    }

    const barang = barangList.find((b) => b.id === barangId);
    if (!barang) return;

    const stokSebelum = barang.stok;
    const stokSesudah = stokSebelum + qty;

    setBarangList((prev) =>
      prev.map((b) => (b.id === barangId ? { ...b, stok: stokSesudah } : b))
    );

    const mutasi = {
      id: `mut-${Date.now()}`,
      no_referensi:
        noSuratJalan || `PO-INBOUND-${Date.now().toString().slice(-6)}`,
      tipe: "INBOUND_RESTOCK",
      barang_id: barangId,
      nama_barang: barang.nama_barang,
      qty: qty,
      stok_sebelum: stokSebelum,
      stok_sesudah: stokSesudah,
      catatan: `Restock dari ${supplier || "Supplier Utama"}: ${catatan || "-"} (Masuk ke ${barang.lokasi_rak})`,
      operator_nama: currentUser?.nama_lengkap || "Admin Gudang",
      created_at: new Date().toISOString(),
    };

    setMutasiList((prev) => [mutasi, ...prev]);
    setRestockTargetBarang(null);
  };

  // ==========================================
  // COMPREHENSIVE REPORTS CALCULATIONS (ADMIN)
  // ==========================================
  const getFilteredTransactions = (period = "semua") => {
    const now = new Date();
    return transaksiList.filter((t) => {
      const trxDate = new Date(t.tanggal);
      if (period === "hari_ini") {
        return (
          trxDate.getDate() === now.getDate() &&
          trxDate.getMonth() === now.getMonth() &&
          trxDate.getFullYear() === now.getFullYear()
        );
      }
      if (period === "7_hari") {
        const diffDays = (now - trxDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      if (period === "bulan_ini") {
        return (
          trxDate.getMonth() === now.getMonth() &&
          trxDate.getFullYear() === now.getFullYear()
        );
      }
      return true; // 'semua'
    });
  };

  const getLaporanPenjualan = (period = "semua") => {
    const list = getFilteredTransactions(period);
    const totalOmzet = list.reduce((acc, t) => acc + t.total_bayar, 0);
    const totalHpp = list.reduce((acc, t) => acc + (t.total_hpp || 0), 0);
    const totalLaba = list.reduce((acc, t) => acc + (t.laba_kotor || 0), 0);
    const totalItemTerjual = list.reduce((acc, t) => acc + t.total_item, 0);
    const totalTransaksi = list.length;
    const rataRataTransaksi = totalTransaksi > 0 ? totalOmzet / totalTransaksi : 0;

    // Breakdown per Metode Bayar
    const metodeBreakdown = list.reduce((acc, t) => {
      acc[t.metode_bayar] = (acc[t.metode_bayar] || 0) + t.total_bayar;
      return acc;
    }, {});

    // Breakdown per Kasir
    const kasirBreakdown = list.reduce((acc, t) => {
      acc[t.nama_kasir] = (acc[t.nama_kasir] || 0) + t.total_bayar;
      return acc;
    }, {});

    return {
      period,
      list,
      totalOmzet,
      totalHpp,
      totalLaba,
      totalItemTerjual,
      totalTransaksi,
      rataRataTransaksi,
      metodeBreakdown,
      kasirBreakdown,
    };
  };

  const getLaporanLabaRugi = (period = "semua") => {
    const data = getLaporanPenjualan(period);
    const marginPersen =
      data.totalOmzet > 0
        ? ((data.totalLaba / data.totalOmzet) * 100).toFixed(1)
        : 0;

    // Category Profit Breakdown
    const kategoriProfit = {};
    data.list.forEach((trx) => {
      trx.items.forEach((item) => {
        const brg = barangList.find((b) => b.id === item.barang_id);
        const kat = brg ? brg.kategori : "Lainnya";
        if (!kategoriProfit[kat]) {
          kategoriProfit[kat] = { omzet: 0, hpp: 0, laba: 0, qty: 0 };
        }
        const itemOmzet = item.subtotal;
        const itemHpp = item.harga_beli * item.qty;
        const itemLaba = itemOmzet - itemHpp;

        kategoriProfit[kat].omzet += itemOmzet;
        kategoriProfit[kat].hpp += itemHpp;
        kategoriProfit[kat].laba += itemLaba;
        kategoriProfit[kat].qty += item.qty;
      });
    });

    return {
      period,
      totalOmzet: data.totalOmzet,
      totalHpp: data.totalHpp,
      totalLaba: data.totalLaba,
      marginPersen,
      kategoriProfit,
    };
  };

  const getLaporanStokGudang = () => {
    const totalAsetModal = barangList.reduce(
      (acc, b) => acc + b.stok * b.harga_beli,
      0
    );
    const potensiOmzet = barangList.reduce(
      (acc, b) => acc + b.stok * b.harga_jual,
      0
    );
    const totalUnitFisik = barangList.reduce((acc, b) => acc + b.stok, 0);

    const stokMenipis = barangList.filter(
      (b) => b.stok > 0 && b.stok <= b.stok_minimum
    );
    const stokHabis = barangList.filter((b) => b.stok === 0);
    const stokAman = barangList.filter((b) => b.stok > b.stok_minimum);

    // Grouping by Warehouse Rack
    const rackBreakdown = {};
    barangList.forEach((b) => {
      const rack = b.lokasi_rak || "Belum Ditentukan";
      if (!rackBreakdown[rack]) {
        rackBreakdown[rack] = [];
      }
      rackBreakdown[rack].push(b);
    });

    return {
      totalAsetModal,
      potensiOmzet,
      totalUnitFisik,
      totalSku: barangList.length,
      stokAmanCount: stokAman.length,
      stokMenipisCount: stokMenipis.length,
      stokHabisCount: stokHabis.length,
      stokMenipisList: stokMenipis,
      stokHabisList: stokHabis,
      rackBreakdown,
    };
  };

  const getLaporanTop5Terlaris = () => {
    // Sort items by total quantity sold
    const sorted = [...barangList].sort(
      (a, b) => (b.terjual || 0) - (a.terjual || 0)
    );
    const top5 = sorted.slice(0, 5);
    const totalAllSold = sorted.reduce((acc, b) => acc + (b.terjual || 0), 1); // Avoid div 0

    return top5.map((item, index) => {
      const persentase = (((item.terjual || 0) / totalAllSold) * 100).toFixed(1);
      const totalRevenue = (item.terjual || 0) * item.harga_jual;
      return {
        rank: index + 1,
        ...item,
        persentase,
        totalRevenue,
      };
    });
  };

  // Value object to provide
  const value = {
    // Auth & Navigation
    currentUser,
    login,
    quickDemoLogin,
    logout,
    activeTab,
    changeTab,
    searchQuery,
    setSearchQuery,
    selectedKategori,
    setSelectedKategori,
    kategoriList: initialKategoriList,

    // Warehouse Inventory
    barangList,
    pelangganList,
    tambahBarang,
    updateBarang,
    hapusBarang,
    restockBarang,

    // POS Cashier
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    checkoutTransaksi,

    // Transaction & Mutations
    transaksiList,
    mutasiList,
    lastCompletedTransaction,
    setLastCompletedTransaction,

    // Modals
    showStrukModal,
    setShowStrukModal,
    previewProduct,
    setPreviewProduct,
    showTambahModal,
    setShowTambahModal,
    restockTargetBarang,
    setRestockTargetBarang,
    editTargetBarang,
    setEditTargetBarang,
    accessDeniedMessage,
    setAccessDeniedMessage,

    // Reporting Helpers
    getLaporanPenjualan,
    getLaporanLabaRugi,
    getLaporanStokGudang,
    getLaporanTop5Terlaris,
  };

  return (
    <PenjualanContext.Provider value={value}>
      {children}
    </PenjualanContext.Provider>
  );
}

export function usePenjualan() {
  const context = useContext(PenjualanContext);
  if (!context) {
    throw new Error("usePenjualan must be used within a PenjualanProvider");
  }
  return context;
}
