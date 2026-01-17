import * as Yup from "yup";

export const UserProfileSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),
  company: Yup.string().required("Company is required"),
  job_title: Yup.string(),
});
