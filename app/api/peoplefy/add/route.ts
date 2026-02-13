import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { profileImage, chapters, ...otherData } = body;

        const jsonPath = path.join(process.cwd(), "data", "peoplefy", "people.json");
        const basePublicPath = path.join(process.cwd(), "public", "peoplefy");

        let people = [];
        if (fs.existsSync(jsonPath)) {
            people = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
        }
        const lastId = people.length > 0 ? Math.max(...people.map((p: any) => parseInt(p.id))) : 0;
        const newPersonId = lastId + 1;
        const personFolder = path.join(basePublicPath, newPersonId.toString());

        if (!fs.existsSync(personFolder)) {
            fs.mkdirSync(personFolder, { recursive: true });
        }

        let profileImageUrl = "";
        if (profileImage && profileImage.includes("base64")) {
            const base64Data = profileImage.replace(/^data:image\/\w+;base64,/, "");
            const extension = profileImage.split(';')[0].split('/')[1] || 'png';
            const fileName = `profile.${extension}`;
            fs.writeFileSync(path.join(personFolder, fileName), base64Data, 'base64');
            profileImageUrl = `/peoplefy/${newPersonId}/${fileName}`;
        }

        const processedChapters = chapters.map((chapter: any, index: number) => {
            const newChapterId = index + 1;
            const chapterFolder = path.join(personFolder, newChapterId.toString());

            if (!fs.existsSync(chapterFolder)) {
                fs.mkdirSync(chapterFolder, { recursive: true });
            }

            const savedImagePaths = (chapter.images || []).map((imgBase64: string, imgIndex: number) => {
                if (imgBase64.includes("base64")) {
                    const base64Data = imgBase64.replace(/^data:image\/\w+;base64,/, "");
                    const extension = imgBase64.split(';')[0].split('/')[1] || 'jpg';
                    const fileName = `img_${imgIndex + 1}.${extension}`;

                    fs.writeFileSync(path.join(chapterFolder, fileName), base64Data, 'base64');
                    return `/peoplefy/${newPersonId}/${newChapterId}/${fileName}`;
                }
                return imgBase64;
            });

            return {
                ...chapter,
                id: newChapterId,
                images: savedImagePaths
            };
        });

        const newPerson = {
            id: newPersonId,
            ...otherData,
            profileImage: profileImageUrl,
            chapters: processedChapters,
            createdAt: new Date().toISOString()
        };

        people.push(newPerson);
        fs.writeFileSync(jsonPath, JSON.stringify(people, null, 2));

        return NextResponse.json({ success: true, id: newPersonId });
    } catch (error) {
        console.error("Critical Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}