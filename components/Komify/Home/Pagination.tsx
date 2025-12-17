import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // Logika untuk menentukan angka mana saja yang muncul
  const getVisiblePages = () => {
    const delta = 2; // Jumlah angka di kiri dan kanan halaman aktif
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    range.unshift(1);
    if (currentPage + delta < totalPages - 1) range.push("...");
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const btnBase = "flex items-center justify-center min-w-[40px] h-10 px-3 rounded-xl border transition-all duration-200 font-medium text-sm";
  const btnActive = "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30";
  const btnInactive = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700";
  const btnDisabled = "opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-700";

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-20 mb-6">
      {/* First Page */}
      <button
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        title="First Page"
      >
        <ChevronsLeft size={18} />
      </button>

      {/* Prev Page */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {getVisiblePages().map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className="px-2 text-slate-400">
                ...
              </span>
            );
          }

          return (
            <button
              key={`page-${page}`}
              onClick={() => goToPage(page as number)}
              className={`${btnBase} ${
                currentPage === page ? btnActive : btnInactive
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Page */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
      >
        <ChevronRight size={18} />
      </button>

      {/* Last Page */}
      <button
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
        title="Last Page"
      >
        <ChevronsRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
