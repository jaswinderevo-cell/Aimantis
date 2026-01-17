import * as Yup from "yup";

export const BlockDatesSchema = Yup.object().shape({
  structure: Yup.number()
    .required("Structure is required")
    .min(1, "Please select a valid structure"),
  property_type: Yup.number()
    .required("Property type is required")
    .min(1, "Please select a valid Property type"),
  property: Yup.number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : value,
    )
    .required("Property is required")
    .min(1, "Please select a valid property"),

  start_date: Yup.date()
    .required("Check-in date is required")
    .typeError("Enter a valid check-in date"),

  end_date: Yup.date()
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
});
