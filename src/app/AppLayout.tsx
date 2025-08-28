import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function AppLayout() {
  return (
    <Box sx={layoutSx}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div">
            SWAPI Explorer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

const layoutSx = {
  minHeight: "100vh",
  bgcolor: "background.default",
  backgroundImage: "url('background.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
} as const;
