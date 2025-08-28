import { useCallback, useMemo, useState } from "react";
import { type SwapiCharacter } from "../services/types";
import {
  loadCharacterEdit,
  saveCharacterEdit,
  clearCharacterEdit,
  type CharacterEditPatch,
} from "../services/localEdits";

export function useLocalCharacter(base: SwapiCharacter | undefined, id: string) {
  const [patch, setPatch] = useState<CharacterEditPatch>(() => loadCharacterEdit(id));

  const merged = useMemo<SwapiCharacter | undefined>(() => {
    if (!base) return undefined;
    return { ...base, ...patch } as SwapiCharacter;
  }, [base, patch]);

  const update = useCallback(
    (field: keyof CharacterEditPatch, value: string) => {
      const next = { ...patch, [field]: value };
      setPatch(next);
      saveCharacterEdit(id, next);
    },
    [id, patch]
  );

  const save = useCallback(() => {
    saveCharacterEdit(id, patch);
  }, [id, patch]);

  const reset = useCallback(() => {
    setPatch({});
    clearCharacterEdit(id);
  }, [id]);

  return { merged, patch, update, save, reset };
}
