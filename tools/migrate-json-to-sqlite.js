const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const JSON_PATH = path.join(__dirname, "../data/komify/comics.json");
const DB_PATH = path.join(__dirname, "../data/komify/komify.db");

// ensure folder
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// ==========================
// Helpers
// ==========================
const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

const insertOrGetId = (table, name) => {
  db.prepare(`INSERT OR IGNORE INTO ${table} (name) VALUES (?)`).run(name);

  return db.prepare(`SELECT id FROM ${table} WHERE name = ?`).get(name).id;
};

// ==========================
// Schema
// ==========================
db.exec(`
CREATE TABLE IF NOT EXISTS comics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  title TEXT,
  category TEXT,
  status TEXT,
  uploaded_at TEXT,
  cover TEXT,
  rating REAL DEFAULT 0,
  bookmark INTEGER DEFAULT 0
);

CREATE TABLE tags (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
CREATE TABLE artists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
CREATE TABLE characters (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
CREATE TABLE parodies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
CREATE TABLE authors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE);
CREATE TABLE groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE
);

CREATE TABLE comic_tags (comic_id INTEGER, tag_id INTEGER, PRIMARY KEY (comic_id, tag_id));
CREATE TABLE comic_artists (comic_id INTEGER, artist_id INTEGER, PRIMARY KEY (comic_id, artist_id));
CREATE TABLE comic_characters (comic_id INTEGER, character_id INTEGER, PRIMARY KEY (comic_id, character_id));
CREATE TABLE comic_parodies (comic_id INTEGER, parody_id INTEGER, PRIMARY KEY (comic_id, parody_id));
CREATE TABLE comic_authors (comic_id INTEGER, author_id INTEGER, PRIMARY KEY (comic_id, author_id));
CREATE TABLE comic_groups (
  comic_id INTEGER,
  group_id INTEGER,
  PRIMARY KEY (comic_id, group_id)
);

CREATE TABLE chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  comic_id INTEGER,
  number TEXT,
  title TEXT,
  language TEXT,
  censored TEXT,
  uploaded_at TEXT
);

CREATE TABLE pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chapter_id INTEGER,
  page_order INTEGER,
  filename TEXT
);
`);

// ==========================
// Migration
// ==========================
const comics = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));

const insertComic = db.prepare(`
  INSERT OR IGNORE INTO comics
  (slug, title, category, status, uploaded_at, cover, rating, bookmark)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const getComicIdBySlug = db.prepare(`SELECT id FROM comics WHERE slug = ?`);

const insertChapter = db.prepare(`
  INSERT INTO chapters
  (comic_id, number, title, language, censored, uploaded_at)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertPage = db.prepare(`
  INSERT INTO pages
  (chapter_id, page_order, filename)
  VALUES (?, ?, ?)
`);

db.transaction(() => {
  for (const comic of comics) {
    insertComic.run(
      String(comic.slug),
      comic.title,
      comic.categories ?? null,
      comic.status,
      comic.uploaded,
      comic.cover,
      comic.rating ?? 0,
      comic.bookmark ? 1 : 0
    );

    const comicId = getComicIdBySlug.get(String(comic.slug)).id;

    // metadata
    normalizeArray(comic.tags).forEach((v) =>
      db
        .prepare(`INSERT OR IGNORE INTO comic_tags VALUES (?, ?)`)
        .run(comicId, insertOrGetId("tags", v))
    );

    normalizeArray(comic.artists).forEach((v) =>
      db
        .prepare(`INSERT OR IGNORE INTO comic_artists VALUES (?, ?)`)
        .run(comicId, insertOrGetId("artists", v))
    );

    normalizeArray(comic.characters).forEach((v) =>
      db
        .prepare(`INSERT OR IGNORE INTO comic_characters VALUES (?, ?)`)
        .run(comicId, insertOrGetId("characters", v))
    );

    normalizeArray(comic.parodies).forEach((v) =>
      db
        .prepare(`INSERT OR IGNORE INTO comic_parodies VALUES (?, ?)`)
        .run(comicId, insertOrGetId("parodies", v))
    );

    normalizeArray(comic.authors).forEach((v) =>
      db
        .prepare(`INSERT OR IGNORE INTO comic_authors VALUES (?, ?)`)
        .run(comicId, insertOrGetId("authors", v))
    );
    normalizeArray(comic.groups).forEach((v) =>
      db
        .prepare(`INSERT OR IGNORE INTO comic_groups VALUES (?, ?)`)
        .run(comicId, insertOrGetId("groups", v))
    );

    // chapters & pages
    for (const chapter of comic.chapters ?? []) {
      const ch = insertChapter.run(
        comicId,
        chapter.number,
        chapter.title,
        chapter.language,
        chapter.cencored,
        chapter.uploadChapter
      );

      chapter.pages.forEach((page, i) => {
        insertPage.run(ch.lastInsertRowid, i + 1, page.filename);
      });
    }
  }
})();

console.log("✅ Migration JSON → SQLite berhasil (clean & safe)");
