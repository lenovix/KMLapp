import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const jsonPath = path.join(process.cwd(), "data", "peoplefy", "people.json");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 500 });
    }

    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const people = JSON.parse(jsonData);
    const person = people.find((p: any) => String(p.id) === String(id));

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json(person);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
