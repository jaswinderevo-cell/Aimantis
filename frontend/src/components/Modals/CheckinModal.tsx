import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { COLOR_LIGHT_BLUE, COLOR_LIGHT_GRAY } from "@/constants/constants";
import { useGetSingleBooking } from "@/services/bookings";
import {
  BookingGuestsPayload,
  GuestPayload,
  useCheckinUsers,
  useGetBookingUsers,
} from "@/services/bookingUsers";
import {
  CheckinField,
  CheckinFieldValueByType,
  CheckinFormField,
  useGetCheckinTemplateByBookingUid,
  useSubmitCheckinForm,
} from "@/services/onlineCheckinForm";
import CountrySelect from "@/utils/countryDropdown";
import { useFormStatus } from "@/utils/disableFormHook";

import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { useEffect } from "react";
import {
  TbDeviceFloppy,
  TbId,
  TbMapPin,
  TbTrash,
  TbUsers,
} from "react-icons/tb";

import { DatePicker } from "../DatePicker";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { normalizeAmenities } from "@/utils/helper";

type CheckinFieldValue = CheckinFieldValueByType[keyof CheckinFieldValueByType];

type GuestInitialValues = Record<CheckinField["slug"], CheckinFieldValue>;

interface CheckinModalProps {
  open: boolean;
  onCancel?: () => void;
  onOpenChange: (open: boolean) => void;
  id: number | null;
}

