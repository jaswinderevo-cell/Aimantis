import { Navigate, RouteObject } from "react-router-dom";
import dashboardRoutes from "./pages/AuthenticatedRoutes";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { ROUTES } from "./constants/routes";
import LandingPage from "./pages/LandingPage";
import SignupForm from "./components/SignupForm";
import { LoginForm } from "./components/LoginForm";
import AcceptInvitaion from "./pages/AcceptInvitation";
import publicRoutes from "./publicRoutes";

const routes: RouteObject[] = [
  ...publicRoutes,
  {
    path: ROUTES.LANDING_PAGE,
    element: localStorage.getItem("token") ? (
      <Navigate to={ROUTES.DASHBOARD} replace />
    ) : (
      <LandingPage />
    ),
  },
  {
    path: ROUTES.LOGIN,
    element: <LoginForm />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <SignupForm />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPasswordForm />,
  },

  { path: ROUTES.ACCEPT_INVITATION, element: <AcceptInvitaion /> },

  dashboardRoutes,
];

export default routes;
