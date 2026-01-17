import * as Yup from "yup";

export const inviteUserSchema = Yup.object().shape({
  structure: Yup.number()
    .typeError("Structure is required")
    .required("Structure is required")
    .moreThan(0, "Structure is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  role: Yup.string().required("Role is required"),
  message: Yup.string()
    .max(500, "Message must be at most 500 characters")
    .nullable(),
});
