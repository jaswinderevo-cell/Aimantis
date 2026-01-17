import * as Yup from "yup";

export const AgenziaSchema = Yup.object().shape({
  // Step 1 - Credentials
  credentialName: Yup.string()
    .trim()
    .required("Credential Name is required"),
  activation: Yup.string()
    .oneOf(["Yes", "No"], "Please select Activation")
    .required("Activation is required"),
  intermediary: Yup.string()
    .trim()
    .required("Intermediary is required"),

  // Step 2 - Fiscal Data
  name: Yup.string()
    .trim()
    .required("Name is required"),
  lastName: Yup.string()
    .trim()
    .required("Last Name is required"),
  vatNumber: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9]+$/, "VAT Number must be alphanumeric and should not have spacing")
    .required("VAT Number is required"),
  fiscalCode: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9]+$/, "Fiscal Code must be alphanumeric and should not have spacing")
    .required("Fiscal Code is required"),
  fiscalAddress: Yup.string()
    .trim()
    .required("Fiscal Address is required"),
  city: Yup.string()
    .trim()
    .required("City is required"),
  region: Yup.string()
    .trim()
    .required("Region is required"),
  country: Yup.string()
    .trim()
    .required("Country is required"),
  pecEmail: Yup.string()
    .trim()
    .email("Enter a valid PEC email")
    .required("PEC Email is required"),

  // Step 3 - Contract Signing
  serviceAgreement: Yup.boolean()
    .oneOf([true], "You must accept the Service Agreement"),
  civilCodeApproval: Yup.boolean()
    .oneOf([true], "You must approve the Civil Code clauses"),
  privacyNotice: Yup.boolean()
    .oneOf([true], "You must accept the Privacy Notice"),
});