// component
const CheckinModal = ({ open, onOpenChange, id }: CheckinModalProps) => {
  //get booking user's data
  const { data: bookingUsersResponse } = useGetBookingUsers(Number(id));
  const bookingsUsersData = bookingUsersResponse?.data || [];

  const checkInMutation = useCheckinUsers();

  //get booking data
  const { data: bookingData } = useGetSingleBooking(id);
  const bookingUid = bookingData?.uid;

  //get checkin form by booking Uid
  const { data: checkinTemplate } =
    useGetCheckinTemplateByBookingUid(bookingUid);

  //submit the public checkin form API
  const submitPublicCheckinMutation = useSubmitCheckinForm();

  // Check if checkin template exists
  const hasCheckinTemplate = !!checkinTemplate?.template?.id;
  const formDescription = checkinTemplate?.template?.description || "";

  const mainGuestFields: CheckinFormField[] =
    checkinTemplate?.sections?.main_guest ?? [];

  const additionalGuestFields: CheckinFormField[] =
    checkinTemplate?.sections?.additional_guest ?? [];

  //Split full name into first and last name
  const splitFullName = (fullName?: string) => {
    if (!fullName) return { first_name: "", last_name: "" };

    const parts = fullName.trim().split(/\s+/);
    return {
      first_name: parts[0] ?? "",
      last_name: parts.slice(1).join(" ") ?? "",
    };
  };

  //concatinate first & last name
  const buildFullName = (first?: string, last?: string) =>
    [first, last].filter(Boolean).join(" ").trim();

  //build empty initial values from dynamic fields
  const buildGuestInitialValues = (
    fields: readonly CheckinField[],
  ): GuestInitialValues =>
    fields.reduce<GuestInitialValues>((acc, field) => {
      acc[field.slug] = field.type === "file" ? null : "";
      return acc;
    }, {} as GuestInitialValues);

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    setFieldTouched,
    values,
    errors,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,

    initialValues: {
      booking_id: id ? Number(id) : null,

      guests:
        bookingsUsersData.length > 0
          ? bookingsUsersData.map((guest: GuestPayload, index: number) => {
            const { first_name, last_name } = splitFullName(guest.full_name);

            return {
              ...buildGuestInitialValues(
                index === 0 ? mainGuestFields : additionalGuestFields,
              ),
              ...guest,
              first_name,
              last_name,
              is_main_guest: index === 0,
            };
          })
          : [
            {
              ...buildGuestInitialValues(mainGuestFields),
              is_main_guest: true,
            },
          ],
    },

    onSubmit: async (values, { setSubmitting }) => {
      const payload: BookingGuestsPayload = {
        booking_id: values.booking_id,
        guests: values.guests.map((guest: GuestPayload, index: number) => ({
          ...guest,
          is_main_guest: index === 0,
        })),
      };

      submitPublicCheckinMutation.mutate(bookingUid, {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
          setSubmitting(false);
        },
      });
    },
  });

  // Guest Actions
  const addNewGuest = () => {
    setFieldValue("guests", [
      ...values.guests,
      {
        id: null,
        booking_id: id ?? 0,
        full_name: "",
        first_name: "",
        last_name: "",
        is_main_guest: false,
      },
    ]);
  };

  const removeGuest = (index: number) => {
    if (values.guests.length === 1) return;
    setFieldValue(
      "guests",
      values.guests.filter((_: GuestPayload, i: number) => i !== index),
    );
  };

  // Renderer Dynamic Fields
  const renderGuestField = (field: CheckinFormField, guestIndex: number) => {
    const name = `guests[${guestIndex}].${field.slug}`;
    const value = values.guests[guestIndex]?.[field.slug];

    let input: React.ReactNode = null;

    // First Name
    if (field.slug === "first_name") {
      input = (
        <Input
          id={name}
          style={{ borderColor: COLOR_LIGHT_GRAY }}
          name={name}
          value={value ?? ""}
          onChange={(e) => {
            const first = e.target.value;
            const last = values.guests[guestIndex]?.last_name ?? "";

            setFieldValue(name, first);
            setFieldValue(
              `guests[${guestIndex}].full_name`,
              buildFullName(first, last),
            );
          }}
        />
      );
    }

    // Last Name
    else if (field.slug === "last_name") {
      input = (
        <Input
          id={name}
          style={{ borderColor: COLOR_LIGHT_GRAY }}
          name={name}
          value={value ?? ""}
          onChange={(e) => {
            const last = e.target.value;
            const first = values.guests[guestIndex]?.first_name ?? "";

            setFieldValue(name, last);
            setFieldValue(
              `guests[${guestIndex}].full_name`,
              buildFullName(first, last),
            );
          }}
        />
      );
    }

    // Other fields
    else {
      switch (field.type) {
      case "text":
        input = (
          <Input
            id={name}
            style={{ borderColor: COLOR_LIGHT_GRAY }}
            name={name}
            value={value ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        );
        break;

      case "number":
        input = (
          <Input
            id={name}
            type="number"
            name={name}
            value={value ?? ""}
            onChange={handleChange}
          />
        );
        break;

      case "date":
        input = (
          <DatePicker
            borderColor={COLOR_LIGHT_GRAY}
            value={value}
            onChange={(v) => {
              setFieldValue(name, v);
              setFieldTouched(name, true, false);
            }}
          />
        );
        break;

      case "select":
        // Gender
        if (field.slug === "gender") {
          input = (
            <div className="flex items-center gap-6">
              {field?.choices?.map((choice, choiceIndex) => (
                <label
                  key={`${name}-${choice}-${choiceIndex}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={name}
                    value={choice}
                    checked={value === choice}
                    onChange={() => setFieldValue(name, choice)}
                    className="h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{choice}</span>
                </label>
              ))}
            </div>
          );
        } else {
          // Default select dropdown
          input = (
            <Select
              value={value ?? ""}
              onValueChange={(v) => setFieldValue(name, v)}
            >
              <SelectTrigger
                id={name}
                className="w-full h-10"
                style={{ borderColor: COLOR_LIGHT_GRAY }}
              >
                <SelectValue placeholder={`Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {normalizeAmenities(field?.choices).map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        break;

      case "country":
        input = (
          <CountrySelect
            label=""
            borderColor={COLOR_LIGHT_GRAY}
            name={name}
            value={value ?? ""}
            setFieldValue={setFieldValue}
            renderError={renderError}
          />
        );
        break;

      default:
        input = null;
      }
    }

    if (!input) return null;

    return (
      <div key={`field-${guestIndex}-${field.slug}`} className="space-y-1">
        <Label htmlFor={name} className="text-sm font-medium text-gray-700">
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </Label>

        {input}

        {renderError(name)}
      </div>
    );
  };

  // Error Renderer
  const renderError = (field: string) => {
    const error = getIn(errors, field);
    return typeof error === "string" ? (
      <span className="text-red-500 text-xs">{error}</span>
    ) : null;
  };

  // Effects
  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: checkInMutation.isPending,
  });

  // UI
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
        <div
          className="flex justify-between items-center pb-4 border-b"
          style={{ borderColor: COLOR_LIGHT_BLUE }}
        >
          <h2 className="text-xl font-semibold text-black">Check in Form</h2>
          <IconX
            className="cursor-pointer hover:bg-gray-100 rounded-md text-red-500"
            size={24}
            onClick={() => onOpenChange(false)}
          />
        </div>

        <div className="flex-1 overflow-auto">
          {hasCheckinTemplate ? (
            <form onSubmit={handleSubmit} className="space-y-6 p-1">
              <fieldset disabled={isFormDisabled}>
                {/* Guests Section */}
                <div className="space-y-4">
                  {values.guests.map((guest: GuestPayload, index: number) => (
                    <div key={`guest-${guest.id || index}`} className="">
                      {/* Guest Header */}
                      <div className="flex items-center justify-between p-4 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-black  flex items-center gap-2 md:text-xl font-semibold">
                            <TbId size={22} />
                            {index === 0
                              ? "Main Guest Details"
                              : `Guest #${index + 1}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {index !== 0 && (
                            <button
                              type="button"
                              onClick={() => removeGuest(index)}
                              className="text-red-500 font-medium hover:bg-gray-100 p-1 rounded-md"
                            >
                              <TbTrash size={22} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Guest Fields */}
                      <div className="p-4 space-y-4 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(index === 0
                            ? mainGuestFields
                            : additionalGuestFields
                          ).map((field) => renderGuestField(field, index))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* add new guest button */}
                  <div className="flex md:justify-end">
                    <Button
                      type="button"
                      onClick={addNewGuest}
                      className="flex w-full justify-center sm:w-fit items-center text-[15px] gap-2 px-4 py-2 btn text-white rounded-md"
                    >
                      <TbUsers size={20} />
                      Add new guest
                    </Button>
                  </div>

                  {/* description */}
                  <div className="p-4">
                    <h3 className="text-black md:text-xl font-semibold">
                      Description
                    </h3>
                    <div className="p-4 space-y-4 bg-white">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                          <Label
                            htmlFor={`booking-description`}
                            className="text-sm font-medium text-gray-700"
                          >
                            Description
                          </Label>
                          <Textarea
                            value={formDescription || ""}
                            name={`description`}
                            onChange={handleChange}
                            placeholder="Enter description"
                            className="h-20 border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* save button */}
                <div className="flex gap-4 justify-end my-5">
                  <Button
                    type="submit"
                    className="btn w-full sm:w-fit text-[14px]"
                    disabled={checkInMutation.isPending || !hasCheckinTemplate}
                  >
                    <TbDeviceFloppy className="mr-2" />
                    {checkInMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </fieldset>
            </form>
          ) : (
            <div className="p-6 text-center">
              <div className="text-gray-500 text-lg mb-4">
                No check-in form is linked to this structure
              </div>
              <p className="text-gray-600">
                Please link a check-in form to the structure to enable guest
                check-in functionality.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckinModal;
