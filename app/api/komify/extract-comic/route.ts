import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

export async function POST(req: Request) {
  let browser = null;

  try {
    const { url } = await req.json();

    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--disable-infobars",
        "--window-position=-2000,0",
      ],
    });

    const page = await browser.newPage();

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    );

    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 25000,
      });
    } catch (gotoError: any) {
      console.error("[Network Error]:", gotoError.message);
      let friendlyMessage = "Koneksi Timeout. ";
      if (
        gotoError.message.includes("ERR_CONNECTION_TIMED_OUT") ||
        gotoError.message.includes("ERR_CONNECTION_REFUSED")
      ) {
        friendlyMessage +=
          "ISP kamu memblokir akses. Gunakan Cloudflare WARP atau VPN.";
      } else {
        friendlyMessage += gotoError.message;
      }
      throw new Error(friendlyMessage);
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    const extractedData: any = {
      title: "",
      Parodies: "",
      Characters: "",
      Tags: "",
      Artists: "",
      Groups: "",
    };

    if (url.includes("hentai2read.com")) {
      extractedData.title = $("h3.block-title a")
        .contents()
        .filter((_, el) => el.type === "text")
        .first()
        .text()
        .trim();

      $(".text-primary").each((_, element) => {
        const label = $(element).find("b").text().trim().replace(":", "");
        const tags: string[] = [];

        $(element)
          .find("a.tagButton")
          .each((_, tagEl) => {
            const val = $(tagEl).text().trim();
            if (val !== "-") tags.push(val);
          });

        const tagString = tags.join(", ");

        if (label === "Parody") extractedData.Parodies = tagString;
        if (label === "Artist") extractedData.Artists = tagString;
        if (label === "Character") extractedData.Characters = tagString;
        if (label === "Category" || label === "Content") {
          extractedData.Tags = extractedData.Tags
            ? `${extractedData.Tags}, ${tagString}`
            : tagString;
        }
      });
    } else {
      const infoDiv = $("#info");
      if (!infoDiv.length) {
        throw new Error(
          "Konten tidak ditemukan. Mungkin terkena Cloudflare Challenge.",
        );
      }

      extractedData.title = (
        infoDiv.find("h1.title").text() || infoDiv.find("h2.title").text()
      ).trim();

      infoDiv.find(".tag-container").each((_, element) => {
        const categoryText = $(element)
          .contents()
          .first()
          .text()
          .replace(":", "")
          .trim();
        const tags: string[] = [];
        $(element)
          .find(".tag .name")
          .each((_, nameEl) => {
            tags.push($(nameEl).text().trim());
          });

        if (extractedData.hasOwnProperty(categoryText)) {
          extractedData[categoryText] = tags.join(", ");
        }
      });
    }

    await browser.close();
    return NextResponse.json({ success: true, data: extractedData });
  } catch (error: any) {
    if (browser) await browser.close();
    console.error("[Final Scraping Error]:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Terjadi kesalahan pada server scraping.",
      },
      { status: 500 },
    );
  }
}
