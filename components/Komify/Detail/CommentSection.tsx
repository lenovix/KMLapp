import { useEffect, useState } from "react";
import { User } from "lucide-react";
import DialogBox from "@/components/UI/DialogBox";

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

  // Fetch komentar
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

  // Submit komentar baru
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

  // Hapus komentar
  const handleDelete = async (id: string) => {
    const previousComments = [...comments];

    // Optimistic delete
    setComments((prev) => prev.filter((c) => c.id !== id));

    try {
      await fetch(`/api/komify/comments?slug=${slug}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error(error);
      setComments(previousComments); // rollback jika gagal
    }
  };


  // Simpan hasil edit
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
            c.id === id
              ? {
                  ...c,
                  text: editingText,
                  timestamp: result.comment.timestamp,
                  edited: true,
                }
              : c
          )
        );
      }

      setEditingId(null);
      setEditingText("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  return (
    <>
      <div className="mt-12 border-t border-white/10 pt-8">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          Komentar
          <span className="text-sm text-gray-400">({comments.length})</span>
        </h3>

        {/* Form komentar */}
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            className="w-full p-4 rounded-xl bg-gray-900 text-gray-200 border border-white/10
                 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows={3}
            placeholder="Tulis komentar kamu..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg shadow text-white text-sm font-medium transition
          ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
            >
              {loading ? "Mengirim..." : "Kirim Komentar"}
            </button>
          </div>
        </form>

        {/* List Komentar */}
        <div className="space-y-4 bg-gray-900/40 border border-white/10 rounded-xl p-4">
          {[...comments]
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
            .map((cmt) => (
              <div
                key={cmt.id}
                className="p-4 bg-gray-800/50 border border-white/10 rounded-xl shadow-sm 
                     hover:shadow-lg hover:bg-gray-800/70 transition"
              >
                {editingId === cmt.id ? (
                  <div className="bg-gray-800 p-3 rounded-lg border border-white/10">
                    <textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="w-full p-3 bg-gray-900 text-gray-100 rounded-lg border border-white/10 
                           focus:ring-2 focus:ring-blue-500 outline-none"
                      rows={2}
                    />

                    <div className="flex justify-end gap-4 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditingText("");
                        }}
                        className="text-sm text-gray-400 hover:text-gray-200"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEdit(cmt.id)}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Text */}
                    <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                      {cmt.text}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 font-medium text-gray-300">
                        <User size={14} className="text-gray-400" />
                        {cmt.username}
                      </span>

                      <span className="flex items-center gap-1 text-gray-400">
                        {cmt.timestamp}
                        {cmt.edited && (
                          <span className="text-xs text-blue-400">
                            (edited)
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-1">
                      <button
                        onClick={() => {
                          setEditingId(cmt.id);
                          setEditingText(cmt.text);
                        }}
                        className="text-xs text-blue-400 hover:underline hover:text-blue-300"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setDeleteId(cmt.id);
                          setOpenDeleteDialog(true);
                        }}
                        className="text-xs text-red-400 hover:underline hover:text-red-300"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      {
        <DialogBox
          open={openDeleteDialog}
          title="Hapus Komentar?"
          desc="Komentar yang sudah dihapus tidak dapat dikembalikan."
          type="danger"
          confirmText="Hapus"
          cancelText="Batal"
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
      }
    </>
  );


}
