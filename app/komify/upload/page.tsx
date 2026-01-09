import UploadComicPage from "./UploadComicPage";
import { db } from "@/lib/db";

export default function Page() {
  const row = db
    .prepare(`SELECT MAX(CAST(slug AS INTEGER)) as maxSlug FROM comics`)
    .get() as { maxSlug: number | null };

  const nextSlug = (row?.maxSlug ?? 0) + 1;

  return <UploadComicPage defaultSlug={nextSlug} />;
}
