import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import { type SwapiPerson } from "../services/types";
import { getPersonIdFromUrl } from "../services/swapi";

type PersonCardProps = { person: SwapiPerson };

export default function PersonCard({ person }: PersonCardProps) {
  const id = getPersonIdFromUrl(person.url);
  return (
    <Card variant="outlined">
      <CardActionArea component={RouterLink} to={`/people/${id}`}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {person.name}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 2, rowGap: 0.5 }}>
            <Typography variant="body2">Gender</Typography>
            <Typography variant="body2" color="text.secondary">
              {person.gender}
            </Typography>
            <Typography variant="body2">Birth year</Typography>
            <Typography variant="body2" color="text.secondary">
              {person.birth_year}
            </Typography>
            <Typography variant="body2">Height</Typography>
            <Typography variant="body2" color="text.secondary">
              {person.height}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
