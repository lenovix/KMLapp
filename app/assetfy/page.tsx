import React from "react";
import {
  Package,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Search,
  Plus,
  MoreHorizontal,
  DollarSign,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 p-8 font-sans">
      <header className="mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button className="bg-slate-800/50 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl border border-slate-700/50 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Assetfy Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Monitoring sistem manajemen aset secara real-time.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari aset..."
                className="bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all w-64"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
              <Plus className="w-4 h-4" /> Tambah Aset
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Aset"
          value="1,284"
          icon={<Package className="text-indigo-400" />}
          gradient="from-indigo-500/10 to-transparent"
          border="border-indigo-500/20"
        />
        <StatCard
          title="Perlu Perbaikan"
          value="12"
          icon={<AlertCircle className="text-rose-400" />}
          gradient="from-rose-500/10 to-transparent"
          border="border-rose-500/20"
        />
        <StatCard
          title="Kondisi Baik"
          value="1,230"
          icon={<CheckCircle className="text-emerald-400" />}
          gradient="from-emerald-500/10 to-transparent"
          border="border-emerald-500/20"
        />
        <StatCard
          title="Total Nilai"
          value="1,230"
          icon={<DollarSign className="text-emerald-400" />}
          gradient="from-emerald-500/10 to-transparent"
          border="border-emerald-500/20"
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
              <TableRow
                name="MacBook Pro M3"
                category="Laptop"
                status="Tersedia"
                date="Jan 15, 2024"
                price="Rp 15.000.000"
              />
              <TableRow
                name="Dell UltraSharp 27"
                category="Monitor"
                status="Dipinjam"
                date="Feb 20, 2024"
                price="Rp 8.000.000"
              />
              <TableRow
                name="Logitech MX Master 3"
                category="Aksesoris"
                status="Tersedia"
                date="Mar 10, 2024"
                price="Rp 1.500.000"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
      className={`bg-[#131720] p-6 rounded-2xl border ${border} relative overflow-hidden group hover:border-slate-600 transition-all`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-50`}
      />
      <div className="relative flex items-center gap-5">
        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform font-bold">
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
  name,
  category,
  status,
  date,
  price,
}: {
  name: string;
  category: string;
  status: string;
  date: string;
  price: string;
}) {
  const isAvailable = status === "Tersedia";
  return (
    <tr className="hover:bg-slate-800/30 transition-colors group">
      <td className="px-6 py-5">
        <div className="flex flex-col">
          <span className="text-white font-medium group-hover:text-indigo-400 transition-colors">
            {name}
          </span>
          <span className="text-xs text-slate-500">ID: AST-2024-001</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md text-xs border border-slate-700">
          {category}
        </span>
      </td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${isAvailable ? "bg-emerald-500" : "bg-orange-500"} shadow-[0_0_8px_rgba(16,185,129,0.5)]`}
          />
          <span
            className={`text-sm ${isAvailable ? "text-emerald-400" : "text-orange-400"}`}
          >
            {status}
          </span>
        </div>
      </td>
      <td className="px-6 py-5 text-sm text-slate-400">{date}</td>
      <td className="px-6 py-5 text-sm text-white font-mono text-right font-semibold">
        {price}
      </td>
      <td className="px-6 py-5 text-center">
        <button className="text-slate-500 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5 mx-auto" />
        </button>
      </td>
    </tr>
  );
}
