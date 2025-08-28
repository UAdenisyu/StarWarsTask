import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useLocalCharacter } from "./useLocalCharacter";
import type { SwapiCharacter } from "../services/types";

vi.mock("../services/localEdits", async () => {
  const actual =
    await vi.importActual<typeof import("../services/localEdits")>("../services/localEdits");
  return {
    ...actual,
    loadCharacterEdit: vi.fn(),
    saveCharacterEdit: vi.fn(),
    clearCharacterEdit: vi.fn(),
  };
});

import {
  loadCharacterEdit,
  saveCharacterEdit,
  clearCharacterEdit,
  type CharacterEditPatch,
} from "../services/localEdits";

const makeBase = (over: Partial<SwapiCharacter> = {}): SwapiCharacter =>
  ({
    name: "Luke Skywalker",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    birth_year: "19BBY",
    gender: "male",
    homeworld: "https://swapi.dev/api/planets/1/",
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    created: "",
    edited: "",
    url: "https://swapi.dev/api/people/1/",
    ...over,
  }) as SwapiCharacter;

describe("useLocalCharacter", () => {
  const id = "1";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns undefined merged while base is undefined", () => {
    (loadCharacterEdit as Mock).mockReturnValue({});

    const { result } = renderHook(() => useLocalCharacter(undefined, id));
    expect(result.current.merged).toBeUndefined();
  });

  it("initializes patch from local storage and merges over base", () => {
    const initialPatch: CharacterEditPatch = { name: "Master Luke", gender: "male" };
    (loadCharacterEdit as Mock).mockReturnValue(initialPatch);

    const base = makeBase({ name: "Luke Skywalker", gender: "male" });

    const { result } = renderHook(() => useLocalCharacter(base, id));

    expect(loadCharacterEdit).toHaveBeenCalledWith(id);
    expect(result.current.patch).toEqual(initialPatch);
    expect(result.current.merged?.name).toBe("Master Luke");
    expect(result.current.merged?.gender).toBe("male");
  });

  it("update() updates patch and persists with saveCharacterEdit", () => {
    (loadCharacterEdit as Mock).mockReturnValue({});
    const base = makeBase();

    const { result } = renderHook(() => useLocalCharacter(base, id));

    act(() => {
      result.current.update("name", "Farmboy Luke");
    });

    expect(result.current.patch).toEqual({ name: "Farmboy Luke" });
    expect(saveCharacterEdit).toHaveBeenCalledWith(id, { name: "Farmboy Luke" });
    expect(result.current.merged?.name).toBe("Farmboy Luke");

    act(() => {
      result.current.update("gender", "unknown");
    });

    expect(result.current.patch).toEqual({ name: "Farmboy Luke", gender: "unknown" });
    expect(saveCharacterEdit).toHaveBeenLastCalledWith(id, {
      name: "Farmboy Luke",
      gender: "unknown",
    });
  });

  it("save() persists current patch without changing it", () => {
    (loadCharacterEdit as Mock).mockReturnValue({ name: "Luke" });
    const base = makeBase();

    const { result } = renderHook(() => useLocalCharacter(base, id));

    act(() => {
      result.current.save();
    });

    expect(saveCharacterEdit).toHaveBeenCalledWith(id, { name: "Luke" });
    expect(result.current.patch).toEqual({ name: "Luke" });
  });

  it("reset() clears patch and calls clearCharacterEdit", () => {
    (loadCharacterEdit as Mock).mockReturnValue({ name: "Jedi Luke" });
    const base = makeBase({ name: "Luke Skywalker" });

    const { result } = renderHook(() => useLocalCharacter(base, id));

    act(() => {
      result.current.reset();
    });

    expect(clearCharacterEdit).toHaveBeenCalledWith(id);
    expect(result.current.patch).toEqual({});
    expect(result.current.merged?.name).toBe("Luke Skywalker");
  });
});
