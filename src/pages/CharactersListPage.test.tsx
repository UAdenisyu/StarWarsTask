import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import CharactersListPage from "./CharactersListPage";
import { fetchCharacters } from "../services/swapi";
import { getCharacterEdit } from "../services/localEdits";

vi.mock("../services/swapi", () => ({
  fetchCharacters: vi.fn(),
  getCharacterIdFromUrl: (url: string) => url.match(/\/(\d+)\/?$/)?.[1] ?? "",
}));

vi.mock("../services/localEdits", () => ({
  getCharacterEdit: vi.fn(),
}));

vi.mock("../services/navigation", () => ({
  setPage: vi.fn(),
  setSearch: vi.fn(),
}));

vi.mock("../components/Skeletons", () => ({
  CharactersSkeletonGrid: () => <div data-testid="skeleton-grid" />,
}));

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  });

const renderPage = (initialEntries: string[] = ["/"], client = makeQueryClient()) => {
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={initialEntries}>
        <CharactersListPage />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const makeCharacters = () => ({
  count: 20,
  results: [
    {
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
    },
    {
      name: "Leia Organa",
      height: "150",
      mass: "49",
      hair_color: "brown",
      skin_color: "light",
      eye_color: "brown",
      birth_year: "19BBY",
      gender: "female",
      homeworld: "https://swapi.dev/api/planets/2/",
      films: [],
      species: [],
      vehicles: [],
      starships: [],
      created: "",
      edited: "",
      url: "https://swapi.dev/api/people/2/",
    },
  ],
});

describe("CharactersListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.title = "";
  });

  it("renders results, applies local edits, shows pagination and sets title", async () => {
    (fetchCharacters as unknown as Mock).mockResolvedValue(makeCharacters());
    (getCharacterEdit as unknown as Mock).mockImplementation((id: string) =>
      id === "1" ? { name: "Master Luke" } : undefined
    );

    renderPage(["/?page=1"]);

    expect(await screen.findByText(/Master Luke/i)).toBeInTheDocument();
    expect(screen.getByText(/Leia Organa/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /go to next page/i })).toBeInTheDocument();

    expect(document.title).toMatch(/Characters — SWAPI Explorer/);
  });

  it("filters by search param (case-insensitive)", async () => {
    (fetchCharacters as unknown as Mock).mockResolvedValue(makeCharacters());
    (getCharacterEdit as unknown as Mock).mockReturnValue(undefined);

    renderPage(["/?search=luke"]);

    expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
    expect(screen.queryByText(/Leia Organa/i)).not.toBeInTheDocument();
  });

  it("shows 'No results' when filter matches nothing", async () => {
    (fetchCharacters as unknown as Mock).mockResolvedValue(makeCharacters());
    (getCharacterEdit as unknown as Mock).mockReturnValue(undefined);

    renderPage(["/?search=zzz"]);

    expect(await screen.findByText(/No results/i)).toBeInTheDocument();
  });

  it("shows skeleton while loading, then renders data", async () => {
    let resolveFn!: (v: unknown) => void;
    const p = new Promise((resolve) => {
      resolveFn = resolve;
    });
    (fetchCharacters as unknown as Mock).mockReturnValue(p);
    (getCharacterEdit as unknown as Mock).mockReturnValue(undefined);

    renderPage();

    // skeleton is rendered from mocked CharactersSkeletonGrid
    expect(screen.getByTestId("skeleton-grid")).toBeInTheDocument();

    // finish loading
    resolveFn(makeCharacters());
    expect(await screen.findByText(/Luke Skywalker/i)).toBeInTheDocument();
  });
});
