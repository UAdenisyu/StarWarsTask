import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import { type SwapiCharacter } from "../services/types";
import { getCharacterIdFromUrl } from "../services/swapi";
import { memo, type FC } from "react";

type CharacterCardProps = {
  character: SwapiCharacter;
};

const checkEqual = (prev: { character: SwapiCharacter }, next: { character: SwapiCharacter }) =>
  prev.character.name === next.character.name &&
  prev.character.gender === next.character.gender &&
  prev.character.birth_year === next.character.birth_year &&
  prev.character.height === next.character.height;

const CharacterCard: FC<CharacterCardProps> = memo(({ character }) => {
  const id = getCharacterIdFromUrl(character.url);
  return (
    <Card variant="outlined">
      <CardActionArea component={RouterLink} to={`/people/${id}`}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {character.name}
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 2, rowGap: 0.5 }}>
            <Typography variant="body2">Gender</Typography>
            <Typography variant="body2" color="text.secondary">
              {character.gender}
            </Typography>
            <Typography variant="body2">Birth year</Typography>
            <Typography variant="body2" color="text.secondary">
              {character.birth_year}
            </Typography>
            <Typography variant="body2">Height</Typography>
            <Typography variant="body2" color="text.secondary">
              {character.height}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}, checkEqual);

export default CharacterCard;
