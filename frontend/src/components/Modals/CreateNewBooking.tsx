import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  BOOKING_TYPE_OPTIONS,
  COLOR_DARK_RED,
  COLOR_EBONY,
  COLOR_GREEN,
  COLOR_LIGHT_SILVER,
  COLOR_OXFORD_BLUE,
  COLOR_YELLOW,
} from "@/constants/constants";
import { BookingValidationSchema } from "@/schemas/createBooking";
import { BookingPayload, useCreateBooking } from "@/services/bookings";
import {
  PropertyTypePayload,
  useGetPropertyType,
} from "@/services/propertyTypes";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { StructurePayload, useGetStructures } from "@/services/structure";
import CountrySelect from "@/utils/countryDropdown";
import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { Building, Calendar, Check, Edit, User } from "lucide-react";
import { useEffect, useState } from "react";
import { PiCurrencyEurBold } from "react-icons/pi";
import { DatePicker } from "../DatePicker";
import NumberCounter from "../NumberInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { useFormStatus } from "@/utils/disableFormHook";
import { format } from "date-fns";
import CustomSelect from "@/utils/customSelect";
import { getInitials } from "@/utils/helper";

interface CreateBookingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date?: Date | null;
  selectedPropertyTypeId?: number | null;
  selectedProperty?: PropertyPayload | null;
  selectedStructureId?: number | null;
}

