import "@testing-library/jest-dom/vitest";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CharactersSkeletonGrid, CharacterDetailSkeleton } from "./Skeletons";
import { MemoryRouter } from "react-router-dom";

describe("Skeletons", () => {
  it("renders CharactersSkeletonGrid", () => {
    const { container } = render(
      <MemoryRouter>
        <CharactersSkeletonGrid />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders CharacterDetailSkeleton with back button and multiple skeletons", () => {
    const { container } = render(
      <MemoryRouter>
        <CharacterDetailSkeleton />
      </MemoryRouter>
    );
    expect(screen.getByRole("link", { name: /back to list/i })).toBeInTheDocument();
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(1);
  });
});
