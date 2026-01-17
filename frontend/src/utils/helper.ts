import { ROUTES } from "@/constants/routes";
import {
  COLOR_BLUE,
  COLOR_BOOKING_COM,
  COLOR_DARK_RED,
  COLOR_GREEN,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_GREEN,
  COLOR_LIGHT_RED,
  COLOR_YELLOW,
  COLOR_YELLOW_LIGHT,
  OptionType,
} from "./../constants/constants";

import moment from "moment-timezone";
import { useLocation } from "react-router-dom";

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 

export const convertUTCToLocal = (date: string) => {
  const utcCutoff = moment.utc(date, "YYYYMMDD HH:mm:ss");
  const displayCutoff = utcCutoff.clone().tz(userTimeZone);
  return displayCutoff;
};

export const getBackgroundColor = (type: string) => {
  switch (type) {
  case "booking":
    return "#003b95";
  case "booking_com":
    return COLOR_BOOKING_COM;
  case "direct":
    return COLOR_GREEN;
  case "airbnb":
    return COLOR_DARK_RED;
  case "expedia":
    return COLOR_YELLOW;
  default :
    return COLOR_LIGHT_GRAY;
  }
};

export const getBackgroundColorLight = (type: string) => {
  switch (type) {
  case "booking":
    return COLOR_LIGHT_BLUE;
  case "booking_com":
    return COLOR_LIGHT_BLUE;
  case "direct":
    return COLOR_LIGHT_GREEN;
  case "airbnb":
    return COLOR_LIGHT_RED;
  case "expedia":
    return COLOR_YELLOW_LIGHT;
  default:
    return "#E5E7EB";
  }
};

export const getStatusBackground = (status: string) => {
  switch (status) {
  case "ready to send":
    return COLOR_LIGHT_BLUE;
  case "sent":
    return COLOR_LIGHT_GREEN;
  case "pending review":
    return COLOR_YELLOW_LIGHT;
  default:
    return "#E5E7EB";
  }
};

export const getStatusTextColor = (status: string) => {
  switch (status.toLowerCase()) {
  case "ready to send":
    return COLOR_BLUE;
  case "sent":
    return COLOR_GREEN;
  case "pending review":
    return COLOR_YELLOW;
  default:
    return "#364153";
  }
};

export const getGlobalUsersStatusColor = (status: string) => {
  switch (status) {
  case "active":
    return "bg-green-100 text-green-800";
  case "pending":
    return "bg-yellow-100 text-yellow-800";
  case "inactive":
    return "bg-red-100 text-red-800";
  case "expired":
    return "bg-gray-100 text-gray-800";
  default:
    return "bg-gray-100 text-gray-800";
  }
};

//for handling Enter key submission in forms
export const handleEnterSubmit = (
  event: React.KeyboardEvent,
  isValid: boolean,
  handleSubmit: () => void,
) => {
  if (event.key === "Enter") {
    event.preventDefault();
    if (isValid) {
      handleSubmit();
    }
  }
}; 

//filter bookings page data//
// const formattedData: Booking[] = rawData.map((item) => ({
//   ...item,
//   platform: item.platform as Booking["platform"],
//   checkInStatus: item.checkInStatus as Booking["checkInStatus"],
// }));

// export const filterBookingsData = (searchQuery: string) => {
//   const search = searchQuery.toLowerCase();

//   return formattedData.filter((data) => {
//     const name = data.firstName.toLowerCase();
//     const propertyName = data.propertyName.toLowerCase();
//     return name.includes(search) || propertyName.includes(search);
//   });
// };

// All Breadcrumbs mapping

//pages breadcrumbs
const BREADCRUMBS_MAP: Record<string, string> = {
  "/portal/dashboard": "Dashboard",
  "/portal/front-desk": "Front Desk",
  "/portal/rate": "Rates",
  "/portal/reservations": "Reservations",
  "/portal/city-tax": "City Tax",
  "/portal/istat": "ISTAT",
  "/portal/invoicing": "Invoicing",
  "/portal/properties/property-types": "Properties > Property Types",
  "/portal/properties/rooms": "Properties > Rooms",
  "/portal/configuration/portals": "Configuration > Portals",
  "/portal/my-profile/my-account": "My Account",
  "/portal/properties/structures": "Properties > Structures",
  "/portal/global-user-management": "Global User Management",
  "/portal/properties/structure-users": "Properties > Structure Users",
  "/portal/configuration/bureaucracy": "Configuration > Bureaucracy",
  "/portal/guest-configuration": "Guest Configuration",
};

// my account tabs breadcrumb mapping
const MY_ACCOUNT_TAB_MAP: Record<string, string> = {
  profile: "Profile",
  security: "Security",
  billing: "Billing",
  invoices: "Invoices",
  notifications: "Notifications",
  preferences: "Preferences", 
};

// invoicing tabs breadcrums mapping
const INVOICING_TAB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  documenti: "Documenti",
  clienti: "Clienti",
  prodotti: "Prodotti",
  impostazioni: "Impostazioni",
};

// guest configuration experience
const GUEST_CONFIGURATION_TAB_MAP: Record<string, string> = {
  "online-checkin": "Online Check In",
  communication: "Communication",
  "guest-guide": "Guest Guide",
};

export const useBreadCrumbs = () => {
  const location = useLocation();
  const path = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get("tab");

  const baseLabel = BREADCRUMBS_MAP[path] || "";

  if (path === ROUTES.PROFILE && tab) {
    const tabLabel = MY_ACCOUNT_TAB_MAP[tab];
    return tabLabel ? `${baseLabel} - ${tabLabel}` : baseLabel;
  }
  if (path === ROUTES.INVOICING && tab) {
    const tabLabel = INVOICING_TAB_MAP[tab];
    return tabLabel ? `${baseLabel} - ${tabLabel}` : baseLabel;
  }
  if (path === ROUTES.GUEST_CONFIGURATION && tab) {
    const tabLabel = GUEST_CONFIGURATION_TAB_MAP[tab];
    return tabLabel ? `${baseLabel} - ${tabLabel}` : baseLabel;
  }

  return baseLabel;
};

//structure type colors
export const getStructureTypeColor = (type: string) => {
  switch (type) {
  case "hotel":
    return "bg-blue-100 text-blue-800";
  case "apartment":
    return "bg-green-100 text-green-800";
  case "mixed":
    return "bg-purple-100 text-purple-800";
  default:
    return "bg-gray-100 text-gray-800";
  }
};

//function to convert coma separated amenities string into array ([{label:string, value:string}])
export const normalizeAmenities = (amenities: unknown): OptionType[] => {
  if (!amenities) return [];

  if (Array.isArray(amenities)) {
    if (typeof amenities[0] === "string") {
      return (amenities as string[]).map((a) => ({
        label: a,
        value: a,
      }));
    }
    return amenities as OptionType[];
  }

  if (typeof amenities === "string") {
    return amenities.split(",").map((a) => {
      const trimmed = a.trim();
      return { label: trimmed, value: trimmed };
    });
  }

  return [];
};

//initials for guest's name
export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

//dynamic tab logo
export function updateFavicon(url: string) {
  const existing = document.querySelector("link[rel='icon']");
  if (existing) {
    existing.setAttribute("href", url);
    return;
  }
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = url;
  document.head.appendChild(link);
}

//create slugs for custom checkin form template
export const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
