import * as Yup from "yup";

export const CheckinGuestSchema = Yup.object().shape({
  id: Yup.mixed().nullable(),
  booking_id: Yup.number(),

  // Basic info
  full_name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Full name must be at least 2 characters"),
  is_main_guest: Yup.boolean().required(),

  // Contact info
  email: Yup.string().email("Invalid email address").nullable(),
  phone: Yup.string()
    .nullable()
    .matches(
      /^[0-9+\s()-]*$/,
      "Phone number can only contain digits, spaces, +, -, and ()",
    )
    .max(20, "Phone number must be less than 20 characters"),

  // Birth info
  date_of_birth: Yup.string()
    .required("This field is required")
    .test("is-date", "Invalid date", (value) => {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test("not-future", "Date of birth cannot be in the future", (value) => {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
  country_of_birth: Yup.string().required("This field is required").trim(),
  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["male", "female", "other", ""], "Invalid gender"),

  // Document info
  document_type: Yup.string().required("Document type is required"),
  id_number: Yup.string()
    .required("ID number is required")
    .when("document_type", {
      is: (val: string) => val && val.length > 0,
      then: (schema) => schema.required("Document number is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  document_expiry_date: Yup.date()
    .nullable()
    .typeError("Invalid expiry date")
    .min(
      Yup.ref("document_issue_date"),
      "Expiry date must be after issue date",
    ),
  document_issuing_country: Yup.string().nullable(),

  // Address info
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  region: Yup.string().nullable(),
  zip_code: Yup.string().required("Zip code is required")
    .matches(/^[A-Za-z0-9\s-]*$/, "Invalid zip code format"),
  country: Yup.string().required("Country is required"),
  nationality: Yup.string().required("Nationality is required"),

  // Preferences
  language_preference: Yup.string().nullable(),
  special_requests: Yup.string().nullable(),
  guest_notes: Yup.string().nullable(),
});

export const CheckinValidationSchema = Yup.object().shape({
  booking_id: Yup.number().required("Booking ID is required"),

  guests: Yup.array()
    .of(CheckinGuestSchema)
    .min(1, "At least one guest is required")
    .test(
      "main-guest-check",
      "Exactly one main guest must be marked",
      (guests) => {
        const mainGuests = guests?.filter((g) => g.is_main_guest);
        return mainGuests && mainGuests.length === 1;
      },
    )
    .test(
      "main-guest-required-fields",
      "Main guest must have all required fields filled",
      (guests) => {
        if (!guests || guests.length === 0) return false;

        const mainGuest = guests.find((g) => g.is_main_guest);
        if (!mainGuest) return false;

        const requiredFields: (keyof typeof mainGuest)[] = [
          "full_name",
          "date_of_birth",
          "country_of_birth",
          "gender",
          "document_type",
          "id_number",
          "nationality",
          "address",
          "zip_code",
          "country",
          "city",
        ];

        return requiredFields.every((field) => {
          const value = mainGuest[field];
          return value !== "" && value !== null && value !== undefined;
        });
      },
    ),
});
