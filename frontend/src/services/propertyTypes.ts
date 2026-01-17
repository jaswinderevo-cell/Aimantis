import { OptionType } from "@/constants/constants";
import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type PropertyTypePayload = {
  id?: number;
  structure: number | null;
  name: string;
  internal_property_type_id: string;
  property_size_sqm: string;
  max_guests: number;
  num_beds: number;
  num_sofa_beds: number;
  num_bedrooms: number;
  num_bathrooms: number;
  amenities: OptionType[];
  beds: {
    bed_type: string;
    quantity: number;
  }[];
  image_url: string;
  _localFiles?: File[];
};

// API request type (for backend)
export type PropertyTypeAPIRequest = Omit<PropertyTypePayload, "amenities" | "_localFiles"
> & {
  amenities: string;
};

//Get Property Types
export const useGetPropertyType = () => {
  return useQuery({
    queryKey: ["propertyTypes"],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/property-types/`);
      return res.data;
    },
  });
};

//Get Property Types by Structure
export const useGetPropertyTypeByStructure = (structureId: number) => {
  return useQuery({
    queryKey: ["propertyTypes", structureId],
    queryFn: async () => {
      const res = await axiosIntercept.get(
        `/property-types/by-structure/?structure_id=${structureId}`,
      );
      return res.data;
    },
    enabled: !!structureId,
  });
};

// Add Property Type
export const useAddPropertyType = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PropertyTypePayload) => {
      const apiPayload: PropertyTypeAPIRequest = {
        ...payload,
        amenities: payload.amenities.map((a) => a.label).join(", "),
      };

      return axiosIntercept.post("/property-types/", apiPayload);
    },

    onSuccess: () => {
      toast.success("Property Type added!");
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//Edit Property Type
export const useUpdatePropertyType = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PropertyTypePayload) => {
      const apiPayload: PropertyTypeAPIRequest = {
        ...payload,
        amenities: payload.amenities.map((a) => a.label).join(", "),
      };

      return axiosIntercept.patch(`/property-types/${payload.id}/`, apiPayload);
    },
    onSuccess: () => {
      toast.success("Property Type Updated!");
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//Delete Property Types
export const useDeletePropertyType = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosIntercept.delete(`/property-types/${id}/`);
    },
    onSuccess: () => {
      toast.success("Property Type Deleted!");
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};
