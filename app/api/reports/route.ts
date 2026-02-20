import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

interface Report {
  id: string;
  type: "feature" | "bug";
  project: string;
  title: string;
  description: string;
  urgent: string;
  status: "OPEN" | "RESOLVED" | "CANCEL";
  createdAt: string;
  updatedAt?: string;
}

const DATA_PATH = path.join(process.cwd(), "data/reports.json");
async function readData(): Promise<Report[]> {
  try {
    const fileData = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(fileData);
  } catch {
    return [];
  }
}

export async function GET() {
  const reports = await readData();
  const sorted = reports.sort((a: Report, b: Report) => {
    const timeA = new Date(a.updatedAt || a.createdAt).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt).getTime();
    return timeB - timeA;
  });
  return NextResponse.json(sorted);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, project, title, description, urgent } = body;

    if (!type || !["feature", "bug"].includes(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const reports = await readData();

    const newReport: Report = {
      id: Date.now().toString(),
      type,
      project,
      title,
      description,
      urgent,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    reports.push(newReport);
    await fs.writeFile(DATA_PATH, JSON.stringify(reports, null, 2));
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error: " + error }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, type, project, title, description, status } = body;

    if (status && !["OPEN", "RESOLVED", "CANCEL"].includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    if (type && !["feature", "bug"].includes(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const reports = await readData();

    const index = reports.findIndex((r: Report) => r.id === id);
    if (index === -1)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    reports[index] = {
      ...reports[index],
      type: type || reports[index].type,
      project: project || reports[index].project,
      title: title || reports[index].title,
      description: description || reports[index].description,
      status: status || reports[index].status,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(DATA_PATH, JSON.stringify(reports, null, 2));
    return NextResponse.json(reports[index]);
  } catch (error) {
    return NextResponse.json({ message: "Error: " + error }, { status: 500 });
  }
}
