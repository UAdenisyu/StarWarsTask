import { createBrowserRouter } from "react-router-dom";
import PeopleListPage from "../pages/PeopleListPage";
import PersonDetailPage from "../pages/PersonDetailPage";
import AppLayout from "./AppLayout";

export const appRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <PeopleListPage /> },
        { path: "people/:id", element: <PersonDetailPage /> },
      ],
    },
    { path: "*", element: <div>Not found</div> },
  ],
  { basename: import.meta.env.BASE_URL }
);

export default appRouter;
