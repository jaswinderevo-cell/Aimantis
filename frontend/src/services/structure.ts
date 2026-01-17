import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type StructurePayload = {
  id?: number;
  name: string;
  structure_type: string;
  internal_reference_code: string;
  street_address: string;
  status: string;
  zip_code: string;
  country: string;
  legal_entity_name: string;
  tax_id_vat_number: number;
  default_currency: string;
  default_language: string;
  time_zone: string;
  default_check_in_time: string;
  default_check_out_time: string;
  image_url: string;
  _localFiles?: File[];
};

//  Get All Structures
export const useGetStructures = () => {
  return useQuery({
    queryKey: ["structures"],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/structures/`);
      return res.data;
    },
  });
};

//get structure by id
export const useGetStructureById = (id: number) => {
  return useQuery({
    queryKey: ["structure", id],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/structures/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });
};

//Add Structure
export const useAddStructure = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StructurePayload) => {
      return axiosIntercept.post("/structures/", payload);
    },
    onSuccess: () => {
      toast.success("New Structure added!");
      queryClient.invalidateQueries({ queryKey: ["structures"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log(error);
    },
  });
};

//edit structure
export const useUpdateStructure = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StructurePayload) => {
      return axiosIntercept.patch(`/structures/${payload.id}/`, payload);
    },
    onSuccess: () => {
      toast.success("Structure Updated!");
      queryClient.invalidateQueries({ queryKey: ["structures"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//delete structure
export const useDeleteStructure = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosIntercept.delete(`/structures/${id}/`);
    },
    onSuccess: () => {
      toast.success("Structure Deleted!");
      queryClient.invalidateQueries({ queryKey: ["structures"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};
