// export type Booking = {
//   id: number;
//   amount: number;
//   firstName: string;
//   lastName: string;
//   propertyName: string;
//   checkinDate: string;
//   checkoutDate: string;
//   adults: number;
//   children: number;
//   totalAmount: number;
//   commissionableAmount: number;
//   platformCommission: number;
//   platform: "Booking" | "Airbnb" | "Direct" | "Expedia";
//   checkedInGuests: string;
//   checkInStatus: "sent" | "review" | "ready to sent";
// };

//portals table data//
export type PortalsData = {
  id: number;
  portalName: string;
  connectedDate: string;
};

//calendar data interface//
// export type BookingDetail = {
//   userName: string;
//   checkIn: string;
//   checkOut: string;
//   type: string;
// };

// export type RoomDetail = {
//   id: number;
//   name: string;
// };

// export type RoomBookings = {
//   detail: RoomDetail;
//   bookingDetail: BookingDetail[];
// };

// export type MonthlyRoomBookings = {
//   [roomId: string]: RoomBookings;
// };

// export type BookingDataType = {
//   bookings: {
//     [month: string]: MonthlyRoomBookings;
//   };
// };

//Rates data format//
// export interface PortalPrices {
//   airbnb: number;
//   booking: number;
//   expedia: number;
// }

// export interface RateInfo {
//   minNights: number;
//   basePrice: number;
//   portals: PortalPrices;
// }

// export interface RoomRate {
//   roomId: string;
//   roomName: string;
//   rates: {
//     [date: string]: RateInfo | undefined;
//   };
// }

//structure
export interface Structure {
  id: string;
  name: string;
  type: "hotel" | "apartment" | "mixed";
  location: string;
  totalUnits: number;
  occupancyRate: number;
  revenue: number;
  rating: number;
  users: number;
  propertyTypes: number;
  status: "active" | "inactive";
  image: string;
}
