import * as Yup from "yup";

export const BookingValidationSchema = Yup.object().shape({
  structure: Yup.number()
    .required("Structure is required")
    .min(1, "Please select a valid structure"),
  property_type: Yup.number().required("Property type is required"),
  property: Yup.number()
    .nullable()
    .required("Property is required"),
  check_in_date: Yup.date()
    .required("Check-in date is required")
    .typeError("Enter a valid check-in date"),

  check_out_date: Yup.date()
    .required("Check-out date is required")
    .typeError("Enter a valid check-out date")
    .test(
      "is-after-checkin",
      "Check-out must be after check-in",
      function (value) {
        const { check_in_date } = this.parent;
        if (!value || !check_in_date) return true;
        return value > check_in_date;
      },
    ),

  length_of_stay: Yup.number().min(0).required(),

  adults_count: Yup.number()
    .min(1, "At least 1 adult is required")
    .required("Adults count is required"),
  children_count: Yup.number().min(0).required(),

  special_requests: Yup.string().nullable(),

  platform: Yup.string().required("Please select booking platform"),
  platform_reservation_id: Yup.string(),
  due_at_property: Yup.number().typeError("Enter a valid amount (eg. 50)"),

  base_price: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Invalid base price")
    .required("Base price is required"),

  cleaning_fee: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Invalid cleaning fee")
    .required("Cleaning fee is required"),

  other_extra_fees: Yup.string()
    .matches(/^-?\d+(\.\d{1,2})?$/, "Invalid extra fees")
    .required("Other extra fees are required"),

  city_tax: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Invalid city tax")
    .required("City tax is required"),

  subtotal: Yup.string()
    // .matches(/^\d+(\.\d{1,2})?$/, "Invalid subtotal")
    .required(),

  total_price: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Invalid total")
    .required(),

  payment_method: Yup.mixed<
    "cash" | "credit_card" | "bank_transfer" | "online"
  >()
    .oneOf(["cash", "credit_card", "bank_transfer", "online"])
    .required("Payment method is required"),

  payment_status: Yup.mixed<"pending" | "partially_paid" | "fully_paid">()
    .oneOf(["pending", "partially_paid", "fully_paid"])
    .required("Payment status is required"),

  external_reference: Yup.string().nullable(),
  invoice_info: Yup.string().nullable(),
  citations: Yup.number().min(0),

  guests: Yup.array()
    .of(
      Yup.object().shape({
        booking: Yup.number().nullable(),
        full_name: Yup.string()
          .required("Guest name is required")
          .min(2, "Name must be at least 2 characters"),
        is_main_guest: Yup.boolean(),
        email: Yup.string().email("Invalid email address"),
        phone: Yup.string()
          .nullable()
          .matches(
            /^(\+?\d{1,15})?$/,
            "Phone must contain only digits and optional '+'",
          ),
        nationality: Yup.string().nullable(),
        id_number: Yup.string().nullable(),
        address: Yup.string().nullable(),
        postal_code: Yup.string().nullable(),
        country: Yup.string().nullable(),
        language_preference: Yup.string().nullable(),
        guest_notes: Yup.string().nullable(),
        special_requests: Yup.string().nullable(),
        created_at: Yup.string().nullable(),
        updated_at: Yup.string().nullable(),
      }),
    )
    .min(1, "At least one guest is required")
    .required("Guests are required"),
});
