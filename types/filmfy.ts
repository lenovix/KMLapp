export interface FilmPart {
  order: number;
  title: string;
  note?: string;
  folder: string;
}

export interface Film {
  id: number;
  title: string;
  code: string;
  cencored: string;
  isDeleted: boolean;
  releaseDate: string;
  director: string;
  maker: string;
  label: string;
  genre: string[];
  cast: string[];
  series: string | null;
  cover: string | null;
  parts: FilmPart[];
  createdAt: string;
  isFavorite: boolean;
  rating: number | null;
}

export interface CastPhysical {
  height?: string;
  measurements?: string;
  cup?: string;
  shoeSize?: string;
  hairLength?: string;
  hairColor?: string;
}

export interface CastProfile {
  hobbies?: string;
  specialSkills?: string;
}

export interface CastDebut {
  reason?: string;
  start?: string;
  end?: string;
}

export interface CastGallery {
  name: string;
  order: number;
  addImageDate: string;
}

export interface Cast {
  slug: string;
  name: string;
  alias?: string;
  birthDate?: string;
  age?: string;
  birthplace?: string;
  sign?: string;
  blood?: string;
  avatar?: string;
  description?: string;
  updatedAt?: string;
  physical?: CastPhysical;
  profile?: CastProfile;
  debut?: CastDebut;
  tags?: string[];
  gallery?: CastGallery[];
  debutReason?: string;
  debutStart?: string;
  debutEnd?: string;
}
