import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Data tidak lengkap" },
      { status: 400 }
    );
  }

  const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const exists = users.find((u: any) => u.username === username);

  if (exists) {
    return NextResponse.json(
      { message: "User sudah terdaftar" },
      { status: 409 }
    );
  }

  users.push({
    id: Date.now(),
    username,
    password,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  return NextResponse.json({ message: "Register berhasil" });
}
