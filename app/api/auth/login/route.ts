import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "users.json");

export async function POST(req: Request) {
  const { usernam, password } = await req.json();

  const users = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const user = users.find(
    (u: any) => u.usernam === usernam && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "usernam atau password salah" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Login berhasil",
    user: {
      id: user.id,
      username: user.username,
    },
  });
}
