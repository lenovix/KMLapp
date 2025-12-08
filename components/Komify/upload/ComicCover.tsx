interface ComicCoverProps {
  cover: string | null;
  onClick: () => void;
  onDelete: () => void;
}

export default function ComicCover({ cover, onClick, onDelete }: ComicCoverProps) {
  return (
    <div
      className="w-full h-[390] border-2 border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition relative"
      onClick={onClick}
    >
      {cover ? (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow hover:bg-red-600 z-20"
          >
            Delete
          </button>

          <img
            src={cover}
            className="object-cover w-full h-full rounded-xl z-10"
          />
        </>
      ) : (
        <p className="text-gray-500 text-sm">Klik di sini untuk upload cover</p>
      )}
    </div>
  );
}
