import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const personId = formData.get("personId");
    const chapterId = formData.get("chapterId");

    if (!file || !personId || !chapterId) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 },
      );
    }

    const folderPath = path.join(
      process.cwd(),
      "public",
      "peoplefy",
      String(personId),
      `chapter_${chapterId}`,
    );

    await fs.mkdir(folderPath, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = path.extname(file.name);
    const fileName = `media_${Date.now()}${fileExtension}`;
    const filePath = path.join(folderPath, fileName);

    await fs.writeFile(filePath, buffer);

    const jsonPath = path.join(
      process.cwd(),
      "data",
      "peoplefy",
      "people.json",
    );
    const people = JSON.parse(await fs.readFile(jsonPath, "utf-8"));

    const personIndex = people.findIndex((p: any) => p.id === Number(personId));
    const chapterIndex = people[personIndex].chapters.findIndex(
      (c: any) => c.id === Number(chapterId),
    );

    const publicPath = `/peoplefy/${personId}/chapter_${chapterId}/${fileName}`;
    people[personIndex].chapters[chapterIndex].images.push(publicPath);
    people[personIndex].updatedAt = new Date().toISOString();

    await fs.writeFile(jsonPath, JSON.stringify(people, null, 2));

    return NextResponse.json({ success: true, url: publicPath });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload gagal" }, { status: 500 });
  }
}
