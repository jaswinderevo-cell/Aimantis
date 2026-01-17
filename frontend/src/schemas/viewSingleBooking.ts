import * as Yup from "yup";

export const ViewBookingDetailsSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your first name"),
  lastName: Yup.string().required("Please enter your last name"),
  checkinDate: Yup.date().required("Check-in date is required"),
  checkoutDate: Yup.date()
    .required("Check-out date is required")
    .min(Yup.ref("checkinDate"), "Check-out must be after check-in"),
  platform: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      }),
    )
    .min(1, "Please select at least one Platform")
    .required("Plaform is required"),
  bookingResID: Yup.string().required("Reservation ID is required"),
  creationDate: Yup.date().required("Creation date is required"),
  room: Yup.string().required("Room is required"),
  adults: Yup.number()
    .typeError("Adults must be a number")
    .min(1, "At least one adult is required")
    .required("Number of adults is required"),
  children: Yup.number()
    .typeError("Children must be a number")
    .min(0, "Children cannot be negative")
    .required("Number of children is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  number: Yup.string()
    .matches(/^\d+$/, "Phone number must be digits only")
    .required("Phone number is required"),
  language: Yup.string().required("Preferred language is required"),
  address: Yup.string().required("Address is required"),
  zip: Yup.string().required("Zip code is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  totalPrice: Yup.number()
    .typeError("Total price must be a number")
    .required("Total price is required"),
  cityTax: Yup.number()
    .typeError("City tax must be a number")
    .required("City tax is required"),
  basePrice: Yup.number()
    .typeError("Base price must be a number")
    .required("Base price is required"),
  cleaningFee: Yup.number()
    .typeError("Cleaning fee must be a number")
    .required("Cleaning fee is required"),
  commision: Yup.number()
    .typeError("Commission must be a number")
    .required("Platform commission is required"),
  payoutAmount: Yup.number()
    .typeError("Payout must be a number")
    .required("Payout amount is required"),
  dueProperty: Yup.number()
    .typeError("Due at property must be a number")
    .required("Due amount is required"),
});
