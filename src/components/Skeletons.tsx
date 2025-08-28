import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";

export function CharactersSkeletonGrid() {
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
}
