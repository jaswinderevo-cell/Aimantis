export const PORTALS = ["Airbnb", "Booking.com", "Expedia", "Direct"];

export const ROOM_STATUS_ACTIVE = "active";
export const ROOM_STATUS_INACTIVE = "inactive";

export const BOOKING_TYPE_OPTIONS = [
  { label: "Expedia", value: "expedia" },
  { label: "Direct", value: "direct" },
  { label: "Airbnb", value: "airbnb" },
  { label: "Booking", value: "booking_com" },
  { label: "Blocked", value: "blocked" },
];

export const rooms = [
  "Room 1",
  "Room 2",
  "Room 3",
  "Room 4",
  "Room 5",
  "Room 6",
  "Room 7",
];

export const AMENITIES_OPTIONS = [
  { label: "AC", value: "AC" },
  { label: "WiFi", value: "WiFi" },
  { label: "TV", value: "TV" },
  { label: "Shower", value: "Shower" },
  { label: "Double Bed", value: "Double Bed" },
  { label: "Towel", value: "Towel" },
  { label: "Bathtub", value: "Bathtub" },
];

export const DAYS_OPTIONS = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

export interface OptionType {
  value: string;
  label: string;
}

export interface ROOMS_OPTIONS {
  label: string;
  value: number;
}

export interface DayOption {
  label: string;
  value: string;
}

export const COLOR_GRADIENT_LIGHT = "#EFF6FF";
export const COLOR_GRADIENT_DARK = "#C7DBFB";
export const COLOR_BLUE = "#448DF2";
export const COLOR_VIOLET = "#0B0C8B";
export const COLOR_GREEN = "#41C588";
export const COLOR_LIGHT_GREEN = "#E7F8F0";
export const COLOR_MEDIUM_BLUE = "#6FA3EA";
export const COLOR_LIGHT_BLUE = "#E8F1FD";
export const COLOR_LIGHT_GRAY = "#667085";
export const COLOR_LIGHT_RED = "#FFDCDC";
export const COLOR_DARK_RED = "#C54141";
export const COLOR_YELLOW = "#FF9500";
export const COLOR_YELLOW_LIGHT = "#F8E6CD";
export const COLOR_LIGHT_SILVER = "#D9D9D9";
export const COLOR_LIGHT_MISCHKA = "#D1D5DB";
export const COLOR_EBONY = "#111827";
export const COLOR_OXFORD_BLUE = "#374151";
export const COLOR_ROYAL_BLUE = "#2563EB";
export const PERSIAN_BLUE = "#1D4ED8";
export const COLOR_ATHENS_GRAY = "#F3F4F6";
export const COLOR_PALE_SKY = "#6B7280";
export const COLOR_BOULDER = "#6B7280";
export const COLOR_GOVERNOR_BAY = "#3730A3";
export const COLOR_DEEP_TEAL = "#002929";
export const COLOR_TUNA = "#373B40";
export const COLOR_BOOKING_COM = "#003b95";

export const CURRENCY = ["EUR", "USD", "GBP", "CAD", "AUD"];

export const LANGUAGE = ["English", "Italian", "Spanish", "French"];

export const COUNTRY = [
  "United Kingdom",
  "France",
  "Germany",
  "Italy",
  "Spain",
  "Russia",
  "Switzerland",
  "Netherlands",
  "Greece",
  "Sweden",
];

//generate time from 00:00 to 23:00
const getTime: string[] = [];
for (let i = 0; i < 24; i++) {
  const hour = i.toString().padStart(2, "0");
  getTime.push(`${hour}:00:00`);
}
export const TIME = getTime;

//structure user roles
export const ROLES = [
  { value: "Admin", label: "Admin" },
  { value: "Editor", label: "Editor" },
];

export const STRUCTURE_TYPE_LABEL: Record<string, string> = {
  mixed_use: "Mixed use",
  hotel: "Hotel",
  apartment: "Apartment",
};
