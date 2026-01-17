import * as Yup from "yup";

export const AcceptInvitationSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters long"),

  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),

  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),

  confirm_password: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  agreedToTerms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions",
  ),
  receiveUpdates: Yup.boolean().oneOf([true], "You must accept this field"),
});
