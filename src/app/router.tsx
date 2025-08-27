import { createBrowserRouter, Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PeopleListPage from "../pages/PeopleListPage";
import PersonDetailPage from "../pages/PersonDetailPage";

function AppLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
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

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <PeopleListPage /> },
      { path: "people/:id", element: <PersonDetailPage /> },
    ],
  },
  { path: "*", element: <div>Not found</div> },
]);

export default appRouter;