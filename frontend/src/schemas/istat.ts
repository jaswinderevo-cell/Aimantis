import * as Yup from "yup";

export const IstatSchema = Yup.object().shape({
  credentialName: Yup.string()
    .required("Credential name is required")
    .max(50, "Credential name must be at most 50 characters"),

  istatPortal: Yup.string()
    .required("ISTAT portal is required")
    .oneOf(["Portal 1", "Portal 2"], "Invalid portal selected"),

  portal: Yup.string().nullable(),

  userName: Yup.string()
    .required("Username is required")
    .max(50, "Username must be at most 50 characters"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});
