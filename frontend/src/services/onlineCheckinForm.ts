import { OptionType } from "@/constants/constants";
import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookingGuestsPayload } from "./bookingUsers";

export type TemplateStructure = {
  id: number;
  name: string;
};

export type CheckinTemplate = {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  fields_count: number;
  structures: TemplateStructure[];
  created_at: string;
};
export type GetCheckinTemplatesResponse = CheckinTemplate[];

export type CheckinTemplatePayload = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  fields: Array<{
    slug: string;
    label: string;
    field_type: "text" | "number" | "date" | "select";
    target: "main_guest" | "additional_guest" | "both";
    is_required: boolean;
    order: number;
  }>;
};

//get checkin template form by bookingUid payload

export type CustomField = {
  slug: string;
  label: string;
  type: "text";
  required: boolean;
  meta: {
    category: string;
    section: "main_guest" | "additional_guest";
  };
};
// export type CheckinFieldMeta = {
//   category: string;
//   section: "main_guest" | "additional_guest";
//   options?: OptionType[];
// };
// export interface CheckinFormField {
//   slug: string;
//   label: string;
//   type: CheckinFieldType;
//   required: boolean;
//   choices?: string[];
//   meta: CheckinFieldMeta;
// }

export interface CheckinFormField {
  slug: string;
  label: string;
  type: CheckinFieldType;
  required: boolean;
  choices?: string[];
  category: string;
  section: "main_guest" | "additional_guest";
}

export interface CheckinTemplateInfo {
  id: number;
  name: string;
  description: string;
  slug: string;
}

export interface CheckinFormSections {
  main_guest: CheckinFormField[];
  additional_guest: CheckinFormField[];
}

export interface CheckinFormByBookingUidPayload {
  booking_uid: string;
  structure_id: number;
  source: "template" | "custom";
  template: CheckinTemplateInfo;
  sections: CheckinFormSections;
}
export type GuestFormValues = {
  full_name?: string;
  last_name?: string;
  zip_code?: string;
  country_of_birth?: string;
  date_of_birth?: string;
  gender?: string;
  document_type?: string;
  id_number?: string;
  nationality?: string;
  country?: string;
  city?: string;
  region?: string;
  address?: string;
};

export type CheckinFormikValues = {
  booking_id: number | null;
  guests: GuestFormValues[];
};
//

//get structures payload
export type CheckinFormPayload = {
  id: number;
  name: string;
  slug: string;
};
export type StructureWithCheckinFormPayload = {
  structure_id: number;
  structure_name: string;
  structure_type: "hotel" | "apartment" | "mixed_use";
  street_address: string;
  zip_code: string;
  country: string;
  total_properties_count: number;
  total_property_types_count: number;
  checkin_form: CheckinFormPayload | null;
  is_active: boolean;
};

//create new checkin form payload
export type CheckinFieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "file"
  | "country";

//for formik
export type CheckinFieldValueByType = {
  text: string;
  number: number | "";
  date: string;
  select: string;
  file: File | null;
  country: string;
};

export type CheckinField = {
  slug: string;
  label: string;
  type: CheckinFieldType;
  required: boolean;
  choices?: string[];
  category: string;
  section: "main_guest" | "additional_guest";
};

export type CheckinSections = {
  main_guest: CheckinField[];
  additional_guest: CheckinField[];
};

export type CreateCheckinTemplatePayload = {
  id?: number;
  name: string;
  description?: string;
  sections: CheckinSections;
};
//

//link template with structure payload
export type LinkTemplateWithStructurePayload = {
  structure_id: number;
  template_id: number;
  is_active: boolean;
};

//unlink template from structure payload
export type UnlinkTemplatePayload = {
  structure_id: number;
};

//---APIs---\\

//get all the checkin form templates
export const useGetCheckinTemplates = () => {
  return useQuery({
    queryKey: ["checkin-templates"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/checkin/templates/");
      return res.data;
    },
  });
};

//get checkin template by id
export const useGetCheckinTemplateById = (id: number | null) => {
  return useQuery({
    queryKey: ["chckinTemplate-by-id"],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/checkin/templates/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });
};

//get structures with checkin form
export const useGetStructuresByCheckinForm = () => {
  return useQuery({
    queryKey: ["structures-by-checkinform"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/checkin/structures/");
      return res.data;
    },
  });
};

//get default fields
export const useDefaultCheckinFields = () => {
  return useQuery({
    queryKey: ["checkin-default-fields"],
    queryFn: async () => {
      const res = await axiosIntercept.get(
        "/checkin/templates/default-fields/",
      );
      return res.data;
    },
    staleTime: Infinity,
    retry: false,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

//get template by structure id
export const useGetCheckinTemplateByStructureId = (structure_id: number) => {
  return useQuery({
    queryKey: ["checkin-by-structureId", structure_id],
    queryFn: async () => {
      const res = await axiosIntercept.get(
        `/checkin/structure/${structure_id}/form/`,
      );
      return res.data;
    },
    enabled: !!structure_id,
  });
};

//get template by booking uid
export const useGetCheckinTemplateByBookingUid = (
  uid?: string,
  enabled = true,
) => {
  return useQuery<CheckinFormByBookingUidPayload>({
    queryKey: ["checkin-by-bookingUid", uid],
    queryFn: async () => {
      const res = await axiosIntercept.get(`/checkin/booking/${uid}/form/`);
      return res.data;
    },
    enabled: !!uid && enabled,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

//post or create checkin form template
export const useCreateCheckinTemplate = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCheckinTemplatePayload) => {
      return axiosIntercept.post("/checkin/templates/create/", payload);
    },
    onSuccess: () => {
      toast.success("New checkin form created!");
      queryClient.invalidateQueries({ queryKey: ["checkin-templates"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//put or edit checkin template
export const useUpdateCheckinTemplate = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCheckinTemplatePayload) => {
      return axiosIntercept.put(
        `/checkin/templates/${payload.id}/update/`,
        payload,
      );
    },
    onSuccess: () => {
      toast.success("Checkin template updated!");
      queryClient.invalidateQueries({ queryKey: ["checkin-templates"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//link/sync checkin template with structure
export const useLinkTemplate = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LinkTemplateWithStructurePayload) =>
      axiosIntercept.post("/checkin/templates/link-structure/", payload),

    onSuccess: async () => {
      toast.success("Checkin template linked!");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["structures-by-checkinform"],
        }),
        queryClient.invalidateQueries({ queryKey: ["checkin-templates"] }),
      ]);
    },

    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

// unlink checkin template from structure
export const useUnlinkTemplate = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UnlinkTemplatePayload) =>
      axiosIntercept.post("/checkin/templates/unlink-structure/", payload),

    onSuccess: async () => {
      toast.success("Checkin template unlinked!");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["structures-by-checkinform"],
        }),
        queryClient.invalidateQueries({ queryKey: ["checkin-templates"] }),
      ]);
    },

    onError: showAPIErrorMessage,
  });
};

// post/submit the online checkin form by booking uid
export const useSubmitCheckinForm = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      booking_uid,
      payload,
    }: {
      booking_uid: string;
      payload: BookingGuestsPayload;
    }) => {
      await axiosIntercept.post(`/checkin/booking/${booking_uid}/`, payload);
      console.log("submitting", booking_uid);
    },
    onSuccess: () => {
      toast.success("Form submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["checkin-templates"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//delete checkin template
export const useDeleteCheckinTemplate = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosIntercept.delete(`/checkin/templates/${id}/delete/`);
    },
    onSuccess: () => {
      toast.success("Checkin template deleted!");
      queryClient.invalidateQueries({ queryKey: ["checkin-templates"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};
