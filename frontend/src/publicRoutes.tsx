import { RouteObject } from "react-router-dom";
import PublicCheckinPage from "./pages/PublicCheckinPage";
import { ROUTES } from "./constants/routes";

const publicRoutes: RouteObject[] = [
  {
    path: ROUTES.PUBLIC_CHECKIN_PAGE,
    element: <PublicCheckinPage />,
  },
];

export default publicRoutes;
