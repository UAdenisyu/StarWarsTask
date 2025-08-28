import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import Skeleton from "@mui/material/Skeleton";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { fetchCharacterById } from "../services/swapi";
import { useLocalCharacter } from "../hooks/useLocalCharacter";

export default function CharacterDetailPage() {
  const { id = "" } = useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["character", id],
    queryFn: ({ signal }) => fetchCharacterById(id, signal),
  });

  const { merged, update, save, reset } = useLocalCharacter(data, id);
  const [savedOpen, setSavedOpen] = useState(false);

  useEffect(() => {
    if (merged?.name) document.title = `${merged.name} — SWAPI Explorer`;
  }, [merged?.name]);

  if (isError) return <Alert severity="error">{(error as Error).message}</Alert>;

  if (isPending || !merged) {
    return (
      <Box
        sx={{
          backgroundColor: "white",
          p: 2,
          borderRadius: 1,
          boxShadow: 1,
        }}
        aria-busy
        aria-live="polite"
      >
        <Button component={RouterLink} to="/" variant="text" sx={{ mb: 2 }}>
          Back to list
        </Button>

        <Stack spacing={2} sx={{ maxWidth: 480, mt: 2 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Box>
          ))}
          <Stack direction="row" spacing={2}>
            <Skeleton variant="rectangular" width={130} height={36} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "white",
        p: 2,
        borderRadius: 1,
        boxShadow: 1,
      }}
    >
      <Button component={RouterLink} to="/" variant="text" sx={{ mb: 2 }}>
        Back to list
      </Button>
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

        <FormControl fullWidth>
          <InputLabel id="gender-label">Gender</InputLabel>
          <Select
            labelId="gender-label"
            label="Gender"
            value={merged.gender ?? ""}
            onChange={(e) => update("gender", String(e.target.value))}
          >
            <MenuItem value="male">male</MenuItem>
            <MenuItem value="female">female</MenuItem>
            <MenuItem value="n/a">n/a (droid)</MenuItem>
            <MenuItem value="hermaphrodite">hermaphrodite</MenuItem>
            <MenuItem value="none">none</MenuItem>
            <MenuItem value="unknown">unknown</MenuItem>
            <MenuItem disabled>──────────</MenuItem>
            <MenuItem value="masculine programming">masculine programming (droid)</MenuItem>
            <MenuItem value="feminine programming">feminine programming (droid)</MenuItem>
            <MenuItem value="no gender programming">no gender programming (droid)</MenuItem>
          </Select>
        </FormControl>

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
