import { useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";
import PaginationBar from "../components/PaginationBar";
import SearchBox from "../components/SearchBox";
import { fetchCharacters } from "../services/swapi";
import { getCharacterEdit } from "../services/localEdits";
import { CharactersSkeletonGrid } from "../components/Skeletons";
import { getCharacterIdFromUrl } from "../services/swapi";
import { GRID_PAGE_SIZE } from "../constants";
import { setPage, setSearch } from "../services/navigation";

const CharactersListPage = () => {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page") || 1));
  const search = params.get("search") || "";

  useEffect(() => {
    document.title = "Characters — SWAPI Explorer";
  }, []);

  const queryKey = useMemo(() => ["people", { page, search }], [page, search]);

  const { data, isPending, isError, error } = useQuery({
    queryKey,
    queryFn: ({ signal }) => fetchCharacters(page, search, signal),
  });

  const chars = useMemo(
    () =>
      data && data.results.length
        ? data.results.map(
            (character) => {
              const id = getCharacterIdFromUrl(character.url);
              const patch = getCharacterEdit(id);
              const merged = patch ? { ...character, ...patch } : character;
              return (
                <Grid key={character.url} size={{ xs: 12, sm: 6 }}>
                  <CharacterCard character={merged} />
                </Grid>
              );
            },
            [data]
          )
        : null,
    [data]
  );

  if (isError) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <SearchBox
          value={search}
          onChange={(value) => setSearch(value, setParams)}
          label="Search characters"
        />
      </Box>

      {isPending && <CharactersSkeletonGrid />}

      {!isPending && data && data.results.length === 0 && (
        <Box sx={{ backgroundColor: "background.default", padding: 2, borderRadius: 1 }}>
          <Typography>No results</Typography>
        </Box>
      )}

      {!isPending && data && data.results.length > 0 && (
        <>
          <Grid container spacing={2}>
            {chars}
          </Grid>
          <Box bgcolor={"background.default"} mt={2} borderRadius={1}>
            <PaginationBar
              page={page}
              total={data.count}
              pageSize={GRID_PAGE_SIZE}
              onChange={(value) => setPage(value, setParams)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CharactersListPage;
