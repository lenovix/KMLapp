"use client";

import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Info,
  ExternalLink,
  Users,
  ChevronDown,
  ImageIcon,
  ImagePlus,
  FolderPlus,
  Play,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import AddChapterModal from "@/components/Peoplefy/AddChapterModal";
import MediaViewer from "@/components/Peoplefy/MediaViewer";

export default function PersonDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const [openChapters, setOpenChapters] = useState<number[]>([]);
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/peoplefy/people/${id}`);
        const data = await res.json();
        setPerson(data);
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (person?.chapters && person.chapters.length > 0) {
      setOpenChapters([person.chapters[0].id]);
    }
  }, [person]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Memuat data...
      </div>
    );
  if (!person)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Data tidak ditemukan.
      </div>
    );

  const toggleChapter = (id: number) => {
    setOpenChapters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const totalImages =
    person.chapters?.reduce(
      (acc: number, chap: any) => acc + chap.images.length,
      0,
    ) || 0;

  const handleDeletePerson = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus semua data orang ini? Tindakan ini tidak dapat dibatalkan.")) return;

    try {
      const res = await fetch(`/api/peoplefy/people/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Data berhasil dihapus");
        router.push("/peoplefy");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!confirm("Hapus chapter ini beserta semua isinya?")) return;

    try {
      const res = await fetch(`/api/peoplefy/chapters/${chapterId}`, { method: "DELETE" });
      if (res.ok) {
        setPerson((prev: any) => ({
          ...prev,
          chapters: prev.chapters.filter((c: any) => c.id !== chapterId),
        }));
      }
    } catch (error) {
      console.error("Delete chapter error:", error);
    }
  };

  const handleDeleteMedia = async (chapterId: number, mediaUrl: string) => {
    try {
      const res = await fetch(`/api/peoplefy/delete-media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId, mediaUrl }),
      });

      if (res.ok) {
        setPerson((prev: any) => {
          const newChapters = prev.chapters.map((c: any) => {
            if (c.id === chapterId) {
              return { ...c, images: c.images.filter((img: string) => img !== mediaUrl) };
            }
            return c;
          });
          return { ...prev, chapters: newChapters };
        });
      }
    } catch (error) {
      console.error("Delete media error:", error);
    }
  };

  const handleSaveChapter = async (data: {
    title: string;
    description: string;
  }) => {
    try {
      const response = await fetch("/api/peoplefy/add-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personId: Number(id),
          title: data.title,
          description: data.description,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        setPerson((prev: any) => ({
          ...prev,
          chapters: [...prev.chapters, result.chapter],
        }));

        setIsChapterModalOpen(false);
        alert("Chapter dan Folder berhasil dibuat!");
      } else {
        alert("Gagal menyimpan chapter");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Terjadi kesalahan koneksi");
    }
  };

  const handleUploadMedia = async (
    chapterId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const successfullyUploaded: string[] = [];

    try {
      for (const file of fileArray) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (!isImage && !isVideo) continue;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("personId", String(person.id));
        formData.append("chapterId", String(chapterId));

        const response = await fetch("/api/peoplefy/upload-media", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          successfullyUploaded.push(result.url);

          setPerson((prev: any) => {
            const newChapters = prev.chapters.map((c: any) => {
              if (c.id === chapterId) {
                return { ...c, images: [...c.images, result.url] };
              }
              return c;
            });
            return { ...prev, chapters: newChapters };
          });
        }
      }

      if (successfullyUploaded.length > 0) {
        alert(`${successfullyUploaded.length} file berhasil diupload!`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {selectedMedia && (
        <MediaViewer src={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/peoplefy"
            className="group flex items-center gap-2 bg-slate-900/50 backdrop-blur-md border border-slate-800 p-2 pr-4 rounded-full text-slate-300 hover:text-white transition"
          >
            <div className="bg-slate-800 p-1 rounded-full group-hover:bg-blue-600 transition">
              <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-medium">Koleksi</span>
          </Link>

          <div className="flex gap-2">
            <button
              onClick={handleDeletePerson}
              className="p-3 bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-full hover:bg-red-500 hover:text-white text-red-500 transition-all"
            >
              <Trash2 size={18} />
            </button>
            <button className="p-3 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-full hover:bg-slate-800 transition">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-md opacity-20 animate-pulse" />
            <div className="relative p-1 bg-slate-800/50 rounded-full backdrop-blur-sm border border-white/10">
              <img
                src={person.profileImage}
                alt={person.name}
                className="w-32 h-32 md:w-44 md:h-44 rounded-full object-cover border-2 border-slate-900 shadow-2xl"
              />
              <div
                className="absolute bottom-4 right-4 bg-green-500 w-6 h-6 border-4 border-[#020617] rounded-full shadow-lg"
                title="Active Account"
              >
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {[
              { label: person.tag, color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/20' },
              { label: person.status, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/20' }
            ].map((badge, i) => (
              <span key={i} className={`px-4 py-1.5 ${badge.bg} border ${badge.border} ${badge.color} rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-sm`}>
                {badge.label}
              </span>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
            {person.name}
          </h1>

          {((person.birthDate && person.birthPlace) || (person.lastPosition && person.lastCompany)) && (
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 max-w-3xl mx-auto mb-12">
              {(person.birthDate || person.birthPlace) && (
                <div className="flex-1 flex items-center gap-4 p-5 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl hover:bg-white/[0.05] transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-500/10 rounded-xl text-blue-400">
                    <Calendar size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Born</p>
                    <p className="text-slate-200 text-sm font-medium leading-tight">
                      {person.birthDate} <span className="text-slate-600 mx-1">/</span> {person.birthPlace}
                    </p>
                  </div>
                </div>
              )}

              {person.lastPosition && person.lastCompany && (
                <div className="flex-1 flex items-center gap-4 p-5 bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl hover:bg-white/[0.05] transition-colors">
                  <div className="w-10 h-10 flex items-center justify-center bg-purple-500/10 rounded-xl text-purple-400">
                    <MapPin size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Current Role</p>
                    <p className="text-slate-200 text-sm font-medium leading-tight">
                      {person.lastPosition} <span className="text-slate-500 font-normal">at</span> {person.lastCompany}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {person.socials?.map((soc: any) => (
              <a
                key={soc.platform}
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-slate-900/50 border border-slate-800 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all flex items-center gap-2 group"
              >
                {soc.platform}
                <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto py-8 px-4 border-y border-white/[0.05] relative">
            <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-slate-700 to-transparent md:block hidden" />
            <div className="absolute left-2/3 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gradient-to-b from-transparent via-slate-700 to-transparent md:block hidden" />

            {[
              { val: totalImages, label: 'Images' },
              { val: person.family?.length, label: 'Family' },
              { val: person.chapters?.length, label: 'Chapters' }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl font-black text-white group-hover:scale-110 transition-transform duration-300">
                  {stat.val || 0}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        {((person.family && person.family.length > 0) ||
          (person.newsLinks && person.newsLinks.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">

              {person.family && person.family.length > 0 && (
                <div className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] p-8 rounded-[2rem] transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="flex items-center gap-3 text-white font-bold text-lg">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Users size={20} className="text-blue-400" />
                      </div>
                      Family Tree
                    </h3>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1 rounded-full">
                      {person.family.length} Members
                    </span>
                  </div>

                  <div className="grid gap-3">
                    {person.family?.map((f: any, i: number) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-colors group/item"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 group-hover/item:bg-blue-400 transition-colors" />
                          <span className="text-slate-200 font-medium text-sm">{f.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter border border-slate-800 px-2 py-0.5 rounded-md group-hover/item:border-slate-700 transition-colors">
                          {f.relation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {person.newsLinks && person.newsLinks.length > 0 && (
                <div className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] p-8 rounded-[2rem] transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="flex items-center gap-3 text-white font-bold text-lg">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Info size={20} className="text-purple-400" />
                      </div>
                      Featured News
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {person.newsLinks?.map((link: string, i: number) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-blue-500/5 hover:border-blue-500/20 transition-all group/link"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-400 group-hover/link:text-blue-400 transition-colors truncate">
                            {link.replace(/^https?:\/\/(www\.)?/, '')}
                          </p>
                        </div>
                        <ExternalLink size={14} className="text-slate-600 group-hover/link:text-blue-400 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        <div className="flex justify-between items-end mb-12">
          <div className="flex-1 text-center translate-x-12">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-slate-500">
              Timeline Chapters
            </h2>
          </div>

          <button
            onClick={() => setIsChapterModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <FolderPlus size={16} />
            <span className="hidden md:inline">Chapter Baru</span>
          </button>
        </div>
        <div className="space-y-6">
          {person.chapters?.map((chapter: any) => {
            const isOpen = openChapters.includes(chapter.id);

            return (
              <div
                key={chapter.id}
                className="border border-slate-800 rounded-4xl overflow-hidden bg-slate-900/20 backdrop-blur-sm transition-all duration-300"
              >
                <div className="flex items-center w-full pr-6 group/item">
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="flex-1 flex items-center gap-5 p-6 md:p-8 transition-colors text-left"
                  >
                    <div
                      className={`p-3 rounded-2xl ${isOpen ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"} transition-colors shadow-lg`}
                    >
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {chapter.title}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1">
                        {chapter.images.length} Photos •{" "}
                        {chapter.description.substring(0, 50)}...
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id={`upload-${chapter.id}`}
                      className="hidden"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => handleUploadMedia(chapter.id, e)}
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChapter(chapter.id);
                      }}
                      className="p-3 bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90"
                      title="Hapus Chapter"
                    >
                      <Trash2 size={20} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        document
                          .getElementById(`upload-${chapter.id}`)
                          ?.click();
                      }}
                      className="p-3 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-2xl transition-all active:scale-90"
                      title="Tambah Gambar/Video"
                    >
                      <ImagePlus size={20} />
                    </button>

                    <div
                      onClick={() => toggleChapter(chapter.id)}
                      className={`p-2 rounded-full border border-slate-700 transition-transform duration-300 ${isOpen ? "rotate-180 bg-slate-800" : "rotate-0"}`}
                    >
                      <ChevronDown size={20} className="text-slate-400" />
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="p-6 md:p-8 pt-0 border-t border-slate-800/50">
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                      {chapter.description}
                    </p>

                    <div className="max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {chapter.images.map((img: string, idx: number) => {
                          const isVideo = img.match(/\.(mp4|webm|ogg)$/i);

                          return (
                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 group cursor-pointer relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMedia(chapter.id, img);
                                }}
                                className="absolute top-2 left-2 z-10 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 shadow-xl"
                              >
                                <X size={12} />
                              </button>
                              {isVideo ? (
                                <video
                                  src={img}
                                  className="w-full h-full object-cover"
                                  muted
                                  onClick={() => setSelectedMedia(img)}
                                />
                              ) : (
                                <img
                                  src={img}
                                  alt="Media"
                                  onClick={() => setSelectedMedia(img)}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              )}
                              {isVideo && (
                                <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md">
                                  <Play size={12} className="text-white" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <AddChapterModal
        isOpen={isChapterModalOpen}
        onClose={() => setIsChapterModalOpen(false)}
        onSave={handleSaveChapter}
      />
    </div>
  );
}
