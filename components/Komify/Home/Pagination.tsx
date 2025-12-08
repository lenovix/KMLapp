interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded-lg ${
          currentPage === 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        First
      </button>
      {/* Previous Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 border rounded-lg ${
          currentPage === 1
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`px-3 py-1 rounded-lg border transition ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded-lg ${
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        Next
      </button>
      <button
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 border rounded-lg ${
          currentPage === totalPages
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
