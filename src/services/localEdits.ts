export type PersonEditPatch = Partial<{
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}>;

const KEY_PREFIX = "swapi:person:";

export function loadPersonEdit(id: string): PersonEditPatch {
  const raw = localStorage.getItem(KEY_PREFIX + id);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as PersonEditPatch;
  } catch {
    return {};
  }
}

export function savePersonEdit(id: string, patch: PersonEditPatch): void {
  localStorage.setItem(KEY_PREFIX + id, JSON.stringify(patch));
}

export function clearPersonEdit(id: string): void {
  localStorage.removeItem(KEY_PREFIX + id);
}