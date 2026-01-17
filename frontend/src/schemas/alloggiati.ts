import * as Yup from "yup";

export const AlloggiatiSchema = Yup.object().shape({
  credentialName: Yup.string()
    .required("Credential name is required")
    .max(50, "Credential name must be at most 50 characters"),

  credentialType: Yup.string()
    .required("Credential type is required")
    .oneOf(
      ["With Digital Certificate", "With Code"],
      "Invalid credential type",
    ),

  userName: Yup.string()
    .required("Username is required")
    .max(50, "Username must be at most 50 characters"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  certifiedPassword: Yup.string().when("credentialType", {
    is: "With Digital Certificate",
    then: (schema) =>
      schema
        .required("Certified password is required")
        .min(6, "Must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),

  webServiceKey: Yup.string().when("credentialType", {
    is: "With Code",
    then: (schema) =>
      schema
        .required("Web service key is required")
        .min(6, "Must be at least 6 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
