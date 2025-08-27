import { useMemo, useState } from "react";
import { type SwapiPerson } from "../services/types";
import { loadPersonEdit, savePersonEdit, clearPersonEdit, type PersonEditPatch } from "../services/localEdits";

export function useLocalPerson(base: SwapiPerson | undefined, id: string) {
  const [patch, setPatch] = useState<PersonEditPatch>(() => loadPersonEdit(id));

  const merged = useMemo<SwapiPerson | undefined>(() => {
    if (!base) return undefined;
    return { ...base, ...patch } as SwapiPerson;
  }, [base, patch]);

  function update(field: keyof PersonEditPatch, value: string) {
    const next = { ...patch, [field]: value };
    setPatch(next);
  }

  function save() {
    savePersonEdit(id, patch);
  }

  function reset() {
    setPatch({});
    clearPersonEdit(id);
  }

  return { merged, patch, update, save, reset };
}