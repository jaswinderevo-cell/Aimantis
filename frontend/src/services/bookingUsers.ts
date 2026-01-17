import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// guest payload model
export interface GuestPayload {
  id: number | null;
  booking_id: number | null;
  full_name: string;
  is_main_guest: boolean;
  email?: string;
  phone?: string;
  date_of_birth: string;
  country_of_birth: string;
  gender: "male" | "female" | "other";
  document_type: string;
  id_number: string;
  document_issue_date?: string;
  document_expiry_date?: string;
  document_issuing_country?: string;
  nationality: string;
  address?: string;
  zip_code?: string;
  country?: string;
  city?: string;
  region?: string;
  first_name?: string;
  last_name?: string;
  language_preference?: string;
  special_requests?: string;
  created_at?: string;
  updated_at?: string;
}

// final guests payload
export interface BookingGuestsPayload {
  booking_id: number | null;
  guests: GuestPayload[];
}

//get users for a booking
export const useGetBookingUsers = (booking_id: number) => {
  return useQuery({
    queryKey: ["booking_users", booking_id],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/guests/check-in/${booking_id}/`);
      return res;
    },
    enabled: !!booking_id,
  });
};

//add or checkin users in booking
export const useCheckinUsers = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingGuestsPayload) => {
      return axiosIntercept.post("/guests/check-in/", payload);
    },

    onSuccess: () => {
      toast.success("Check-in successfull!");
      queryClient.invalidateQueries({ queryKey: ["booking_users"] });
    },
    onError: (error: unknown) => {
      toast.error("Something went wrong!", error as undefined);
      showAPIErrorMessage(error);
    },
  });
};
