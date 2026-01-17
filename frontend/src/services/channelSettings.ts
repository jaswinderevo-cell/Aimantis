import axiosIntercept from "@/utils/axiosInterceptor";
import { useQuery } from "@tanstack/react-query";

export type ChannelSettingsPayload = {
  id?: number;
  structure: number | null;
  default_booking_type: string;
  default_booking_value: number;
  default_booking_until_date: null;
  individual_accommodations: [];
  booking_percentage: string;
  airbnb_percentage: string;
  expedia_percentage: string;
};

export const useGetPropertiesRates = (month: number, year: number) => {
  return useQuery<ChannelSettingsPayload>({
    queryKey: ["properties_rates", month, year],
    queryFn: async () => {
      const res = await axiosIntercept.get("/rates/calendar", {
        params: { month, year },
      });
      return res.data;
    },
    staleTime: 0,
  });
};
