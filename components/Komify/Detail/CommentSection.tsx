"use client";

import { useEffect, useState } from "react";
import { User, MessageSquare, Send, Trash2, Edit3, Clock } from "lucide-react";
import DialogBox from "@/components/UI/DialogBox";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Comment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  edited?: boolean;
}

export default function CommentSection({ slug }: { slug: string }) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await fetch(`/api/komify/comments?slug=${slug}`);
        if (!res.ok) throw new Error("Gagal mengambil komentar");
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading comments:", err);
      }
    };
    loadComments();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/komify/comments?slug=${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const result = await res.json();
      if (result?.comment) {
        setComments((prev) => [result.comment, ...prev]);
        setText("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const previousComments = [...comments];
    setComments((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/komify/comments?slug=${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) setComments(previousComments);
    } catch (error) {
      setComments(previousComments);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editingText.trim()) return;
    try {
      const res = await fetch(`/api/komify/comments?slug=${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, text: editingText }),
      });
      const result = await res.json();
      if (result?.comment) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, text: editingText, edited: true } : c,
          ),
        );
      }
      setEditingId(null);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  return (
    <div className="mt-16 mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2.5 rounded-xl text-blue-500">
            <MessageSquare size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              Komentar
            </h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
              {comments.length} Komunitas Berdiskusi
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-12 relative group">
        <textarea
          className="w-full p-5 rounded-[24px] bg-zinc-900 text-zinc-200 border border-zinc-800
                     focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all
                     placeholder:text-zinc-600 font-medium leading-relaxed"
          rows={3}
          placeholder="Berikan pendapatmu tentang chapter ini..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="absolute bottom-4 right-4">
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 
                     disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-xs font-black 
                     uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
          >
            {loading ? (
              "Mengirim..."
            ) : (
              <>
                <Send size={14} /> Kirim
              </>
            )}
          </button>
        </div>
      </form>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {comments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[32px]"
            >
              <MessageSquare size={40} className="mx-auto mb-4 text-zinc-800" />
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
                Jadilah yang pertama berkomentar
              </p>
            </motion.div>
          ) : (
            [...comments]
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
              )
              .map((cmt) => (
                <motion.div
                  layout
                  key={cmt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-zinc-900/40 border border-zinc-800/60 rounded-[24px] p-6 hover:bg-zinc-900/80 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center text-zinc-400 border border-zinc-700">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-zinc-200 uppercase tracking-tight">
                          {cmt.username}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                          <Clock size={10} /> {dayjs(cmt.timestamp).fromNow()}
                          {cmt.edited && (
                            <span className="text-blue-500/80 ml-1">
                              • Edited
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingId(cmt.id);
                          setEditingText(cmt.text);
                        }}
                        className="p-2 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(cmt.id);
                          setOpenDeleteDialog(true);
                        }}
                        className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {editingId === cmt.id ? (
                    <div className="mt-2 space-y-3">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full p-4 bg-zinc-950 text-zinc-200 rounded-xl border border-blue-500/30 outline-none focus:ring-2 focus:ring-blue-500/10"
                        rows={2}
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleEdit(cmt.id)}
                          className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest"
                        >
                          Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                      {cmt.text}
                    </p>
                  )}
                </motion.div>
              ))
          )}
        </AnimatePresence>
      </div>

      <DialogBox
        open={openDeleteDialog}
        title="Hapus Komentar?"
        desc="Tindakan ini tidak dapat dibatalkan."
        type="danger"
        confirmText="Hapus Permanen"
        cancelText="Kembali"
        onCancel={() => {
          setDeleteId(null);
          setOpenDeleteDialog(false);
        }}
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId);
          setOpenDeleteDialog(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
