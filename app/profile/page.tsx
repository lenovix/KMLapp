import fs from "fs";
import path from "path";
import PlatformActions from "@/components/Home/PlatformActionsHome";
import ReportListClient from "@/components/Home/ReportListClient";

const REPORT_PATH = path.join(process.cwd(), "data/komify/reportList.json");

export default function ProfilePage() {
  const reports = fs.existsSync(REPORT_PATH)
    ? JSON.parse(fs.readFileSync(REPORT_PATH, "utf-8"))
    : [];

  return (
    <div className=" text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white to-white/40">
            Profile & Settings
          </h1>
          <p className="text-slate-500 mt-2 tracking-wide uppercase text-xs font-bold">
            Manage your account and platform preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-[#111111]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative w-24 h-24 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 border-4 border-[#111111] flex items-center justify-center text-2xl font-black">
                    IK
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    Ichsanul Kamil Sudarmi
                  </h2>
                  <p className="text-blue-400 font-medium mb-1">
                    ichkmlsdr@gmail.com
                  </p>
                  <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    Software Engineer
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-xl font-bold tracking-tight">
                    Laporan Saya
                  </h3>
                </div>
                <div className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                  <ReportListClient reports={reports} />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111111]/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-8">
                <svg
                  className="w-5 h-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold tracking-tight">
                  Quick Actions
                </h3>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <PlatformActions
                    platform="Komify"
                    actions={["Delete Comic", "Delete Comic Cache"]}
                  />
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <PlatformActions
                    platform="Filmfy"
                    actions={[
                      "Delete Comment",
                      "Delete Favorite",
                      "Delete Film",
                      "Delete Tmp_Folder",
                    ]}
                  />
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <PlatformActions
                    platform="Animefy"
                    actions={[
                      "Delete Comment",
                      "Delete Favorite",
                      "Delete Anime",
                      "Delete Tmp_Folder",
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
