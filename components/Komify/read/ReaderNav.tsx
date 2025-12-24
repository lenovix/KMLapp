import Link from "next/link";

interface Chapter {
  number: string;
}

interface Comic {
  slug: number | string;
}

interface ReaderNavProps {
  comic: Comic;
  prev: Chapter | null;
  next: Chapter | null;
}

export default function ReaderNav({ comic, prev, next }: ReaderNavProps) {
  return (
    <div
      className="sticky top-0 z-10 flex justify-between items-center
      bg-white/70 dark:bg-slate-900/70 backdrop-blur
      py-3 mb-4 border-b border-slate-700"
    >
      {prev ? (
        <Link
          href={`/komify/${comic.slug}/read/${prev.number}`}
          className="btn-primary"
        >
          ← Chapter {prev.number}
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/komify/${comic.slug}/read/${next.number}`}
          className="btn-primary"
        >
          Chapter {next.number} →
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
