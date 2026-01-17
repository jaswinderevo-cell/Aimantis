// routes/dashboardRoutes.tsx
import PrivateRoute from "@/components/PrivateRoute";
import { ROUTES } from "@/constants/routes";
import { RouteObject } from "react-router-dom";
import DashboardLayout from "../layouts/AuthenticatedLayout";
import AccountsPage from "./AccountsPage";
import { Bureaucracy } from "./Bureaucracy";
import CityTaxReport from "./CityTax";
import FrontDeskLayout from "./FrontDesk";
import UserManagement from "./GlobalUserManagement";
import GuestConfiguration from "./GuestConfiguration";
import BookingsAndCheckins from "./Guests";
import ViewBookingDetails from "./Guests/ViewBookings";
import HomePage from "./Dashboard";
import Invoicing from "./Invoicing";
import ISTATMonthlyReport from "./IstatReport";
import Portals from "./Portals";
import Properties from "./Properties";
import PropertyTypes from "./PropertyTypes";
import RateComponent from "./Rate";
import StructuresDashboard from "./Structures";
import StructureUserManagement from "./StructureUsers";

const dashboardRoutes: RouteObject = {
  path: ROUTES.PORTAL,
  element: (
    <PrivateRoute>
      <DashboardLayout />
    </PrivateRoute>
  ),
  children: [
    { index: true, element: <HomePage /> },
    { path: ROUTES.DASHBOARD, element: <HomePage /> },
    { path: ROUTES.FRONT_DESK, element: <FrontDeskLayout /> },
    { path: ROUTES.RATES, element: <RateComponent /> },
    {
      path: ROUTES.BOOKINGS_AND_CHECKINS,
      element: <BookingsAndCheckins />,
    },
    {
      path: ROUTES.CITY_TAX,
      element: <CityTaxReport />,
    },
    {
      path: ROUTES.ISTAT,
      element: <ISTATMonthlyReport />,
    },
    {
      path: ROUTES.INVOICING,
      element: <Invoicing/>,
    },
    { path: ROUTES.PROPERTY_TYPES, element: <PropertyTypes /> },
    {
      path: ROUTES.PROPERTY_TYPES_BY_STRUCTURE__ID,
      element: <PropertyTypes />,
    },

    { path: ROUTES.STRUCTURES, element: <StructuresDashboard /> },
    { path: ROUTES.USER_MANAGEMENT, element: <UserManagement /> },
    { path: ROUTES.STRUCTURE_USERS, element: <StructureUserManagement /> },
    {
      path: ROUTES.STRUCUTURE_USERS_BY_STRUCUTRE_ID,
      element: <StructureUserManagement />,
    },

    { path: ROUTES.PROPERTIES, element: <Properties /> },
    { path: ROUTES.PORTALS, element: <Portals /> },
    { path: ROUTES.BOOKING_DETAILS, element: <ViewBookingDetails /> },
    { path: ROUTES.PROFILE, element: <AccountsPage /> },
    { path: ROUTES.BUREAUCRACY, element: <Bureaucracy /> },
    { path: ROUTES.GUEST_CONFIGURATION, element: <GuestConfiguration/> },

  ],
};

export default dashboardRoutes;
