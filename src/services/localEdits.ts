export type PersonPatch = Partial<{
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}>;

export type PersonEditPatch = PersonPatch;

const KEY_PREFIX = "swapi:person:";

export function loadPersonEdit(id: string): PersonPatch {
  const raw = localStorage.getItem(KEY_PREFIX + id);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as PersonPatch;
  } catch {
    return {};
  }
}

export function getPersonEdit(id: string): PersonPatch | null {
  const raw = localStorage.getItem(KEY_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PersonPatch;
  } catch {
    return null;
  }
}

export function savePersonEdit(id: string, patch: PersonPatch): void {
  localStorage.setItem(KEY_PREFIX + id, JSON.stringify(patch));
}

export function clearPersonEdit(id: string): void {
  localStorage.removeItem(KEY_PREFIX + id);
}
