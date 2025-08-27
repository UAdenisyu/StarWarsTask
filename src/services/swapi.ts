import { type SwapiListResponse, type SwapiPerson } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE as string;

export function getPersonIdFromUrl(url: string): string {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export async function fetchPeople(page: number, search: string, signal?: AbortSignal): Promise<SwapiListResponse<SwapiPerson>> {
  const params = new URLSearchParams();
  if (page > 0) params.set("page", String(page));
  if (search) params.set("search", search);
  const res = await fetch(`${API_BASE}/people/?${params.toString()}`, { signal });
  if (!res.ok) throw new Error("Failed to load people");
  return res.json();
}

export async function fetchPersonById(id: string, signal?: AbortSignal): Promise<SwapiPerson> {
  const res = await fetch(`${API_BASE}/people/${id}/`, { signal });
  if (!res.ok) throw new Error("Person not found");
  return res.json();
}