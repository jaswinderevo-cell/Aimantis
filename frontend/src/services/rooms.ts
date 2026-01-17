import { OptionType } from "@/constants/constants";
import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type PropertyPayload = {
  id?: number | null;
  name: string;
  structure: number | null;
  internal_property_type_id?: string;
  property_type: number | null;
  floor_number: number;
  amenities: OptionType[];
};
// API request type (for backend)
export type PropertyAPIRequest = Omit<PropertyPayload, "amenities"> & {
  amenities: string;
};

//get all rooms
export const useGetAllRooms = () => {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/properties/`);
      return res.data;
    },
  });
};

//add new room
export const useAddNewRoom = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PropertyPayload) => {
      const apiPayload: PropertyAPIRequest = {
        ...payload,
        amenities: payload.amenities.map((a) => a.label).join(", "),
      };
      return axiosIntercept.post("/properties/", apiPayload);
    },
    onSuccess: () => {
      toast.success("New Room added!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//edit room
export const useUpdateRoom = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PropertyPayload) => {
      const apiPayload: PropertyAPIRequest = {
        ...payload,
        amenities: payload.amenities.map((a) => a.label).join(", "),
      };
      return axiosIntercept.patch(`/properties/${payload.id}/`, apiPayload);
    },
    onSuccess: () => {
      toast.success("Room Updated!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//delete room
export const useDeleteRoom = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosIntercept.delete(`/properties/${id}/`);
    },
    onSuccess: () => {
      toast.success("Room Deleted!");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};
