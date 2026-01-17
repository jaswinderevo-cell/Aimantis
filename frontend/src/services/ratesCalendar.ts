import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type PropertyRatePayload = {
  properties: number[];
  start_date: string;
  end_date: string;
  base_price: string;
  min_nights: number;
  weekdays: string[];
  booking_pct: string;
  airbnb_pct: string;
  experia_pct: string;
};

export type SinglePropertyRatePayload = {
  property: number;
  date: string;
  base_price: number;
  min_nights: number;
};

export interface Rate {
  date: string;
  minNights: number;
  basePrice: number;
  airbnb: number;
  booking_com: number;
  expedia: number;
  isBooked?: boolean;
}

export interface PropertyRatesResponse {
  property_id: number;
  property_name: string;
  property_type: number;
  structure: number;
  rates: Rate[];
}

//get rates
export const useGetPropertiesRates = (month: number, year: number) => {
  return useQuery<PropertyRatesResponse[]>({
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

// Add bulk rates
export const usePostPropertyRates = () => {
  const queryClient = useQueryClient();
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: (payload: PropertyRatePayload) => {
      return axiosIntercept.post("/rates/bulk/", payload);
    },
    onSuccess: () => {
      toast.success("Rates added successfully!");
      queryClient.invalidateQueries({
        queryKey: ["properties_rates"],
        exact: false,
      });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log(error);
    },
  });
};

//update single rate
export const useUpdateRate = () => {
  const queryClient = useQueryClient();
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: (payload: SinglePropertyRatePayload) => {
      return axiosIntercept.post("/rates/update/", payload);
    },
    onSuccess: () => {
      toast.success("Property Rate updated!");
      queryClient.invalidateQueries({
        queryKey: ["properties_rates"],
        exact: false,
      });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log(error);
    },
  });
};
