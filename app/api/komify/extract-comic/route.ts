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
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    );

    await page.setCookie({
      name: "nw",
      value: "1",
      domain: ".e-hentai.org",
    });

    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });
    } catch (gotoError: any) {
      console.error("[Network Error]:", gotoError.message);
      let friendlyMessage = "Koneksi Timeout. ";
      if (gotoError.message.includes("ERR_CONNECTION_TIMED_OUT")) {
        friendlyMessage += "ISP kamu memblokir akses atau server tujuan sibuk.";
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
    } else if (url.includes("e-hentai.org")) {
      try {
        await page.waitForSelector("#gn", { timeout: 15000 });
      } catch (e) {
        throw new Error(
          "Gagal menemukan elemen data. E-Hentai mungkin membatasi akses bot kamu.",
        );
      }

      const ehHtml = await page.content();
      const $eh = cheerio.load(ehHtml);

      extractedData.title = $eh("#gn").text().trim();
      const categoryLabel = $eh("#gdc div").text().trim();
      if (categoryLabel) extractedData.Categories = categoryLabel;

      $eh("#taglist table tr").each((_, row) => {
        const categoryRaw = $eh(row).find("td.tc").text().trim().toLowerCase();
        const category = categoryRaw.replace(":", "");
        const tags: string[] = [];

        $eh(row)
          .find("td:nth-child(2) div a")
          .each((_, tagEl) => {
            const cleanText = $eh(tagEl).text().split(" | ")[0].trim();
            if (cleanText) tags.push(cleanText);
          });

        if (tags.length === 0) return;
        const tagString = tags.join(", ");

        switch (category) {
          case "parody":
            extractedData.Parodies = tagString;
            break;
          case "character":
            extractedData.Characters = tagString;
            break;
          case "artist":
            extractedData.Artists = tagString;
            break;
          case "group":
            extractedData.Groups = tagString;
            break;
          default:
            if (extractedData.Tags) extractedData.Tags += `, ${tagString}`;
            else extractedData.Tags = tagString;
            break;
        }
      });
    } else {
      const infoDiv = $("#info");
      if (!infoDiv.length)
        throw new Error(
          "Konten tidak ditemukan. Mungkin terkena Cloudflare Challenge.",
        );

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
    console.log("DEBUG EXTRACTED:", extractedData);
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
