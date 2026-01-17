import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .required("First name is required"),

  last_name: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .required("Last name is required"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address"),

  company: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required"),

  phone_number: Yup.string()
    .matches(
      /^[0-9+()\s-]*$/,
      "Phone number can only contain numbers and symbols (+, -, (, ))",
    )
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .required("Phone number is required"),

  property_count: Yup.number()
    .typeError("Property count must be a number")
    .min(1, "You must manage at least one property")
    .required("Property count is required"),

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
