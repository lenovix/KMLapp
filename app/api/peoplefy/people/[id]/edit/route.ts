import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const jsonPath = path.join(process.cwd(), "data", "peoplefy", "people.json");

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!fs.existsSync(jsonPath)) {
            return NextResponse.json({ error: "File not found" }, { status: 500 });
        }

        const jsonData = fs.readFileSync(jsonPath, "utf-8");
        let people = JSON.parse(jsonData);

        const index = people.findIndex((p: any) => String(p.id) === String(id));

        if (index === -1) {
            return NextResponse.json({ error: "Person not found" }, { status: 404 });
        }

        people[index] = {
            ...people[index],
            ...body,
            updatedAt: new Date().toISOString()
        };

        fs.writeFileSync(jsonPath, JSON.stringify(people, null, 2));

        return NextResponse.json({ message: "Updated successfully", data: people[index] });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}