import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const REPORT_PATH = path.join(process.cwd(), "data/komify/reportList.json");

const SCREENSHOT_DIR = path.join(process.cwd(), "public/data/report");

function readReports() {
  return JSON.parse(fs.readFileSync(REPORT_PATH, "utf-8"));
}

function writeReports(data: any) {
  fs.writeFileSync(REPORT_PATH, JSON.stringify(data, null, 2));
}

export async function PATCH(req: Request, context: any) {
  const { id } = await context.params;

  const { status } = await req.json();
  const reports = readReports();

  const index = reports.findIndex((r: any) => String(r.id) === String(id));

  if (index === -1) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  reports[index].status = status;
  reports[index].updatedAt = new Date().toISOString();

  writeReports(reports);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: Request, context: any) {
  const { id } = await context.params;

  const reports = readReports();
  const index = reports.findIndex((r: any) => String(r.id) === String(id));

  if (index === -1) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const report = reports[index];

  report.deletedAt = new Date().toISOString();
  report.status = "deleted";

  if (report.screenshot) {
    const filename = path.basename(report.screenshot);
    const filePath = path.join(SCREENSHOT_DIR, filename);

    if (fs.existsSync(filePath) && filePath.startsWith(SCREENSHOT_DIR)) {
      fs.unlinkSync(filePath);
    }
  }

  writeReports(reports);
  return NextResponse.json({ success: true });
}
