import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CharacterDetailPage from "./CharacterDetailPage";

// Mock data and helpers
const baseCharacter = {
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
} as const;

// Mock swapi fetcher
vi.mock("../services/swapi", () => ({
  fetchCharacterById: vi.fn(),
}));
import { fetchCharacterById } from "../services/swapi";

// Mock local hook to avoid touching localStorage and to assert calls
vi.mock("../hooks/useLocalCharacter", () => ({
  useLocalCharacter: vi.fn(),
}));
import { useLocalCharacter } from "../hooks/useLocalCharacter";

function setup(route = "/people/1") {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/people/:id" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe("CharacterDetailPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLocalCharacter as unknown as Mock).mockReturnValue({
      merged: baseCharacter,
      update: vi.fn(),
      save: vi.fn(),
      reset: vi.fn(),
    });
    (fetchCharacterById as unknown as Mock).mockResolvedValue(baseCharacter);
  });

  afterEach(() => {
    document.title = "";
  });

  it("fetches by id from route and renders fields with title", async () => {
    setup("/people/1");

    await waitFor(() => {
      expect(fetchCharacterById).toHaveBeenCalledWith("1", expect.any(AbortSignal));
    });

    const nameInput = await screen.findByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to list/i })).toBeInTheDocument();

    expect(screen.getByLabelText(/height/i)).toHaveValue("172");
    expect(screen.getByLabelText(/birth year/i)).toHaveValue("19BBY");

    await waitFor(() => {
      expect(document.title).toMatch(/Luke Skywalker — SWAPI Explorer/);
    });
  });

  it("calls update for edited fields", async () => {
    const update = vi.fn();
    (useLocalCharacter as unknown as Mock).mockReturnValue({
      merged: baseCharacter,
      update,
      save: vi.fn(),
      reset: vi.fn(),
    });

    setup("/people/1");

    const name = await screen.findByLabelText(/name/i);
    await waitFor(() => {
      name.focus();
    });
    fireEvent.change(name, { target: { value: "Master Luke" } });
    expect(update).toHaveBeenLastCalledWith("name", "Master Luke");

    const height = screen.getByLabelText(/height/i);
    fireEvent.change(height, { target: { value: "180" } });
    expect(update).toHaveBeenLastCalledWith("height", "180");
  });

  it("saves locally and shows snackbar, reset calls hook", async () => {
    const save = vi.fn();
    const reset = vi.fn();

    (useLocalCharacter as unknown as Mock).mockReturnValue({
      merged: baseCharacter,
      update: vi.fn(),
      save,
      reset,
    });

    setup("/people/1");

    const saveBtn = await screen.findByRole("button", { name: /save locally/i });
    await user.click(saveBtn);
    expect(save).toHaveBeenCalled();

    expect(screen.getByText(/saved to this browser/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole("button", { name: /reset edits/i });
    await user.click(resetBtn);
    expect(reset).toHaveBeenCalled();
  });

  it("shows error alert when fetch fails", async () => {
    (fetchCharacterById as unknown as Mock).mockRejectedValue(new Error("Boom"));
    setup("/people/2");

    const alert = await screen.findByRole("alert", {}, { timeout: 3000 });
    expect(alert).toHaveTextContent(/boom/i);
  });
});
