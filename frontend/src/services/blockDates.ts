import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CreateBlockedDatesPayload {
  id?: number | null;
  structure: number;
  property_type: number | null;
  property: number;
  start_date: string;
  end_date: string;
  reason?: string | null;
  notes?: string | null;
}

//get block dates
export const useGetBlockDates = () => {
  return useQuery({
    queryKey: ["block_dates"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/availability/");
      return res.data;
    },
  });
};

//get single blocked date
export const useGetSingleBlockedDates = (id: number | null) => {
  return useQuery({
    queryKey: ["Single_block_date", id],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/availability/${id}/detail/`);
      return res.data;
    },
    enabled: !!id,
  });
};

// post block dates
export const useBlockDates = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBlockedDatesPayload) => {
      return await axiosIntercept.post("/availability/create/", payload);
    },
    onSuccess: () => {
      toast.success("Dates blocked!");
      queryClient.invalidateQueries({ queryKey: ["block_dates"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//edit block dates
export const useEditBlockedDates = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBlockedDatesPayload) => {
      return await axiosIntercept.patch(
        `/availability/${payload.id}/edit/`,
        payload,
      );
    },
    onSuccess: (_data, variables) => {
      toast.success("Block dates updated!"); 
      queryClient.invalidateQueries({
        queryKey: ["Single_block_date", variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["block_dates"],
      });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

// delete or unblock the blocked dates
export const useUnblockDates = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await axiosIntercept.delete(`/availability/${id}/`);
    },
    onSuccess: () => {
      toast.success("Dates unblocked!");
      queryClient.invalidateQueries({ queryKey: ["block_dates"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};
