import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const jsonPath = path.join(process.cwd(), "data", "peoplefy", "people.json");
const uploadBaseDir = path.join(process.cwd(), "public", "peoplefy");

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id: chapterId } = await params;

        if (!fs.existsSync(jsonPath)) {
            return NextResponse.json({ error: "Data file not found" }, { status: 500 });
        }

        const jsonData = fs.readFileSync(jsonPath, "utf-8");
        let people = JSON.parse(jsonData);

        let targetPersonId = "";
        let chapterFound = false;

        people = people.map((person: any) => {
            const initialLength = person.chapters.length;

            const updatedChapters = person.chapters.filter((c: any) => {
                if (String(c.id) === String(chapterId)) {
                    chapterFound = true;
                    targetPersonId = String(person.id);
                    return false;
                }
                return true;
            });

            return { ...person, chapters: updatedChapters };
        });

        if (!chapterFound) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        if (targetPersonId) {
            const chapterFolder = path.join(uploadBaseDir, targetPersonId, String(chapterId));
            if (fs.existsSync(chapterFolder)) {
                fs.rmSync(chapterFolder, { recursive: true, force: true });
            }
        }

        fs.writeFileSync(jsonPath, JSON.stringify(people, null, 2));

        return NextResponse.json({ message: "Chapter and files deleted successfully" });
    } catch (error) {
        console.error("Delete Chapter Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 },
        );
    }
}