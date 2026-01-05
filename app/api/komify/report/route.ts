import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REPORT_JSON_PATH = path.join(
  process.cwd(),
  "data/komify/reportList.json"
);

const SCREENSHOT_DIR = path.join(process.cwd(), "public/data/report");

export async function GET() {
  try {
    const reports = fs.existsSync(REPORT_JSON_PATH)
      ? JSON.parse(fs.readFileSync(REPORT_JSON_PATH, "utf-8"))
      : [];

    return NextResponse.json({ success: true, data: reports });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Gagal membaca report" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const formData = await req.formData();

  const screenshotFile = formData.get("screenshot") as File | null;

  let screenshotPath: string | null = null;

  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  if (screenshotFile && screenshotFile.size > 0) {
    const buffer = Buffer.from(await screenshotFile.arrayBuffer());

    const ext = path.extname(screenshotFile.name);
    const now = new Date();

    const datetime =
      now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "_" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const filename = `screenshot_${datetime}${ext}`;
    const fullPath = path.join(SCREENSHOT_DIR, filename);

    fs.writeFileSync(fullPath, buffer);

    screenshotPath = `/data/report/${filename}`;
  }

  const newReport = {
    id: Date.now(),

    comicId: Number(formData.get("comicId")),
    comicTitle: formData.get("comicTitle"),

    chapterNumber: formData.get("chapterNumber") || null,
    pageFilename: formData.get("pageFilename") || null,

    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),

    screenshot: screenshotPath,

    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const reports = fs.existsSync(REPORT_JSON_PATH)
    ? JSON.parse(fs.readFileSync(REPORT_JSON_PATH, "utf-8"))
    : [];

  reports.push(newReport);

  fs.writeFileSync(REPORT_JSON_PATH, JSON.stringify(reports, null, 2));

  return NextResponse.json({ success: true, data: newReport });
}
