export type SwapiListResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type SwapiCharacter = {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender:
    | "male"
    | "female"
    | "n/a"
    | "hermaphrodite"
    | "none"
    | "unknown"
    | "masculine programming"
    | "feminine programming"
    | "no gender programming";
  url: string;
};
