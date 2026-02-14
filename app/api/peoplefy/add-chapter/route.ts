import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { personId, title, description } = await request.json();

    const jsonPath = path.join(
      process.cwd(),
      "data",
      "peoplefy",
      "people.json",
    );
    const fileData = await fs.readFile(jsonPath, "utf-8");
    const people = JSON.parse(fileData);

    const personIndex = people.findIndex((p: any) => p.id === personId);
    if (personIndex === -1)
      return NextResponse.json({ error: "Person not found" }, { status: 404 });

    const person = people[personIndex];

    const lastChapterId =
      person.chapters.length > 0
        ? Math.max(...person.chapters.map((c: any) => c.id))
        : 0;
    const newId = lastChapterId + 1;

    const newFolderName = `chapter_${newId}`;
    const folderPath = path.join(
      process.cwd(),
      "public",
      "peoplefy",
      String(personId),
      newFolderName,
    );

    await fs.mkdir(folderPath, { recursive: true });

    const newChapter = {
      id: newId,
      title,
      description,
      images: [],
      createdAt: new Date().toISOString(),
    };

    person.chapters.push(newChapter);
    person.updatedAt = new Date().toISOString();

    await fs.writeFile(jsonPath, JSON.stringify(people, null, 2));

    return NextResponse.json({ success: true, chapter: newChapter });
  } catch (error) {
    console.error("Error saving chapter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
