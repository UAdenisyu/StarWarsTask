import "@testing-library/jest-dom/vitest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import * as swapiModule from "../services/swapi";
import CharacterCard from "./CharacterCard";
import type { SwapiCharacter } from "../services/types";

const baseCharacter: SwapiCharacter = {
  name: "Luke Skywalker",
  height: "172",
  mass: "77",
  hair_color: "blond",
  skin_color: "fair",
  eye_color: "blue",
  birth_year: "19BBY",
  gender: "male",
  url: "https://swapi.py4e.com/api/people/1/",
};

function renderWithRouter(ui: React.ReactNode) {
  return render(ui, { wrapper: MemoryRouter });
}

describe("CharacterCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders character fields", () => {
    renderWithRouter(<CharacterCard character={baseCharacter} />);
    expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByText("Birth year")).toBeInTheDocument();
    expect(screen.getByText("Height")).toBeInTheDocument();
    expect(screen.getByText("male")).toBeInTheDocument();
    expect(screen.getByText("19BBY")).toBeInTheDocument();
    expect(screen.getByText("172")).toBeInTheDocument();
  });

  it("links to the correct detail route parsed from SWAPI url", () => {
    renderWithRouter(<CharacterCard character={baseCharacter} />);
    const link = screen.getByRole("link");
    expect(link.getAttribute("href")).toBe("/people/1");
  });

  it("does not re-render when irrelevant props change (memo check)", () => {
    const spy = vi.spyOn(swapiModule, "getCharacterIdFromUrl");

    const { rerender } = renderWithRouter(<CharacterCard character={baseCharacter} />);
    const initialCalls = spy.mock.calls.length;

    const nextCharacter: SwapiCharacter = {
      ...baseCharacter,
      mass: "78",
      hair_color: "brown",
    };

    rerender(<CharacterCard character={nextCharacter} />);

    expect(spy).toHaveBeenCalledTimes(initialCalls);
    spy.mockRestore();
  });

  it("re-renders when relevant props change", () => {
    const spy = vi.spyOn(swapiModule, "getCharacterIdFromUrl");

    const { rerender } = renderWithRouter(<CharacterCard character={baseCharacter} />);
    const initialCalls = spy.mock.calls.length;

    const changed: SwapiCharacter = { ...baseCharacter, height: "173" };

    rerender(<CharacterCard character={changed} />);

    expect(spy).toHaveBeenCalledTimes(initialCalls + 1);
    spy.mockRestore();
  });
});
