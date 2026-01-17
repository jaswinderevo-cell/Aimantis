import * as Yup from "yup";

export const AvailabilitySchema = Yup.object().shape({
  websiteBookable: Yup.string().required("This Field is required"),
  days: Yup.number()
    .required("This field is required")
    .typeError("Days must be a number")
    .positive("Days must be a positive number"),
  airbnbBookable: Yup.string().required("This Field is required"),
  date: Yup.date()
    .required("Date is required")
    .typeError("Must be a valid date")
    .min(new Date(), "Date must be in the future"),

  individualWebsiteBookable: Yup.string().required(
    "This Field Until is required",
  ),
  selectedRoomId: Yup.number().required("Room is required"),
  individualDays: Yup.number()
    .required("This field is required")
    .typeError("Days must be a number")
    .positive("Days must be a positive number"),
});
