import * as Yup from "yup";

export const BulkChangePriceSchema = Yup.object().shape({
  properties: Yup.array()
    .min(1, "Please select at least one room")
    .of(Yup.string().required("Room is required")),
  start_date: Yup.date().required("Start date is required"),
  end_date: Yup.date().required("End date is required"),
  base_price: Yup.number().required("Price is required"),
  min_nights: Yup.number()
    .typeError("Must be a number")
    .required("Min number of nights is required")
    .min(1, "At least 1 night"),
  weekdays: Yup.array()
    .of(Yup.string()),
  booking_pct: Yup.number()
    .typeError("Booking percentage must be a number")
    .required("Booking percentage is required")
    .min(0, "Must be at least 0"),
  airbnb_pct: Yup.number()
    .typeError("Airbnb percentage must be a number")
    .required("Airbnb percentage is required")
    .min(0, "Must be at least 0"),
  experia_pct: Yup.number()
    .typeError("Expedia percentage must be a number")
    .required("Expedia percentage is required")
    .min(0, "Must be at least 0"),
});
