import { DatePicker } from "@/components/DatePicker";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import NumberCounter from "@/components/NumberInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  BOOKING_TYPE_OPTIONS,
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_SILVER,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import { BookingValidationSchema } from "@/schemas/createBooking";
import { useGetSingleBooking, useUpdateBooking } from "@/services/bookings";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import CountrySelect from "@/utils/countryDropdown";
import CustomSelect from "@/utils/customSelect";
import { useFormStatus } from "@/utils/disableFormHook";
import { format } from "date-fns";
import { getIn, useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  TbCalendarUser,
  TbCoins,
  TbDeviceFloppy,
  TbFileInvoice,
  TbId,
} from "react-icons/tb";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ViewBookingDetails = () => {
  const { id } = useParams();
  const numBookingId = Number(id);

  //get single booking
  const getSingleBooking = useGetSingleBooking(numBookingId);
  const bookingData = getSingleBooking?.data;
  console.log("bookingData", bookingData);

  //update booking
  const updateBookingMutation = useUpdateBooking();

  //get all rooms
  const getRooms = useGetAllRooms();
  const roomsData = getRooms?.data || [];

  const navigate = useNavigate();
  const [lengthOfStay, setLengthOfStay] = useState(0);

  const location = useLocation();
  const fromFrontDesk = location.state?.fromFrontDesk === true;

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
    setFieldTouched,
    values,
    errors,
    isSubmitting,
    isValid,
    setFieldValue,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: BookingValidationSchema,
    initialValues: {
      id: bookingData?.id ?? null,
      structure: bookingData?.structure ?? null,
      property_type: bookingData?.property_type ?? null,
      property: bookingData?.property ?? null,
      property_name: bookingData?.property_name ?? "",
      check_in_date: bookingData?.check_in_date ?? "",
      check_out_date: bookingData?.check_out_date ?? "",
      length_of_stay: bookingData?.length_of_stay ?? 0,
      adults_count: bookingData?.adults_count ?? 0,
      children_count: bookingData?.children_count ?? 0,
      special_requests: bookingData?.special_requests ?? "",
      base_price: bookingData?.base_price ?? "00.00",
      cleaning_fee: bookingData?.cleaning_fee ?? "00.00",
      other_extra_fees: bookingData?.other_extra_fees ?? "00.00",
      city_tax: bookingData?.city_tax ?? "00.00",
      subtotal: bookingData?.subtotal ?? "00.00",
      total_price: bookingData?.total_price ?? "00.00",
      payment_method: bookingData?.payment_method ?? "cash",
      payment_status: bookingData?.payment_status ?? "pending",
      external_reference: bookingData?.external_reference ?? "",
      platform: bookingData?.platform ?? "",
      platform_reservation_id: bookingData?.platform_reservation_id ?? "",
      due_at_property: bookingData?.due_at_property ?? "",
      invoice_info: bookingData?.invoice_info ?? "",
      citations: bookingData?.citations ?? 0,
      guests: bookingData?.guests?.length 
        ? bookingData.guests
        : [
          {
            id: 0,
            booking: bookingData?.id ?? null,
            full_name: "",
            is_main_guest: true,
            email: "",
            phone: "",
            nationality: "",
            zip_code: "",
            id_number: "",
            address: "",
            postal_code: "",
            country: "",
            city: "",
            language_preference: "",
            guest_notes: "",
            special_requests: "",
            created_at: "",
            updated_at: "",
          },
        ],
    },
    onSubmit: (values, { setSubmitting }) => {
      console.log(values);
      setSubmitting(true);
      updateBookingMutation.mutate(values, {
        onSuccess: () => {
          setSubmitting(false);
          resetForm();
          if (fromFrontDesk) {
            navigate(ROUTES.FRONT_DESK);
          } else {
            navigate(ROUTES.BOOKINGS_AND_CHECKINS);
          }
        },
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  });

  //filter rooms by structure
  const propertyType = values.property_type ?? 0;
  const filteredRooms = (roomsData || []).filter(
    (item: PropertyPayload) =>
      item.structure === values.structure &&
      propertyType > 0 &&
      item.property_type === propertyType,
  );

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: updateBookingMutation.isPending,
  });

  // calculate length of stay when dates change
  useEffect(() => {
    if (values.check_in_date && values.check_out_date) {
      const checkinDate = new Date(values.check_in_date);
      const checkoutDate = new Date(values.check_out_date);

      if (checkoutDate > checkinDate) {
        const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        setLengthOfStay(nights);
        setFieldValue("length_of_stay", nights);
      } else {
        setLengthOfStay(0);
        setFieldValue("length_of_stay", 0);
      }
    } else {
      setLengthOfStay(0);
      setFieldValue("length_of_stay", 0);
    }
  }, [values.check_in_date, values.check_out_date, setFieldValue]);

  //show subtotal value on mount
  useEffect(() => {
    const subtotal =
      lengthOfStay * Number(values.base_price) +
      Number(values.cleaning_fee) +
      Number(values.other_extra_fees);

    setFieldValue("subtotal", subtotal);

    const total = subtotal + Number(values.city_tax);
    setFieldValue("total_price", total);
  }, [
    lengthOfStay,
    values.base_price,
    values.cleaning_fee,
    values.other_extra_fees,
    values.city_tax,
    setFieldValue,
  ]);

  const renderError = (field: string) => {
    const error = getIn(errors, field);
    return typeof error === "string" ? (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        {error}
      </span>
    ) : (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        &nbsp;
      </span>
    );
  };

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-gray-800">
        Loading...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: COLOR_LIGHT_BLUE }}
    >
      <div className="bg-white w-full min-h-full rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset disabled={isFormDisabled}>
            {/* Reservation Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <TbCalendarUser className="text-black" size={22} />
                <h2 className="text-[16px] font-semibold text-black">
                  Reservation Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
                <div>
                  <Label
                    htmlFor="guests[0].full_name"
                    className="text-sm mb-2 font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Guest Name
                  </Label>
                  <Input
                    id="guests[0].full_name"
                    name="guests[0].full_name"
                    placeholder="Enter name"
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                    value={values.guests[0].full_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {renderError("guests[0].full_name")}
                </div>
                <div>
                  <Label
                    className="text-sm mb-2 font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Platform
                  </Label>
                  <MultiSelectDropdown
                    name="platform"
                    value={
                      values.platform
                        ? BOOKING_TYPE_OPTIONS.filter((opt) =>
                          values.platform.split(",").includes(opt.value),
                        )
                        : []
                    }
                    onChange={(selected) => {
                      const platformString = selected
                        .map((s) => s.value)
                        .join(",");
                      setFieldValue("platform", platformString);
                    }}
                    options={BOOKING_TYPE_OPTIONS}
                    placeholder="Select platforms"
                  />

                  {renderError("platform")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Check in date
                  </Label>
                  <DatePicker
                    value={values.check_in_date ?? ""}
                    onBlur={() => handleBlur("check_in_date")}
                    onChange={(val) => setFieldValue("check_in_date", val)}
                    name="check_in_date"
                    width=""
                  />
                  {renderError("check_in_date")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Check out date
                  </Label>
                  <DatePicker
                    value={values.check_out_date ?? ""}
                    onBlur={() => handleBlur("check_out_date")}
                    onChange={(val) => setFieldValue("check_out_date", val)}
                    name="check_out_date"
                    width=""
                  />
                  {renderError("check_out_date")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Creation Date
                  </Label>
                  <DatePicker
                    value={
                      values.guests[0].created_at
                        ? format(
                          new Date(values.guests[0].created_at),
                          "yyyy-MM-dd",
                        )
                        : ""
                    }
                    onBlur={() => handleBlur("guests[0].created_at")}
                    onChange={(val) =>
                      setFieldValue("guests[0].created_at", val)
                    }
                    name="created_at"
                    width=""
                  />
                </div>

                <div className="mt-5 md:mt-0">
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Room
                  </Label>

                  <CustomSelect
                    value={values.property}
                    onChange={(val) => setFieldValue("property", Number(val))}
                    options={filteredRooms.map((room: PropertyPayload) => ({
                      value: room.id,
                      label: room.name,
                    }))}
                    error={renderError("property")}
                  />
                </div>

                <div>
                  <NumberCounter
                    label="Number of adults_count"
                    labelColor={COLOR_LIGHT_GRAY}
                    borderColor={COLOR_LIGHT_SILVER}
                    value={values.adults_count}
                    onChange={(val) => setFieldValue("adults_count", val)}
                    min={1}
                    name=""
                    error={renderError("adults_count")}
                    disabled={isFormDisabled}
                  />
                </div>

                <div>
                  <NumberCounter
                    label="Number of children_count"
                    labelColor={COLOR_LIGHT_GRAY}
                    borderColor={COLOR_LIGHT_SILVER}
                    value={values.children_count}
                    onChange={(val) => setFieldValue("children_count", val)}
                    name=""
                    error={renderError("children_count")}
                    disabled={isFormDisabled}
                  />
                </div>

                <div className="w-full md:col-span-2 lg:col-span-3">
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Platform Reservation ID
                  </Label>
                  <Input
                    name="bookingResID"
                    value={"Reservation ID"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-[38px] w-full border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("bookingResID")}
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <TbId className="text-black" size={22} />
                <h2 className="text-[16px] font-semibold text-black">
                  Guest Details
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
                <div>
                  <Label
                    htmlFor="guests[0].email"
                    className="text-sm mb-2 font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Email
                  </Label>
                  <Input
                    type="email"
                    placeholder="Email"
                    name="guests[0].email"
                    value={values.guests[0].email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("guests[0].email")}
                </div>

                <div>
                  <Label
                    htmlFor="guests[0].phone"
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Phone Number
                  </Label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    name="guests[0].phone"
                    value={values.guests[0].phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("guests[0].phone")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Preferred Language
                  </Label>
                  <Select
                    name="guests[0].language_preference"
                    value={values.guests[0].language_preference}
                    onValueChange={(val) =>
                      setFieldValue("guests[0].language_preference", val)
                    }
                  >
                    <SelectTrigger className="h-10 w-full border border-gray-300 rounded-md px-3">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem
                        className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        value="Italian"
                      >
                        Italian
                      </SelectItem>
                      <SelectItem
                        className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        value="English"
                      >
                        English
                      </SelectItem>
                      <SelectItem
                        className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        value="Spanish"
                      >
                        Spanish
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {renderError("guests[0].language_preference")}
                </div>

                <div>
                  <Label
                    htmlFor="guests[0].address"
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Street Address
                  </Label>
                  <Input
                    placeholder="Street address"
                    name="guests[0].address"
                    value={values.guests[0].address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("guests[0].address")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Zip Code
                  </Label>
                  <Input
                    name="guests[0].zip_code"
                    placeholder="Enter zip code"
                    value={values.guests[0].zip_code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("guests[0].zip_code")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    City
                  </Label>
                  <Input
                    name="guests[0].city"
                    value={values.guests[0].city}
                    placeholder="Enter city"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("guests[0].city")}
                </div>

                <div>
                  <CountrySelect
                    label="Country"
                    name="guests[0].nationality"
                    value={values.guests[0].nationality ?? ""}
                    setFieldValue={setFieldValue}
                    renderError={renderError}
                    width="100%"
                    height="40px"
                  />
                </div>
              </div>
            </div>

            {/* Price Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <TbCoins className="text-black" size={22} />
                <h2 className="text-[16px] font-semibold text-black">
                  Price Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Total Price
                  </Label>
                  <Input
                    name="total_price"
                    value={values.total_price}
                    onChange={(e) =>
                      setFieldValue("total_price", Number(e.target.value))
                    }
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("total_price")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    City Tax
                  </Label>
                  <Input
                    name="city_tax"
                    value={values.city_tax}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("city_tax")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Base Price
                  </Label>
                  <Input
                    name="base_price"
                    value={values.base_price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("base_price")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Cleaning Fee
                  </Label>
                  <Input
                    name="cleaning_fee"
                    value={values.cleaning_fee}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("cleaning_fee")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Platform Commission
                  </Label>
                  <Input
                    name="commission"
                    value={"commission"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("commission")}
                </div>

                <div>
                  <Label
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Payout Amount
                  </Label>
                  <Input
                    name="total_price"
                    value={values.total_price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("total_price")}
                </div>

                <div>
                  <Label
                    htmlFor="due_at_property"
                    className="mb-2 text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Due at property
                  </Label>
                  <Input
                    name="due_at_property"
                    placeholder="Enter due"
                    value={values.due_at_property}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="h-10 border-gray-300"
                    style={{ fontSize: "17px" }}
                  />
                  {renderError("due_at_property")}
                </div>
              </div>
            </div>

            {/* Invoice Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <TbFileInvoice className="text-black" size={22} />
                <h2 className="text-[16px] font-semibold text-black">
                  Invoice Information
                </h2>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className="btn w-full sm:w-fit text-white px-6 py-2 rounded-md flex items-center gap-2"
                disabled={
                  isSubmitting || updateBookingMutation.isPending || !isValid
                }
              >
                <TbDeviceFloppy size={18} />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default ViewBookingDetails;
