import fs from "fs";
import path from "path";
import UploadComicPage from "./UploadComicPage";

export default function Page() {
  const filePath = path.join(process.cwd(), "data/komify", "comics.json");

  let nextSlug = 1;
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const comics = JSON.parse(data);

    const lastSlug =
      comics.length > 0 ? parseInt(comics[comics.length - 1].slug) : 0;

    nextSlug = lastSlug + 1;
  } catch (err) {
    console.error("Gagal membaca comics.json:", err);
  }

  return <UploadComicPage defaultSlug={nextSlug} />;
}
