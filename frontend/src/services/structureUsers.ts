import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface InviteUserPayload {
  email: string;
  role: string;
  message: string;
}

export interface AllStructureUserPayload {
  id: number;
  structure_id: number;
  structure_name: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  };
  role: string;
  created_at: string;
}

export interface StructureUsersResponse {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    full_name: string;
  };
  role: string;
  created_at: string;
}

export interface GetInvitationsResponse {
  id: string;
  email: string;
  structure: number;
  structure_name: string;
  role: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  invited_by_name: string;
  expires_at: string;
  accepted_at: string | null;
  is_expired: boolean;
  days_until_expiry: number;
  created_at: string;
}

export type AcceptInvitationPayload = {
  invitation_id: string | null;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  agreedToTerms?: boolean;
  receiveUpdates?: boolean;
};

//get single structure users
export const useGetStructureUsers = (structure_id?: number) => {
  return useQuery({
    queryKey: ["structureUsers", structure_id],
    queryFn: async () => {
      const res = await axiosIntercept.get(
        `/structures/${structure_id}/users/`,
      );
      return res.data;
    },
    enabled: !!structure_id,
  });
};

//get all structures users
export const useGetAllStructuresUsers = () => {
  return useQuery({
    queryKey: ["allStructuresUsers"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/structures/users/");
      return res.data;
    },
  });
};

//get all invitaions
export const useGetAllInvitations = () => {
  return useQuery({
    queryKey: ["getAllInvitaions"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/structures/invitations/all");
      return res.data;
    },
  });
};

//get invitation by id
export const useGetInvitaionById = (invitation_id: string) => {
  return useQuery({
    queryKey: ["invitationById", invitation_id],
    queryFn: async () => {
      const res = await axiosIntercept.get(
        `/structures/invitations/${invitation_id}/`,
      );
      return res.data;
    },
    enabled: !!invitation_id,
  });
};

//post invitation
export const useInviteUser = () => {
  const queryClient = useQueryClient();
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: (payload: InviteUserPayload & { structure: number }) =>
      axiosIntercept.post(`/structures/${payload.structure}/invite/`, payload),

    onSuccess: (response) => {
      toast.success("Invitation sent successfully!");
      queryClient.invalidateQueries({
        queryKey: ["getAllInvitaions"],
        exact: false,
      });
      return response.data;
    },

    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.error(error);
    },
  });
};

//accept invitation
export const useAcceptInvitation = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: (payload: AcceptInvitationPayload) =>
      axiosIntercept.post(
        `/structures/invitations/${payload.invitation_id}/accept/`,
        payload,
      ),
    onSuccess: (response) => {
      toast.success("Invitation Accepted, please login to proceed!");
      return response.data;
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.error(error);
    },
  });
};

//cancel invitations
export const useCancelInvitations = () => {
  const queryClient = useQueryClient();
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: (invitation_id: string) => {
      return axiosIntercept.patch(
        `/structures/invitations/${invitation_id}/cancel/`,
      );
    },
    onSuccess: (response) => {
      toast.success("Invitation cancelled!");
      queryClient.invalidateQueries({
        queryKey: ["getAllInvitaions"],
        exact: false,
      });
      return response.data;
    },

    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.error(error);
    },
  });
};

//resend invitations
export const useResendInvitation = () => {
  const queryClient = useQueryClient();
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: (invitation_id: string) => {
      return axiosIntercept.post(
        `/structures/invitations/${invitation_id}/resend/`,
      );
    },
    onSuccess: (response) => {
      toast.success("Invitation sent successfully!");
      queryClient.invalidateQueries({
        queryKey: ["getAllInvitaions"],
        exact: false,
      });
      return response.data;
    },

    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.error(error);
    },
  });
};

//delete invitations
export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: (invitation_id: string) => {
      return axiosIntercept.delete(
        `/structures/invitations/${invitation_id}/delete/`,
      );
    },
    onSuccess: (response) => {
      toast.success("Invitation Deleted!");
      queryClient.invalidateQueries({
        queryKey: ["getAllInvitaions"],
        exact: false,
      });
      return response.data;
    },

    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.error(error);
    },
  });
};
