import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const jsonPath = path.join(process.cwd(), "data", "peoplefy", "people.json");

export async function POST(request: Request) {
    try {
        const { chapterId, mediaUrl } = await request.json();

        if (!chapterId || !mediaUrl) {
            return NextResponse.json(
                { error: "Missing chapterId or mediaUrl" },
                { status: 400 }
            );
        }

        if (!fs.existsSync(jsonPath)) {
            return NextResponse.json({ error: "Data file not found" }, { status: 500 });
        }

        const jsonData = fs.readFileSync(jsonPath, "utf-8");
        let people = JSON.parse(jsonData);

        let fileDeleted = false;

        people = people.map((person: any) => {
            const updatedChapters = person.chapters.map((chapter: any) => {
                if (String(chapter.id) === String(chapterId)) {
                    chapter.images = chapter.images.filter((img: string) => {
                        if (img === mediaUrl) {
                            fileDeleted = true;
                            return false;
                        }
                        return true;
                    });
                }
                return chapter;
            });
            return { ...person, chapters: updatedChapters };
        });

        if (!fileDeleted) {
            return NextResponse.json({ error: "Media not found in database" }, { status: 404 });
        }

        const filePath = path.join(process.cwd(), "public", mediaUrl);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        fs.writeFileSync(jsonPath, JSON.stringify(people, null, 2));

        return NextResponse.json({ message: "Media deleted successfully" });
    } catch (error) {
        console.error("Delete Media Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}