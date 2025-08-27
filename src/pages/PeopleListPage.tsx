import { useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import PersonCard from "../components/PersonCard";
import PaginationBar from "../components/PaginationBar";
import SearchBox from "../components/SearchBox";
import { fetchPeople } from "../services/swapi";
import { PeopleSkeletonGrid } from "../components/Skeletons";

const PAGE_SIZE = 10;

export default function PeopleListPage() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get("page") || 1));
  const search = params.get("search") || "";

  useEffect(() => {
    document.title = "People — SWAPI Explorer";
  }, []);

  const queryKey = useMemo(() => ["people", { page, search }], [page, search]);

  const { data, isPending, isError, error } = useQuery({
    queryKey,
    queryFn: ({ signal }) => fetchPeople(page, search, signal),
  });

  function setPage(next: number) {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("page", String(next));
      return p;
    }, { replace: true });
  }

  function setSearch(next: string) {
    setParams((prev) => {
      const p = new URLSearchParams(prev);
      if (next) p.set("search", next);
      else p.delete("search");
      p.set("page", "1");
      return p;
    }, { replace: true });
  }

  if (isError) {
    return <Alert severity="error">{(error as Error).message}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <SearchBox value={search} onChange={setSearch} label="Search people" />
      </Box>

      {isPending && <PeopleSkeletonGrid />}

      {!isPending && data && data.results.length === 0 && (
        <Typography>No results</Typography>
      )}

      {!isPending && data && data.results.length > 0 && (
        <>
          <Grid container spacing={2}>
            {data.results.map((person) => (
              <Grid key={person.url} size={{ xs: 12, sm: 6 }}>
                <PersonCard person={person} />
              </Grid>
            ))}
          </Grid>
          <PaginationBar
            page={page}
            total={data.count}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}
    </Box>
  );
}