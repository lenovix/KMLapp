import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import formidable, { IncomingForm } from "formidable";
import { Readable } from "stream";

// ⛔ WAJIB agar App Router tidak parsing body sendiri
export const dynamic = "force-dynamic";

/* helper: convert Web Request -> Node stream */
function requestToNodeStream(req: NextRequest) {
  const readable = new Readable();
  req.body
    ?.getReader()
    .read()
    .then(({ value }) => {
      readable.push(value);
      readable.push(null);
    });
  return readable as any;
}

export async function POST(req: NextRequest) {
  // Temp dir
  const tempDir = path.join(process.cwd(), "public", "tmp_upload");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const form = new IncomingForm({
    uploadDir: tempDir,
    keepExtensions: true,
    multiples: true,
  });

  try {
    const nodeReq = requestToNodeStream(req);

    const { fields, files } = await new Promise<any>((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const slug = Array.isArray(fields.slug) ? fields.slug[0] : fields.slug;
    const chapter = Array.isArray(fields.chapter)
      ? fields.chapter[0]
      : fields.chapter;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const language = Array.isArray(fields.language)
      ? fields.language[0]
      : fields.language;
    const order = Array.isArray(fields.order) ? fields.order[0] : fields.order;

    if (!slug || !chapter) {
      return NextResponse.json(
        { message: "slug & chapter required" },
        { status: 400 }
      );
    }

    /* === LOAD comics.json === */
    const comicsPath = path.join(process.cwd(), "data/komify", "comics.json");
    const comics = fs.existsSync(comicsPath)
      ? JSON.parse(fs.readFileSync(comicsPath, "utf-8"))
      : [];

    const comicIdx = comics.findIndex(
      (c: any) => String(c.slug) === String(slug)
    );
    if (comicIdx === -1)
      return NextResponse.json({ message: "Comic not found" }, { status: 404 });

    const chapterIdx = comics[comicIdx].chapters.findIndex(
      (c: any) => String(c.number) === String(chapter)
    );
    if (chapterIdx === -1)
      return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 }
      );

    /* === UPDATE METADATA === */
    comics[comicIdx].chapters[chapterIdx] = {
      ...comics[comicIdx].chapters[chapterIdx],
      title,
      language,
      uploadChapter: new Date()
        .toLocaleString("sv-SE", { timeZone: "Asia/Jakarta" })
        .replace("T", " "),
    };

    /* === HANDLE FILE UPLOAD === */
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "komify",
      String(slug),
      "chapters",
      String(chapter)
    );
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const uploadedFiles = files.files
      ? Array.isArray(files.files)
        ? files.files
        : [files.files]
      : [];

    const existingPages = comics[comicIdx].chapters[chapterIdx].pages || [];
    const startIndex = existingPages.length;

    const newPages: any[] = [];

    uploadedFiles.forEach((file: any, idx: number) => {
      const ext = path.extname(file.originalFilename || ".jpg");
      const filename = `page${startIndex + idx + 1}${ext}`;
      fs.renameSync(file.filepath, path.join(uploadDir, filename));
      newPages.push({
        id: `${Date.now()}_${Math.random()}`,
        filename,
      });
    });

    /* === ORDER HANDLING === */
    let finalPages = [...existingPages, ...newPages];
    if (order) {
      try {
        const orderArr: string[] = JSON.parse(order);
        finalPages = orderArr
          .map((name) => finalPages.find((p) => p.filename === name))
          .filter(Boolean);
      } catch {
        return NextResponse.json(
          { message: "Invalid order format" },
          { status: 400 }
        );
      }
    }

    comics[comicIdx].chapters[chapterIdx].pages = finalPages;

    fs.writeFileSync(comicsPath, JSON.stringify(comics, null, 2));

    return NextResponse.json({ message: "Chapter updated" });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: "Failed to update chapter", error: err.message },
      { status: 500 }
    );
  }
}
