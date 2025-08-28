import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";

import { fetchCharacterById } from "../services/swapi";
import { useLocalCharacter } from "../hooks/useLocalCharacter";
import SelectInput from "../components/SelectInput";
import { CharacterDetailSkeleton } from "../components/Skeletons";

const CharacterDetailPage = () => {
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

  const onSaveLocally = () => {
    save();
    setSavedOpen(true);
  };

  if (isError) return <Alert severity="error">{error.message}</Alert>;

  if (isPending || !merged) return <CharacterDetailSkeleton />;

  return (
    <Box sx={layoutSx}>
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

        <SelectInput gender={merged.gender} onChange={update} />

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={onSaveLocally}>
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
};

const layoutSx = {
  backgroundColor: "white",
  p: 2,
  borderRadius: 1,
  boxShadow: 1,
} as const;

export default CharacterDetailPage;
