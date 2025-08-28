export type CharacterPatch = Partial<{
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
}>;

export type CharacterEditPatch = CharacterPatch;

const KEY_PREFIX = "swapi:character:";

export function loadCharacterEdit(id: string): CharacterPatch {
  const raw = localStorage.getItem(KEY_PREFIX + id);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as CharacterPatch;
  } catch {
    return {};
  }
}

export function getCharacterEdit(id: string): CharacterPatch | null {
  const raw = localStorage.getItem(KEY_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CharacterPatch;
  } catch {
    return null;
  }
}

export function saveCharacterEdit(id: string, patch: CharacterPatch): void {
  localStorage.setItem(KEY_PREFIX + id, JSON.stringify(patch));
}

export function clearCharacterEdit(id: string): void {
  localStorage.removeItem(KEY_PREFIX + id);
}
