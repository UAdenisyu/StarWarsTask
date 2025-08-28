import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import { memo } from "react";
import { Box, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const CharactersSkeletonGrid = memo(() => {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Skeleton variant="text" width="60%" height={28} />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="30%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
});

export const CharacterDetailSkeleton = memo(() => {
  return (
    <Box sx={layoutSx} aria-busy aria-live="polite">
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
});

const layoutSx = {
  backgroundColor: "white",
  p: 2,
  borderRadius: 1,
  boxShadow: 1,
} as const;
