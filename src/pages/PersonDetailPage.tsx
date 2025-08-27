import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import { fetchPersonById } from "../services/swapi";
import { useLocalPerson } from "../hooks/useLocalPerson";

export default function PersonDetailPage() {
  const { id = "" } = useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["person", id],
    queryFn: ({ signal }) => fetchPersonById(id, signal),
  });

  const { merged, update, save, reset } = useLocalPerson(data, id);

  const [savedOpen, setSavedOpen] = useState(false);

  useEffect(() => {
    if (merged?.name) document.title = `${merged.name} — SWAPI Explorer`;
  }, [merged?.name]);

  if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

  if (isPending || !merged) return <Typography>Loading…</Typography>;

  return (
    <Box>
      <Button component={RouterLink} to="/" variant="text" sx={{ mb: 2 }}>
        Back to list
      </Button>

      <Typography variant="h4" gutterBottom>
        {merged.name}
      </Typography>

      <Stack spacing={2} sx={{ maxWidth: 480 }}>
        <TextField
          label="Name"
          value={merged.name}
          onChange={(e) => update("name", e.target.value)}
        />
        <TextField
          label="Height"
          value={merged.height}
          onChange={(e) => update("height", e.target.value)}
        />
        <TextField
          label="Mass"
          value={merged.mass}
          onChange={(e) => update("mass", e.target.value)}
        />
        <TextField
          label="Hair color"
          value={merged.hair_color}
          onChange={(e) => update("hair_color", e.target.value)}
        />
        <TextField
          label="Skin color"
          value={merged.skin_color}
          onChange={(e) => update("skin_color", e.target.value)}
        />
        <TextField
          label="Eye color"
          value={merged.eye_color}
          onChange={(e) => update("eye_color", e.target.value)}
        />
        <TextField
          label="Birth year"
          value={merged.birth_year}
          onChange={(e) => update("birth_year", e.target.value)}
        />
        <TextField
          label="Gender"
          value={merged.gender}
          onChange={(e) => update("gender", e.target.value)}
        />

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => {
              save();
              setSavedOpen(true);
            }}
          >
            Save locally
          </Button>
          <Button variant="outlined" color="inherit" onClick={reset}>
            Reset edits
          </Button>
        </Stack>
      </Stack>

      <Snackbar
        open={savedOpen}
        autoHideDuration={2000}
        onClose={() => setSavedOpen(false)}
        message="Saved to this browser"
      />
    </Box>
  );
}
