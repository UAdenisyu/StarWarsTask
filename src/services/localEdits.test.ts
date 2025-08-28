import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  loadCharacterEdit,
  getCharacterEdit,
  saveCharacterEdit,
  clearCharacterEdit,
  type CharacterPatch,
} from "./localEdits";

// Helper to build the storage key used by the module under test
const key = (id: string) => `swapi:character:${id}`;

// In JSDOM, localStorage methods live on Storage.prototype
const storageProto = Object.getPrototypeOf(window.localStorage);

describe("localEdits storage helpers", () => {
  let getSpy: ReturnType<typeof vi.spyOn>;
  let setSpy: ReturnType<typeof vi.spyOn>;
  let removeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getSpy = vi.spyOn(storageProto, "getItem");
    setSpy = vi.spyOn(storageProto, "setItem");
    removeSpy = vi.spyOn(storageProto, "removeItem");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loadCharacterEdit", () => {
    it("returns {} when there is no saved value", () => {
      getSpy.mockReturnValueOnce(null);
      const result = loadCharacterEdit("1");
      expect(result).toEqual({});
      expect(getSpy).toHaveBeenCalledWith(key("1"));
    });

    it("returns parsed object when JSON is valid", () => {
      const patch: CharacterPatch = { name: "Master Luke", gender: "male" };
      getSpy.mockReturnValueOnce(JSON.stringify(patch));
      const result = loadCharacterEdit("1");
      expect(result).toEqual(patch);
      expect(getSpy).toHaveBeenCalledWith(key("1"));
    });

    it("returns {} when JSON is invalid", () => {
      getSpy.mockReturnValueOnce("{not: valid json");
      const result = loadCharacterEdit("1");
      expect(result).toEqual({});
      expect(getSpy).toHaveBeenCalledWith(key("1"));
    });
  });

  describe("getCharacterEdit", () => {
    it("returns null when there is no saved value", () => {
      getSpy.mockReturnValueOnce(null);
      const result = getCharacterEdit("2");
      expect(result).toBeNull();
      expect(getSpy).toHaveBeenCalledWith(key("2"));
    });

    it("returns parsed object when JSON is valid", () => {
      const patch: CharacterPatch = { name: "Leia Organa", gender: "female" };
      getSpy.mockReturnValueOnce(JSON.stringify(patch));
      const result = getCharacterEdit("3");
      expect(result).toEqual(patch);
      expect(getSpy).toHaveBeenCalledWith(key("3"));
    });

    it("returns null when JSON is invalid", () => {
      getSpy.mockReturnValueOnce("oops");
      const result = getCharacterEdit("3");
      expect(result).toBeNull();
      expect(getSpy).toHaveBeenCalledWith(key("3"));
    });
  });

  describe("saveCharacterEdit", () => {
    it("serializes and saves to localStorage with correct key", () => {
      const patch: CharacterPatch = { name: "Han Solo", gender: "male" };
      saveCharacterEdit("5", patch);
      expect(setSpy).toHaveBeenCalledWith(key("5"), JSON.stringify(patch));
    });
  });

  describe("clearCharacterEdit", () => {
    it("removes the stored entry with correct key", () => {
      clearCharacterEdit("7");
      expect(removeSpy).toHaveBeenCalledWith(key("7"));
    });
  });
});