export function CreateBooking({
  open,
  onOpenChange,
  date,
  selectedPropertyTypeId,
  selectedProperty,
  selectedStructureId,
}: CreateBookingProps) {
  const [loading, setLoading] = useState(false);
  const [lengthOfStay, setLengthOfStay] = useState(0);

  //get all structures
  const getAllStructures = useGetStructures();
  const initialStructureId = selectedStructureId
    ? selectedStructureId
    : getAllStructures?.data?.[0]?.id || 0;

  //get all structures
  const getAllRooms = useGetAllRooms();

  //get all property types
  const getPropertyTypes = useGetPropertyType();

  // create booking mutation
  const createBookingMutation = useCreateBooking();

  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = useFormik<BookingPayload>({
    enableReinitialize: true,
    validationSchema: BookingValidationSchema,
    validateOnMount: true,
    initialValues: {
      id: 0,
      structure: initialStructureId,
      property_type: selectedPropertyTypeId
        ? selectedPropertyTypeId
        : (selectedProperty?.property_type ?? null),
      property: selectedProperty?.id ?? null,
      check_in_date: date ? format(new Date(date), "yyyy-MM-dd") : "",
      check_out_date: "",
      length_of_stay: 0,
      adults_count: 2,
      children_count: 0,
      special_requests: "",
      base_price: "25.00",
      cleaning_fee: "10.00",
      other_extra_fees: "10.00",
      city_tax: "0.00",
      subtotal: "0.00",
      total_price: "0.00",
      payment_method: "cash",
      payment_status: "pending",
      external_reference: "",
      platform: "direct",
      platform_reservation_id: "",
      due_at_property: "",
      invoice_info: "",
      guests: [
        {
          id: 0,
          booking: null,
          full_name: "",
          is_main_guest: true,
          email: "",
          phone: "",
          nationality: "",
          id_number: "",
          address: "",
          postal_code: "",
          country: "",
          language_preference: "",
          guest_notes: "",
          special_requests: "",
          created_at: "",
        },
      ],
    },
    onSubmit: (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      createBookingMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
          setSubmitting(false);
        },
        onError: () => {
          setSubmitting(false);
        },
      });
    },
  });

  //filter property types by structure
  const filteredPropertyTypes = (getPropertyTypes?.data || []).filter(
    (item: PropertyTypePayload) =>
      values.structure === 0 || item.structure === values.structure,
  );

  //filter rooms by seleted property types and structure
  const propertyType = values.property_type ?? 0;
  const filteredRooms = (getAllRooms?.data || []).filter(
    (item: PropertyPayload) =>
      item.structure === values.structure &&
      propertyType > 0 &&
      item.property_type === propertyType,
  );

  //reset the input values
  useEffect(() => {
    setFieldValue("property_type", 0);
    setFieldValue("property", 0);
  }, [values.structure]);
  useEffect(() => {
    setFieldValue("property", 0);
  }, [values.property_type]);

  // Calculate length of stay when dates change
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  //set property value on first render
  useEffect(() => {
    if (!selectedProperty) return;
    if (values.property) return;

    if (filteredRooms.length > 0 && !values.property) {
      const match = filteredRooms.find(
        (r: PropertyPayload) => r.id === selectedProperty.id,
      );
      if (match) {
        setFieldValue("property", match.id);
      }
    }
  }, [filteredRooms, selectedProperty]);

  useEffect(() => {
    if (!open) {
      resetForm();
      setLoading(false);
    }
  }, [open, resetForm]);

  const getPaymentStatuscolor = (type: string) => {
    switch (type) {
    case "fully_paid":
      return COLOR_GREEN;
    case "partially_paid":
      return COLOR_YELLOW;
    case "pending":
      return COLOR_DARK_RED;
    default:
      return "gray";
    }
  };

  const renderError = (fieldName: string) => {
    const error = getIn(errors, fieldName);
    return typeof error === "string" ? (
      <span className="text-start text-red-500 text-xs min-h-6">{error}</span>
    ) : (
      <span className="text-start text-red-500 text-xs min-h-6">&nbsp;</span>
    );
  };

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: createBookingMutation.isPending,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-auto p-0">
        <div className="bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 ">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: COLOR_EBONY }}>
                New Booking
              </h1>
              <p
                className="mt-1 text-sm break-words mr-5"
                style={{ color: COLOR_OXFORD_BLUE }}
              >
                Create a new reservation for your property
              </p>
            </div>
            <button className="hover:bg-gray-100 rounded-lg">
              <IconX
                color="red"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={isFormDisabled}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Main Form - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                  {/* About the Stay */}
                  <div
                    className="bg-white border rounded-xl overflow-hidden"
                    style={{ borderColor: COLOR_LIGHT_SILVER }}
                  >
                    <div className="p-6 pb-0">
                      <div className="flex items-center mb-1 gap-2">
                        <Building
                          className="w-5 h-5"
                          style={{ color: COLOR_EBONY }}
                        />
                        <h2
                          className="text-[16px] font-bold"
                          style={{ color: COLOR_EBONY }}
                        >
                          About the Stay
                        </h2>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: COLOR_OXFORD_BLUE }}
                      >
                        Configure the booking details and room information
                      </p>
                    </div>

                    <div className="p-6">
                      <div className="space-y-5 mt-4">
                        {/* Room & Structure Selection */}
                        <div className="space-y-0">
                          <div>
                            {/* structure */}
                            <div>
                              <Label
                                htmlFor="structure"
                                className="text-[14px] font-medium mb-2 block"
                                style={{ color: COLOR_EBONY }}
                              >
                                Structure
                              </Label>

                              <Select
                                value={String(values.structure)}
                                onValueChange={(val) =>
                                  setFieldValue("structure", Number(val))
                                }
                              >
                                <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md text-sm">
                                  <SelectValue placeholder="Select Structure" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {getAllStructures?.data?.map(
                                    (item: StructurePayload) => {
                                      return (
                                        <SelectItem
                                          key={item.id}
                                          value={String(item.id)}
                                          className="data-[highlighted]:bg-gray-100 cursor-pointer"
                                        >
                                          {item.name}
                                        </SelectItem>
                                      );
                                    },
                                  )}
                                </SelectContent>
                              </Select>
                              {renderError("structure")}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* property types */}
                            <div>
                              <Label
                                htmlFor="property_type"
                                className="text-[14px] font-medium mb-2 block"
                                style={{ color: COLOR_EBONY }}
                              >
                                Property type
                              </Label>
                              <Select
                                value={
                                  values.property_type
                                    ? String(values.property_type)
                                    : selectedPropertyTypeId
                                      ? String(selectedPropertyTypeId)
                                      : ""
                                }
                                onValueChange={(val) =>
                                  setFieldValue("property_type", Number(val))
                                }
                              >
                                <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md text-sm">
                                  <SelectValue
                                    placeholder={
                                      filteredPropertyTypes.find(
                                        (item: PropertyTypePayload) =>
                                          item.id === selectedPropertyTypeId ||
                                          selectedProperty?.property_type,
                                      )?.name || "Select Property Type"
                                    }
                                  />
                                </SelectTrigger>

                                <SelectContent className="bg-white">
                                  {filteredPropertyTypes.map(
                                    (item: PropertyTypePayload) => (
                                      <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                        className="data-[highlighted]:bg-gray-100 cursor-pointer"
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>

                              {renderError("property_type")}
                            </div>

                            {/* rooms */}
                            <div>
                              <Label
                                htmlFor="property"
                                className="text-[14px] font-medium mb-2 block"
                                style={{ color: COLOR_EBONY }}
                              >
                                Room
                              </Label>
                              <CustomSelect
                                value={values.property}
                                onChange={(val) =>
                                  setFieldValue("property", Number(val))
                                }
                                options={filteredRooms.map(
                                  (room: PropertyPayload) => ({
                                    value: room.id,
                                    label: room.name,
                                  }),
                                )}
                                error={renderError("property")}
                              />
                            </div>
                          </div>

                          {/* adults & children */}
                          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 mt-3 md:mt-0 space-y-0">
                            <div>
                              <NumberCounter
                                label="# Adults"
                                value={values.adults_count}
                                onChange={(val) =>
                                  setFieldValue("adults_count", val)
                                }
                                name=""
                                min={1}
                                labelColor={COLOR_EBONY}
                                borderColor={COLOR_LIGHT_SILVER}
                                error={renderError("adults_count")}
                              />
                            </div>

                            <div>
                              <NumberCounter
                                label="# Children (under 14)"
                                value={values.children_count}
                                onChange={(val) =>
                                  setFieldValue("children_count", val)
                                }
                                name=""
                                labelColor={COLOR_EBONY}
                                borderColor={COLOR_LIGHT_SILVER}
                                min={0}
                                error={renderError("children_count")}
                              />
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="check_in_date"
                                className="text-[14px] font-medium mb-2 block"
                                style={{ color: COLOR_EBONY }}
                              >
                                Check-in Date
                              </Label>
                              <DatePicker
                                value={values.check_in_date}
                                onBlur={() => handleBlur("check_in_date")}
                                onChange={(val) =>
                                  setFieldValue("check_in_date", val)
                                }
                                name="check_in_date"
                              />
                              {renderError("check_in_date")}
                            </div>
                            <div>
                              <Label
                                htmlFor="check_out_date"
                                className="text-[14px] font-medium mb-2 block"
                                style={{ color: COLOR_EBONY }}
                              >
                                Check-out Date
                              </Label>
                              <DatePicker
                                value={values.check_out_date}
                                onBlur={() => handleBlur("check_out_date")}
                                onChange={(val) =>
                                  setFieldValue("check_out_date", val)
                                }
                                name="check_out_date"
                              />
                              {renderError("check_out_date")}
                            </div>
                          </div>
                        </div>

                        {/* booking info */}
                        <div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* platform */}
                            <div>
                              <Label
                                htmlFor="platform"
                                className="text-[14px] font-medium mb-2 block"
                                style={{ color: COLOR_EBONY }}
                              >
                                Platform
                              </Label>

                              <Select
                                value={values.platform}
                                onValueChange={(val) =>
                                  setFieldValue("platform", val)
                                }
                              >
                                <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md text-sm">
                                  <SelectValue placeholder="Select Booking Platform" />
                                </SelectTrigger>

                                <SelectContent className="bg-white">
                                  {BOOKING_TYPE_OPTIONS.map((item, index) => (
                                    <SelectItem
                                      key={index}
                                      value={item.value}
                                      className="data-[highlighted]:bg-gray-100 cursor-pointer"
                                    >
                                      {item.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              {renderError("platform")}
                            </div>
                            {/* reservation ID */}
                            <div>
                              <Label
                                htmlFor="platform_reservation_id"
                                className="text-[14px] font-medium mb-2 block"
                                style={{ color: COLOR_EBONY }}
                              >
                                Platform reservation ID (optional)
                              </Label>
                              <Input
                                id="platform_reservation_id"
                                placeholder="Enter ID"
                                name="platform_reservation_id"
                                type="text"
                                value={values.platform_reservation_id}
                                onChange={handleChange}
                                className="p-3 border-gray-300"
                              />

                              {renderError("platform_reservation_id")}
                            </div>
                          </div>
                          {/* due */}
                          <div>
                            <Label
                              htmlFor="due_at_property"
                              className="text-[14px] font-medium mb-2 block"
                              style={{ color: COLOR_EBONY }}
                            >
                              Due at Property
                            </Label>
                            <Input
                              id="due_at_property"
                              placeholder="Payment due "
                              name="due_at_property"
                              type="text"
                              value={values.due_at_property}
                              onChange={handleChange}
                              className="p-3 border-gray-300 w-full md:max-w-[49%] h-10"
                            />

                            {renderError("due_at_property")}
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                            <div
                              className="text-[14px] font-medium uppercase tracking-wide mb-1"
                              style={{ color: COLOR_OXFORD_BLUE }}
                            >
                              Length of Stay
                            </div>
                            <div
                              className="text-sm font-semibold"
                              style={{ color: COLOR_EBONY }}
                            >
                              {lengthOfStay} night
                              {lengthOfStay !== 1 ? "s" : ""}
                            </div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                            <div
                              className="text-[14px] font-medium uppercase tracking-wide mb-1"
                              style={{ color: COLOR_OXFORD_BLUE }}
                            >
                              Base Price per Night
                            </div>
                            <div
                              className="text-sm font-semibold "
                              style={{ color: COLOR_EBONY }}
                            >
                              <div className="relative flex items-center">
                                <PiCurrencyEurBold className="absolute left-2 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
                                <Input
                                  type="number"
                                  value={values.base_price ?? ""}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "base_price",
                                      Number(e.target.value),
                                    )
                                  }
                                  className="pl-6 max-w-40 font-semibold 
               focus:outline-none focus:ring-0 border shadow-none
               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  style={{ borderColor: COLOR_LIGHT_SILVER }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Special Requests */}
                        <div>
                          <Label
                            htmlFor="special_requests"
                            className="text-[14px] font-medium mb-2 block"
                            style={{ color: COLOR_EBONY }}
                          >
                            Special Requests
                          </Label>
                          <textarea
                            id="special_requests"
                            name="special_requests"
                            value={values.special_requests ?? ""}
                            onChange={handleChange}
                            placeholder="Any special requests or notes for this booking..."
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-vertical min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About the Guest */}
                  <div
                    className="bg-white border rounded-xl overflow-hidden"
                    style={{ borderColor: COLOR_LIGHT_SILVER }}
                  >
                    <div className="p-6 pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <User
                          className="w-5 h-5"
                          style={{ color: COLOR_EBONY }}
                        />
                        <h2
                          className="text-[16px] font-bold"
                          style={{ color: COLOR_EBONY }}
                        >
                          About the Guest
                        </h2>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: COLOR_OXFORD_BLUE }}
                      >
                        Guest information and contact details
                      </p>
                    </div>

                    <div className="p-6">
                      {/* Guest Info Display */}
                      <div className="flex items-center p-4 bg-slate-50 rounded-lg mb-6">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                          {getInitials(values.guests[0].full_name)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {values.guests[0].full_name}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: COLOR_OXFORD_BLUE }}
                          >
                            Primary Guest
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Guest Name */}
                        <div>
                          <Label
                            htmlFor="guests[0].full_name"
                            className="text-[14px] font-medium mb-2 block"
                            style={{ color: COLOR_EBONY }}
                          >
                            Guest Name
                          </Label>
                          <Input
                            id="guests[0].full_name"
                            placeholder="Enter name"
                            name="guests[0].full_name"
                            type="text"
                            value={values.guests[0].full_name}
                            onChange={handleChange}
                            className="p-3 border-gray-300"
                          />
                          {renderError("guests[0].full_name")}
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="guests[0].email"
                              className="text-[14px] font-medium mb-2 block"
                              style={{ color: COLOR_EBONY }}
                            >
                              Guest Email
                            </Label>
                            <Input
                              id="guests[0].email"
                              placeholder="Enter email"
                              name="guests[0].email"
                              type="email"
                              value={values.guests[0].email ?? ""}
                              onChange={handleChange}
                              className="p-3 border-gray-300"
                              style={{ height: "40px" }}
                            />
                            {renderError("guests[0].email")}
                          </div>
                          <div>
                            <Label
                              htmlFor="guests[0].phone"
                              className="text-[14px] font-medium mb-2 block"
                              style={{ color: COLOR_EBONY }}
                            >
                              Guest Phone Number
                            </Label>
                            <Input
                              id="guests[0].phone"
                              placeholder="Enter phone number"
                              name="guests[0].phone"
                              type="tel"
                              value={values.guests[0].phone ?? ""}
                              onChange={handleChange}
                              className="p-3 border-gray-300"
                              style={{ height: "40px" }}
                            />
                            {renderError("guests[0].phone")}
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-4">
                          <CountrySelect
                            label="Nationality"
                            name="guests[0].nationality"
                            value={values.guests[0].nationality ?? ""}
                            setFieldValue={setFieldValue}
                            renderError={renderError}
                            width="100%"
                            height="40px"
                          />
                          <div>
                            <Label
                              htmlFor="guests[0].id_number"
                              className="text-[14px] font-medium mb-2 block"
                              style={{ color: COLOR_EBONY }}
                            >
                              ID/Passport Number
                            </Label>
                            <Input
                              id="guests[0].id_number"
                              name="guests[0].id_number"
                              type="text"
                              value={values.guests[0].id_number ?? ""}
                              onChange={handleChange}
                              placeholder="Optional"
                              className="p-3 border-gray-300"
                              style={{ height: "40px" }}
                            />
                            {renderError("guests[0].id_number")}
                          </div>
                        </div>

                        {/* Guest Notes */}
                        <div>
                          <Label
                            htmlFor="guests[0].guest_notes"
                            className="text-[14px] font-medium mb-2 block"
                            style={{ color: COLOR_EBONY }}
                          >
                            Guest Notes
                          </Label>
                          <textarea
                            id="guests[0].guest_notes"
                            name="guests[0].guest_notes"
                            value={values.guests[0].guest_notes ?? ""}
                            onChange={handleChange}
                            placeholder="Any additional notes about the guest..."
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-vertical min-h-[100px]"
                          />
                          {renderError("guests[0].guest_notes")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div
                    className="bg-white border rounded-xl overflow-hidden"
                    style={{ borderColor: COLOR_LIGHT_SILVER }}
                  >
                    <div className="p-4 sm:p-6 pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar
                          className="w-5 h-5"
                          style={{ color: COLOR_EBONY }}
                        />
                        <h2
                          className="text-lg sm:text-xl font-semibold"
                          style={{ color: COLOR_EBONY }}
                        >
                          Booking Summary
                        </h2>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="space-y-3">
                        {/* Summary rows */}
                        {[
                          {
                            label: "Room",
                            value: values.property
                              ? filteredRooms.find(
                                (r: PropertyPayload) =>
                                  r.id === values.property,
                              )?.name
                              : "No Room",
                          },
                          {
                            label: "Guests",
                            value: `${values.adults_count} Adults, ${values.children_count} Children`,
                          },
                          {
                            label: "Check-in",
                            value: formatDate(values.check_in_date) || "-",
                          },
                          {
                            label: "Check-out",
                            value: formatDate(values.check_out_date) || "-",
                          },
                          {
                            label: "Length of Stay",
                            value: `${lengthOfStay} nights`,
                          },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100"
                          >
                            <span
                              className="text-sm"
                              style={{ color: COLOR_OXFORD_BLUE }}
                            >
                              {item.label}
                            </span>
                            <span
                              className="font-medium"
                              style={{ color: COLOR_EBONY }}
                            >
                              {item.value}
                            </span>
                          </div>
                        ))}

                        {/* Cleaning Fee */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-2">
                          <span
                            className="text-sm truncate"
                            style={{ color: COLOR_OXFORD_BLUE }}
                          >
                            Cleaning Fee
                          </span>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                              €
                            </span>
                            <Input
                              type="number"
                              name="cleaning_fee"
                              style={{
                                borderColor: COLOR_LIGHT_SILVER,
                                color: COLOR_EBONY,
                              }}
                              value={values.cleaning_fee ?? ""}
                              onChange={(e) =>
                                setFieldValue(
                                  "cleaning_fee",
                                  Number(e.target.value),
                                )
                              }
                              onBlur={handleBlur}
                              className="w-full sm:w-28 md:w-32 text-right font-medium 
            focus:outline-none focus:ring-0 border shadow-none rounded-md px-2 py-1
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                        </div>

                        {/* Other Extra Fees */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-2">
                          <span
                            className="text-sm truncate"
                            style={{ color: COLOR_OXFORD_BLUE }}
                          >
                            Other Extra Fees
                          </span>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                              €
                            </span>
                            <Input
                              type="number"
                              name="other_extra_fees"
                              style={{
                                borderColor: COLOR_LIGHT_SILVER,
                                color: COLOR_EBONY,
                              }}
                              value={values.other_extra_fees ?? ""}
                              onChange={(e) =>
                                setFieldValue(
                                  "other_extra_fees",
                                  Number(e.target.value),
                                )
                              }
                              className="w-full sm:w-28 md:w-32 text-right font-medium 
            focus:outline-none focus:ring-0 border shadow-none rounded-md px-2 py-1
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                          </div>
                        </div>

                        {/* Totals */}
                        <div className="border-t-2 border-gray-200 pt-4 mt-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-2">
                            <div className="flex flex-col">
                              <span
                                className="text-sm sm:text-base break-words flex-1"
                                style={{ color: COLOR_EBONY }}
                              >
                                Subtotal
                              </span>
                              <span className="text-gray-600 text-xs">
                                ({lengthOfStay} nights ×{" "}
                                {Number(values.base_price) > 0 &&
                                  `€${values.base_price}`}{" "}
                                {Number(values.cleaning_fee) > 0 &&
                                  `+ €${values.cleaning_fee}`}{" "}
                                {Number(values.other_extra_fees) > 0 &&
                                  `+ €${values.other_extra_fees}`}
                                )
                              </span>
                            </div>
                            <span
                              className="relative font-medium text-right whitespace-nowrap"
                              style={{ color: COLOR_EBONY }}
                            >
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                                €
                              </span>
                              <Input
                                type="number"
                                className="text-right sm:w-32 w-full focus:outline-none focus:ring-0 border shadow-none
               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                style={{ borderColor: COLOR_LIGHT_SILVER }}
                                name="subtotal"
                                value={values.subtotal ?? ""}
                                onBlur={handleBlur}
                                onChange={handleChange}
                              />
                            </span>
                          </div>

                          {/* City Tax */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-2">
                            <span
                              className="text-sm truncate"
                              style={{ color: COLOR_OXFORD_BLUE }}
                            >
                              City Tax
                            </span>
                            <span
                              className="relative font-medium text-right whitespace-nowrap"
                              style={{ color: COLOR_EBONY }}
                            >
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                                €
                              </span>
                              <Input
                                type="number"
                                className="text-right sm:w-32 w-full focus:outline-none focus:ring-0 border shadow-none
               [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                style={{
                                  borderColor: COLOR_LIGHT_SILVER,
                                  color: COLOR_EBONY,
                                }}
                                name="city_tax"
                                value={values.city_tax ?? ""}
                                onChange={handleChange}
                              />
                            </span>
                          </div>

                          {/* Total Price */}
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-t-2 border-gray-200 mt-2">
                            <span
                              className="font-semibold text-lg"
                              style={{ color: COLOR_EBONY }}
                            >
                              Total Price
                            </span>
                            <span
                              className="font-semibold text-lg"
                              style={{ color: COLOR_EBONY }}
                            >
                              €{values.total_price}.00
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div
                    className="bg-white border rounded-xl overflow-hidden"
                    style={{ borderColor: COLOR_LIGHT_SILVER }}
                  >
                    <div className="p-6 pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <PiCurrencyEurBold
                          className="w-5 h-5 "
                          style={{ color: COLOR_EBONY }}
                        />
                        <h2
                          className="text-xl font-semibold "
                          style={{ color: COLOR_EBONY }}
                        >
                          Payment Details
                        </h2>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="payment_method"
                            className="text-sm font-medium mb-2 block"
                            style={{ color: COLOR_EBONY }}
                          >
                            Payment Method
                          </Label>
                          <Select
                            value={values.payment_method}
                            onValueChange={(val) =>
                              setFieldValue("payment_method", val)
                            }
                          >
                            <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md text-sm">
                              <SelectValue placeholder="Payment Method" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem
                                value="cash"
                                className="data-[highlighted]:bg-gray-100 cursor-pointer"
                              >
                                Cash on Arrival
                              </SelectItem>
                              <SelectItem
                                value="credit_card"
                                className="data-[highlighted]:bg-gray-100 cursor-pointer"
                              >
                                Credit Card
                              </SelectItem>
                              <SelectItem
                                value="bank_transfer"
                                className="data-[highlighted]:bg-gray-100 cursor-pointer"
                              >
                                Bank Transfer
                              </SelectItem>
                              <SelectItem
                                value="online"
                                className="data-[highlighted]:bg-gray-100 cursor-pointer"
                              >
                                Online Payment
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {renderError("payment_method")}
                        </div>

                        <div>
                          <Label
                            htmlFor="payment_status"
                            className="text-sm font-medium mb-2 block"
                            style={{ color: COLOR_EBONY }}
                          >
                            Payment Status
                          </Label>
                          <Select
                            value={values.payment_status}
                            onValueChange={(val) =>
                              setFieldValue("payment_status", val)
                            }
                          >
                            <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md text-sm">
                              <SelectValue placeholder="Payment Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem
                                value="pending"
                                className="data-[highlighted]:bg-gray-100 cursor-pointer"
                              >
                                Pending
                              </SelectItem>
                              <SelectItem
                                value="partially_paid"
                                className="data-[highlighted]:bg-gray-100 cursor-pointer"
                              >
                                Partially Paid
                              </SelectItem>
                              <SelectItem
                                value="fully_paid"
                                className="data-[highlighted]:bg-gray-100 cursor-pointer"
                              >
                                Fully Paid
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {renderError("payment_status")}
                        </div>

                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${values.payment_status == "pending" ? "bg-red-100" : values.payment_status == "partially_paid" ? "bg-yellow-100" : "bg-green-100"}`}
                          style={{
                            color: getPaymentStatuscolor(values.payment_status),
                          }}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          {values.payment_status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid md:grid-cols-2 gap-5 items-center rounded-xl">
                    <Button
                      type="submit"
                      className="btn rounded-md text-white"
                      disabled={
                        isSubmitting ||
                        createBookingMutation.isPending ||
                        !isValid
                      }
                    >
                      {loading || createBookingMutation.isPending
                        ? "Creating..."
                        : "Create Booking"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="border border-gray-300 text-gray-700 font-semibold px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4" />
                      Save as Draft
                    </Button>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
