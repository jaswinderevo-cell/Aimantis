import axiosIntercept from "@/utils/axiosInterceptor";
import { useQuery } from "@tanstack/react-query";

export interface UserRole {
  id: number;
  name: string;
}

export interface UserResponsePayload {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_joined: string;
  created_by: number | null;
  is_active: boolean;
  is_super_admin: boolean;
  roles: UserRole[];
}

//get all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosIntercept.get("/users/");
      return res;
    },
  });
};
