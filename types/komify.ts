export interface ComicPage {
  id: string;
  filename: string;
}

export interface Chapter {
  number: string;
  title: string;
  language: string;
  cencored: "Cencored" | "Uncencored";
  uploadChapter: string;
  pages: ComicPage[];
}

export interface Comic {
  slug: number;
  title: string | string[];
  parodies: string[] | null;
  characters: string[] | null;
  artists: string[] | null;
  groups: string[] | null;
  categories: string;
  authors: string[] | null;
  tags: string[];
  status: "Ongoing" | "Completed" | "Hiatus";
  uploaded: string;
  cover: string;
  rating: number;
  bookmark: boolean;
  chapters: Chapter[];
}

export interface RatingsMap {
  [slug: string]: number;
}
