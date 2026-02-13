import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const jsonPath = path.join(process.cwd(), "data", "peoplefy", "people.json");

const getPeople = () => {
    try {
        if (!fs.existsSync(jsonPath)) {
            return [];
        }
        const jsonData = fs.readFileSync(jsonPath, "utf-8");
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return [];
    }
};

export async function GET() {
    try {
        const people = getPeople();
        return NextResponse.json(people, {
            status: 200,
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch people" },
            { status: 500 }
        );
    }
}