import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const jsonPath = path.join(process.cwd(), "data", "peoplefy", "people.json");
const uploadBaseDir = path.join(process.cwd(), "public", "peoplefy");

const getPeopleData = () => {
  if (!fs.existsSync(jsonPath)) return [];
  const jsonData = fs.readFileSync(jsonPath, "utf-8");
  return JSON.parse(jsonData);
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const people = getPeopleData();
    const person = people.find((p: any) => String(p.id) === String(id));

    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    return NextResponse.json(person);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    let people = getPeopleData();

    const personIndex = people.findIndex((p: any) => String(p.id) === String(id));

    if (personIndex === -1) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    const personFolder = path.join(uploadBaseDir, String(id));
    if (fs.existsSync(personFolder)) {
      fs.rmSync(personFolder, { recursive: true, force: true });
    }

    people.splice(personIndex, 1);
    fs.writeFileSync(jsonPath, JSON.stringify(people, null, 2));

    return NextResponse.json({ message: "Data and files deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 },
    );
  }
}