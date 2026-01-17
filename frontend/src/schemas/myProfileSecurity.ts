import * as Yup from "yup";

export const MyProfileSecuritySchema = Yup.object().shape({
  current_password: Yup.string().required("Current password is required"),
  new_password: Yup.string()
    .required("Please enter new password")
    .min(8, "Must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&#]/, "Must contain at least one special character"),
  confirm_password: Yup.string()
    .required("Please confirm your new password")
    .oneOf([Yup.ref("new_password")], "Passwords must match"),
});
