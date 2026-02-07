"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Search,
  Plus,
  MoreHorizontal,
  DollarSign,
  X,
  AlignLeft,
  Tag,
  Calendar,
  Globe,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

import categories from "@/data/assetfy/category.json";
import statuses from "@/data/assetfy/status.json";

interface Asset {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  category: string;
  status: string;
  purchaseDate: string;
  storeLink: string;
}

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    try {
      const response = await fetch("/api/assetfy/getAssets");
      const data = await response.json();
      setAssets(data);
    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    status: "",
    price: "",
    purchaseDate: "",
    storeLink: "",
    image: "default-asset.jpg",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/assetfy/addAsset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Aset berhasil disimpan!");
        setIsModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      <header className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl border border-slate-700/50 transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                Assetfy Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Monitoring sistem manajemen aset secara real-time.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Cari aset..."
                className="bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Tambah Aset
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Aset"
          value="1,284"
          icon={<Package className="text-indigo-400" />}
          gradient="from-indigo-500/10"
          border="border-indigo-500/20"
        />
        <StatCard
          title="Perlu Perbaikan"
          value="12"
          icon={<AlertCircle className="text-rose-400" />}
          gradient="from-rose-500/10"
          border="border-rose-500/20"
        />
        <StatCard
          title="Kondisi Baik"
          value="1,230"
          icon={<CheckCircle className="text-emerald-400" />}
          gradient="from-emerald-500/10"
          border="border-emerald-500/20"
        />
        <StatCard
          title="Total Nilai"
          value="Rp 2.4M"
          icon={<DollarSign className="text-amber-400" />}
          gradient="from-amber-500/10"
          border="border-amber-500/20"
        />
      </div>

      <div className="bg-[#131720] rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800/60 bg-slate-900/20">
          <h2 className="text-lg font-semibold text-white">Aset Terbaru</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/40 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Nama Aset</th>
                <th className="px-6 py-4 font-semibold">Kategori</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tanggal Beli</th>
                <th className="px-6 py-4 font-semibold text-right">Harga</th>
                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : assets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    Belum ada data aset.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <TableRow
                    key={asset.id}
                    id={asset.id}
                    name={asset.name}
                    category={asset.category}
                    status={asset.status}
                    date={asset.purchaseDate}
                    price={`Rp ${Number(asset.price).toLocaleString("id-ID")}`}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-in fade-in duration-500"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-[#0f1219] border border-slate-800/60 w-full max-w-2xl rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(79,70,229,0.2)] overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-300">
            <div className="relative px-10 pt-10 pb-6 bg-linear-to-b from-slate-900/50 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Tambah Aset Baru
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Daftarkan perangkat atau inventaris baru ke dalam sistem.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="group bg-slate-800/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 p-2.5 rounded-full transition-all duration-300"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-10 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto custom-scrollbar"
            >
              <div className="md:col-span-2 mt-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-slate-800"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                    Informasi Umum
                  </span>
                  <div className="h-px flex-1 bg-slate-800"></div>
                </div>
              </div>

              <div className="md:col-span-2">
                <FormLabel>Nama Aset</FormLabel>
                <div className="group relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Misal: MacBook Pro M3"
                    className="w-full bg-slate-900/40 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <FormLabel>Deskripsi</FormLabel>
                <div className="group relative">
                  <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Tuliskan spesifikasi atau detail aset..."
                    className="w-full bg-slate-900/40 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-700 min-h-[100px] resize-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 mt-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-slate-800"></div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                    Spesifikasi & Status
                  </span>
                  <div className="h-px flex-1 bg-slate-800"></div>
                </div>
              </div>

              <div>
                <FormLabel>Kategori</FormLabel>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-900/40 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0f1219]">
                      Pilih Kategori
                    </option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#0f1219]">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <FormLabel>Status</FormLabel>
                <div className="relative group">
                  <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-slate-900/40 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-[#0f1219]">
                      Pilih Status
                    </option>
                    {statuses.map((stat) => (
                      <option
                        key={stat}
                        value={stat}
                        className="bg-[#0f1219] capitalize"
                      >
                        {stat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div>
                <FormLabel>Harga</FormLabel>
                <div className="group relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0"
                    className="w-full bg-slate-900/40 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div>
                <FormLabel>Tanggal Pembelian</FormLabel>
                <div className="group relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, purchaseDate: e.target.value })
                    }
                    className="w-full bg-slate-900/40 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all scheme-dark"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <FormLabel>Link Toko / Produk</FormLabel>
                <div className="group relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="url"
                    value={formData.storeLink}
                    onChange={(e) =>
                      setFormData({ ...formData, storeLink: e.target.value })
                    }
                    placeholder="https://example.com"
                    className="w-full bg-slate-900/40 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex items-center gap-4 mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-slate-800 font-bold text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-2 px-6 py-4 rounded-2xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(79,70,229,0.5)] active:scale-[0.97]"
                >
                  Konfirmasi & Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input-premium {
          @apply w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600;
        }
        .input-icon {
          @apply absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          @apply bg-slate-800 rounded-full;
        }
      `}</style>
    </div>
  );
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
      {children}
    </label>
  );
}

function StatCard({
  title,
  value,
  icon,
  gradient,
  border,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
}) {
  return (
    <div
      className={`bg-[#131720] p-6 rounded-2xl border ${border} relative overflow-hidden group hover:border-slate-500/50 transition-all cursor-default`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} to-transparent opacity-40`}
      />
      <div className="relative flex items-center gap-5">
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform shadow-inner">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-bold text-white mt-0.5">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TableRow({
  id,
  name,
  category,
  status,
  date,
  price,
}: {
  id: string;
  name: string;
  category: string;
  status: string;
  date: string;
  price: string;
}) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "tersedia":
        return "bg-emerald-500 text-emerald-400";
      case "rusak":
        return "bg-rose-500 text-rose-400";
      case "hilang":
        return "bg-slate-500 text-slate-400";
      default:
        return "bg-orange-500 text-orange-400";
    }
  };

  const statusStyle = getStatusStyle(status);

  return (
    <tr className="hover:bg-slate-800/40 transition-all group">
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-white font-medium group-hover:text-indigo-400 transition-colors">
            {name}
          </span>
          <span className="text-[10px] text-slate-600 font-mono tracking-tighter mt-0.5">
            ID: {id}
          </span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="bg-slate-800/80 text-slate-400 px-2.5 py-1 rounded-lg text-[11px] font-semibold border border-slate-700/50 uppercase">
          {category}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${statusStyle.split(" ")[0]} shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
          />
          <span
            className={`text-sm font-medium capitalize ${statusStyle.split(" ")[1]}`}
          >
            {status}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-slate-500">{date}</td>
      <td className="px-6 py-5 text-sm text-white font-mono text-right font-bold tracking-tight">
        {price}
      </td>
      <td className="px-6 py-5 text-center">
        <button className="bg-slate-800/50 hover:bg-slate-700 p-2 rounded-lg text-slate-500 hover:text-white transition-all">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
