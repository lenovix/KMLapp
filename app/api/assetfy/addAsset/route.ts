import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const newAsset = await request.json();
    const filePath = path.join(process.cwd(), "data", "assetfy", "assets.json");

    let assets = [];
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf-8");
      assets = JSON.parse(fileData);
    }

    let newIdNumber = 1;

    if (assets.length > 0) {
      const lastId = assets[assets.length - 1].id;

      const lastNumber = parseInt(lastId.split("-")[1]);

      newIdNumber = lastNumber + 1;
    }

    const formattedId = `AST-${newIdNumber.toString().padStart(3, "0")}`;

    const assetWithMeta = {
      id: formattedId,
      ...newAsset,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString(),
    };

    assets.push(assetWithMeta);
    fs.writeFileSync(filePath, JSON.stringify(assets, null, 2));

    return NextResponse.json(
      { message: "Asset berhasil ditambahkan!", data: assetWithMeta },
      { status: 201 },
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan data" },
      { status: 500 },
    );
  }
}
