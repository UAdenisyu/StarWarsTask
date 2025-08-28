import { type SwapiListResponse, type SwapiCharacter } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE as string;

export const getCharacterIdFromUrl = (url: string): string => {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
};

export async function fetchCharacters(
  page: number,
  search: string,
  signal?: AbortSignal
): Promise<SwapiListResponse<SwapiCharacter>> {
  const params = new URLSearchParams();
  if (page > 0) params.set("page", String(page));
  if (search) params.set("search", search);
  const res = await fetch(`${API_BASE}/people/?${params.toString()}`, { signal });
  if (!res.ok) throw new Error("Failed to load characters");
  return res.json();
}

export async function fetchCharacterById(
  id: string,
  signal?: AbortSignal
): Promise<SwapiCharacter> {
  const res = await fetch(`${API_BASE}/people/${id}/`, { signal });
  if (!res.ok) throw new Error("Character not found");
  return res.json();
}
