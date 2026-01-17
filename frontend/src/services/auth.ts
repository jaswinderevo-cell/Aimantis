import { ROUTES } from "@/constants/routes";
import useShowAPIErrorMessage from "@/hooks/api/useShowErrorMessage";
import axiosIntercept from "@/utils/axiosInterceptor";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  company: string;
  phone_number: string;
  property_count: number;
  agreedToTerms?: false;
  receiveUpdates?: false;
};

const baseURL = import.meta.env.VITE_API_URL;

//login
export const useLogin = () => {
  const navigate = useNavigate();
  const showAPIErrorMessage = useShowAPIErrorMessage();
  return useMutation({
    mutationFn(payload: AuthPayload) {
      return axiosIntercept.post("/login/", payload);
    },
    onSuccess(res) {
      console.log("Login response:", res.data.data);
      const { access, refresh } = res.data.data;
      if (!access || !refresh) {
        console.error("Access or Refresh token missing from response");
      }
      localStorage.setItem("token", access);
      localStorage.setItem("refresh", refresh);
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log("Login", error);
    },
  });
};

//forgot password
export const useForgotPassword = () => {
  const showAPIErrorMessage = useShowAPIErrorMessage();
  return useMutation({
    mutationFn: (email: string) =>
      axios.post("/api/forgot-password/", { email }, { baseURL }),
    onSuccess: (res) => {
      const { message } = res.data;
      toast.success(message || "Password reset email sent successfully.");
    },
    onError: showAPIErrorMessage,
  });
};

//logout
export const useLogout = () => {
  const navigate = useNavigate();
  const showAPIErrorMessage = useShowAPIErrorMessage();

  return useMutation({
    mutationFn: () => {
      return axiosIntercept.post("/logout/");
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      navigate(ROUTES.LOGIN);
    },
    onError: showAPIErrorMessage,
  });
};

// sign-up
export const useSignup = () => {
  const navigate = useNavigate();
  const showAPIErrorMessage = useShowAPIErrorMessage();
  return useMutation({
    mutationFn(payload: SignUpPayload) {
      return axiosIntercept.post("/signup/", payload);
    },
    onSuccess: (data) => {
      toast.success("Signed up successfully, now please login!");
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: unknown) => {
      showAPIErrorMessage(error);
      console.log(error);
    },
  });
};
