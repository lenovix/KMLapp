import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { profileImage, chapters, ...otherData } = body;

    const dataDir = path.join(process.cwd(), "data", "peoplefy");
    const jsonPath = path.join(dataDir, "people.json");
    const basePublicPath = path.join(process.cwd(), "public", "peoplefy");

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let people = [];
    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, "utf8");
      people = fileContent ? JSON.parse(fileContent) : [];
    }

    const lastId =
      people.length > 0
        ? Math.max(...people.map((p: any) => parseInt(p.id)))
        : 0;
    const newPersonId = lastId + 1;
    const personFolder = path.join(basePublicPath, newPersonId.toString());

    if (!fs.existsSync(personFolder)) {
      fs.mkdirSync(personFolder, { recursive: true });
    }

    let profileImageUrl = "";
    if (profileImage && profileImage.includes("base64")) {
      const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, "");
      const match = profileImage.match(/^data:image\/(\w+);base64,/);
      const extension = match ? match[1] : "png";
      const fileName = `profile.${extension}`;
      fs.writeFileSync(path.join(personFolder, fileName), base64Data, "base64");
      profileImageUrl = `/peoplefy/${newPersonId}/${fileName}`;
    }

    const processedChapters = (chapters || []).map(
      (chapter: any, index: number) => {
        const chapterId = index + 1;
        const chapterFolder = path.join(personFolder, `chapter_${chapterId}`);

        if (!fs.existsSync(chapterFolder)) {
          fs.mkdirSync(chapterFolder, { recursive: true });
        }

        const savedImagePaths = (chapter.images || []).map(
          (imgBase64: string, imgIndex: number) => {
            if (imgBase64 && imgBase64.includes("base64")) {
              const base64Data = imgBase64.replace(
                /^data:image\/\w+;base64,/,
                "",
              );
              const match = imgBase64.match(/^data:image\/(\w+);base64,/);
              const extension = match ? match[1] : "jpg";
              const fileName = `img_${imgIndex + 1}.${extension}`;
              fs.writeFileSync(
                path.join(chapterFolder, fileName),
                base64Data,
                "base64",
              );
              return `/peoplefy/${newPersonId}/chapter_${chapterId}/${fileName}`;
            }
            return imgBase64;
          },
        );

        return {
          ...chapter,
          id: chapterId,
          images: savedImagePaths,
        };
      },
    );

    const newPerson = {
      id: newPersonId,
      ...otherData,
      profileImage: profileImageUrl,
      chapters: processedChapters,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    people.push(newPerson);
    fs.writeFileSync(jsonPath, JSON.stringify(people, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      id: newPersonId,
      message: "Profile created successfully",
    });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
