import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data/reports.json");
async function readData() {
  try {
    const fileData = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(fileData);
  } catch {
    return [];
  }
}

export async function GET() {
  const reports = await readData();
  const sorted = reports.sort((a: any, b: any) => {
    const timeA = new Date(a.updatedAt || a.createdAt).getTime();
    const timeB = new Date(b.updatedAt || b.createdAt).getTime();
    return timeB - timeA;
  });
  return NextResponse.json(sorted);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, project, title, description } = body;
    const reports = await readData();

    const newReport = {
      id: Date.now().toString(),
      type,
      project,
      title,
      description,
      status: "OPEN",
      createdAt: new Date().toISOString(),
    };

    reports.push(newReport);
    await fs.writeFile(DATA_PATH, JSON.stringify(reports, null, 2));
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, type, project, title, description, status } = body;
    let reports = await readData();

    const index = reports.findIndex((r: any) => r.id === id);
    if (index === -1)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    reports[index] = {
      ...reports[index],
      type,
      project,
      title,
      description,
      status,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(DATA_PATH, JSON.stringify(reports, null, 2));
    return NextResponse.json(reports[index]);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
