import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UserProfilePayload {
  first_name: string;
  last_name: string;
  email?: string;
  phone_number: string;
  company: string;
  job_title: string;
  image_url?: string;
  _localFiles?: File[];
  company_logo_url: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface TwoFactorAuthenticationPayload {
  two_factor_enabled: boolean;
}

export interface SingleSessionResponse {
  id: number;
  session_key: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  operating_system: string;
  location: string;
  is_active: boolean;
  login_time: string;
  last_activity: string;
  logout_time: string | null;
  session_duration: string;
  is_current_session: boolean;
}

export interface SessionResponse {
  success: boolean;
  message: string;
  count: number;
  data: SingleSessionResponse[];
}

//--Profile tab--//

//get my profile
export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/profile/");
      return res.data;
    },
  });
};

//update my-profile
export const useUpdateProfile = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserProfilePayload) => {
      return axiosIntercept.post("/profile/update/", payload);
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log(error);
    },
  });
};

//post compony logo (not in use yet)
export const useUploadCompanyLogo = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => {
      return axiosIntercept.post("/profile/company-logo/", payload);
    },
    onSuccess: () => {
      toast.success("Logo added!");
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log(error);
    },
  });
};

//--Security tab--//

//change-password
export const useChangePassword = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => {
      return axiosIntercept.patch("/security/change-password/", payload);
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log(error);
    },
  });
};

//get 2FA
export const useGetTwoFactorAuthentication = () => {
  return useQuery({
    queryKey: ["2fa"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/security/2fa/");
      return res.data;
    },
  });
};

//update 2FA
export const useTwoFactorAuthentication = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TwoFactorAuthenticationPayload) => {
      return axiosIntercept.patch("/security/2fa/", payload);
    },
    onSuccess: (res) => {
      const { message } = res.data;
      toast.success(message || "2FA settings updated!");
      queryClient.invalidateQueries({ queryKey: ["2fa"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log(error);
    },
  });
};

//get current user sessions
export const useGetCurrentSessions = (isActive: boolean) => {
  return useQuery({
    queryKey: ["currentSessions", isActive],
    queryFn: async () => {
      const res = await axiosIntercept.get(
        `/security/sessions/?active_only=${isActive}`,
      );
      return res.data;
    },
  });
};

//delete session
export const useDeleteSession = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (session_id: number) => {
      await axiosIntercept.delete(
        `/security/sessions/${session_id}/terminate/`,
      );
    },
    onSuccess: () => {
      toast.success("Session deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentSessions"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};

//delete all the sessions
export const useDeleteAllSessions = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await axiosIntercept.post("/security/sessions/terminate-others/");
    },
    onSuccess: () => {
      toast.success("All sessions deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["currentSessions"] });
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
    },
  });
};
