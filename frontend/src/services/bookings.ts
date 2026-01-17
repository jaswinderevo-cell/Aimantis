import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface Guest {
  id?: number;
  booking: number | null;
  full_name: string;
  is_main_guest: boolean;
  email?: string | null;
  phone?: string | null;
  nationality?: string | null;
  id_number?: string | null;
  address?: string | null;
  postal_code?: string | null;
  country?: string | null;
  language_preference?: string | null;
  guest_notes?: string | null;
  special_requests?: string | null;
  gender?: string | null;
  city?: string | null;
  zip_code?: string | null;
  date_of_birth?: string | null;
  country_of_birth?: string | null;
  document_type?: string | null;
  issuing_country?: string | null;
  created_at: string;
}

export interface BookingPayload {
  id: number;
  structure: number;
  property_type: number | null;
  property: number | null;
  property_name?: string;
  check_in_date: string;
  check_out_date: string;
  length_of_stay: number;
  adults_count: number;
  children_count: number;
  special_requests?: string | null;
  base_price?: string | null;
  cleaning_fee?: string | null;
  other_extra_fees?: string | null;
  city_tax?: string | null;
  subtotal?: string | null;
  total_price?: string | null;
  payment_method: "cash" | "credit_card" | "bank_transfer" | "online";
  payment_status: "pending" | "partially_paid" | "fully_paid";
  external_reference?: string | null;
  invoice_info?: string | null;
  platform: string;
  platform_reservation_id: string;
  due_at_property: string;
  guests: Guest[];
  uid?: string;
}
//SplitBooking payload
export interface SplitBookingPayload {
  booking_id?: number | null;
  split_date: string;
  new_room_id: number;
}

//get bookings
export const useGetBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/bookings/");
      return res.data;
    },
  });
};

//get single booking
export const useGetSingleBooking = (id: number | null) => {
  return useQuery({
    queryKey: ["single_booking", id],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/bookings/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });
};

//get booking by uid
export const useGetBookingByUuid = (bookingUid?: string) => {
  return useQuery({
    queryKey: ["booking-by-uuid", bookingUid],
    queryFn: async () => {
      const { data } = await axiosIntercept.get(
        `/bookings/by-uid/${bookingUid}/`,
      );
      return data;
    },
    enabled: !!bookingUid,
  });
};

//post booking
export const useCreateBooking = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingPayload) => {
      return axiosIntercept.post("/bookings/", payload);
    },
    onSuccess: () => {
      toast.success("Booking created!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//update booking
export const useUpdateBooking = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingPayload) => {
      return axiosIntercept.patch(`/bookings/${payload.id}/`, payload);
    },
    onSuccess: (data, variables) => {
      toast.success("Booking updated!");
      queryClient.setQueryData(["single_booking", variables.id], data.data);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//delete a booking
export const useDeleteBooking = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return await axiosIntercept.delete(`/bookings/${id}/`);
    },
    onSuccess: () => {
      toast.success("Booking Deleted!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//split booking
export const useSplitBooking = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SplitBookingPayload) => {
      return axiosIntercept.post(
        `/bookings/${payload.booking_id}/split/`,
        payload,
      );
    },

    onSuccess: () => {
      toast.success("Booking successfully split!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};
