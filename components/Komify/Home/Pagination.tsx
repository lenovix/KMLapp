import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const getVisiblePages = () => {
    const delta = 1;
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

  const btnBase =
    "flex items-center justify-center min-w-[38px] h-[38px] sm:min-w-[42px] sm:h-[42px] rounded-xl border transition-all duration-300 font-bold text-xs sm:text-sm active:scale-90";

  const btnActive =
    "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] z-10";

  const btnInactive =
    "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 backdrop-blur-sm";

  const btnDisabled =
    "opacity-20 cursor-not-allowed border-zinc-800 bg-zinc-900/30 text-zinc-600";

  return (
    <div className="flex flex-col items-center gap-4 mt-10 mb-10">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-2">
          {getVisiblePages().map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="w-8 text-center text-zinc-600 font-bold"
                >
                  ...
                </span>
              );
            }

            const active = currentPage === page;
            return (
              <button
                key={`page-${page}`}
                onClick={() => goToPage(page as number)}
                className={`${btnBase} ${active ? btnActive : btnInactive}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
