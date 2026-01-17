import { Loader } from "@/common/components/loader/Loader";
import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  COLOR_LIGHT_BLUE,
  COLOR_LIGHT_GRAY,
  COLOR_ROYAL_BLUE,
} from "@/constants/constants";
import { useGetBookingByUuid } from "@/services/bookings";
import {
  BookingGuestsPayload,
  GuestPayload,
  useCheckinUsers,
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
import { SelectValue } from "@radix-ui/react-select";
import { getIn, useFormik } from "formik";
import { useState } from "react";
import { AiOutlineSafety } from "react-icons/ai";
import { TbDeviceFloppy, TbId, TbTrash, TbUsers } from "react-icons/tb";
import { toast } from "sonner";

type SharedCheckinFormProps = {
  bookingUid: string;
  guestCheckinUrl?: string;
  mode: "guest" | "staff";
  onClose?: () => void;
};

type CheckinFieldValue = CheckinFieldValueByType[keyof CheckinFieldValueByType];
type GuestInitialValues = Record<CheckinField["slug"], CheckinFieldValue>;

export const SharedCheckinForm = ({
  bookingUid,
  mode,
  onClose,
  guestCheckinUrl,
}: SharedCheckinFormProps) => {
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  //get booking data
  const { data: bookingData } = useGetBookingByUuid(bookingUid);
  const bookingId = bookingData?.id;
  const bookingGuests = bookingData?.guests ?? [];
  console.log("bookingGuests: ", bookingGuests);

  const checkInMutation = useCheckinUsers();

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
  console.log("mainGuestFields: ", mainGuestFields);

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
      booking_id: bookingId ? Number(bookingId) : null,

      guests:
        bookingGuests.length > 0
          ? bookingGuests
            .sort(
              (a: GuestPayload, b: GuestPayload) =>
                Number(b.is_main_guest) - Number(a.is_main_guest),
            )
            .map((guest: GuestPayload, index: number) => {
              const { first_name, last_name } = splitFullName(
                guest.full_name,
              );

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
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const payload: BookingGuestsPayload = {
        booking_id: values.booking_id,
        guests: values.guests.map((guest: GuestPayload, index: number) => ({
          ...guest,
          is_main_guest: index === 0,
        })),
      };

      submitPublicCheckinMutation.mutate(
        {
          booking_uid: bookingUid,
          payload,
        },
        {
          onSuccess: () => {
            setSubmittedSuccessfully(true);
            setSubmitting(false);

            if (mode === "staff") {
              onClose?.();
            }
          },
          onError: () => {
            setSubmitting(false);
          },
        },
      );
    },
  });

  // Guest Actions
  const addNewGuest = () => {
    setFieldValue("guests", [
      ...values.guests,
      {
        id: null,
        booking_id: bookingId ?? 0,
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

              <SelectContent className="bg-white">
                {field?.choices?.map((choice, index) => (
                  <SelectItem
                    className="data-[highlighted]:bg-gray-100 cursor-pointer"
                    key={index}
                    value={choice}
                  >
                    {choice}
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
  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: checkInMutation.isPending,
  });

  //show loading
  if (!bookingData || !checkinTemplate) {
    return <Loader />;
  }

  // UI
  return (
    <div>
      <div className="bg-white rounded-[16px] p-8 shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div
          className="flex justify-between items-center pb-4 border-b"
          style={{ borderColor: COLOR_LIGHT_BLUE }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-semibold text-black">
              Finish your online check-in
            </h2>

            {!submittedSuccessfully && (
              <>
                <p className="text-gray-600 text-sm">
                  This takes about 2-3 minutes. We will use this information to
                  prepare your <br />
                  arrival and comply with local regulations.
                </p>

                <p className="flex gap-1 items-center mt-2">
                  <AiOutlineSafety className="text-green-600 h-5 w-5" />
                  Secure and encrypted
                </p>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto mt-4">
          {/* SUCCESS STATE */}
          {submittedSuccessfully && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div
                className="text-2xl font-semibold mb-3"
                style={{ color: COLOR_ROYAL_BLUE }}
              >
                Check-in completed
              </div>
              <p className="text-gray-600 max-w-md">
                Thank you! Your check-in details have been submitted
                successfully. We look forward to welcoming you.
              </p>
            </div>
          )}

          {/* FORM */}
          {!submittedSuccessfully && hasCheckinTemplate && (
            <form onSubmit={handleSubmit} className="space-y-6 p-1">
              <fieldset disabled={isFormDisabled}>
                {/* Guests */}
                <div className="space-y-4">
                  {values.guests.map((guest: GuestPayload, index: number) => (
                    <div key={`guest-${guest.id || index}`}>
                      <div className="flex items-center justify-between p-4">
                        <span className="text-black flex items-center gap-2 md:text-xl font-semibold">
                          <TbId size={22} />
                          {index === 0
                            ? "Main Guest Details"
                            : `Guest #${index + 1}`}
                        </span>

                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => removeGuest(index)}
                            className="text-red-500 hover:bg-gray-100 p-1 rounded-md"
                          >
                            <TbTrash size={22} />
                          </button>
                        )}
                      </div>

                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(index === 0
                            ? mainGuestFields
                            : additionalGuestFields
                          ).map((field) => renderGuestField(field, index))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add guest */}
                  <div className="flex md:justify-end">
                    <Button
                      type="button"
                      onClick={addNewGuest}
                      className="btn flex w-full sm:w-fit justify-center items-center gap-2"
                    >
                      <TbUsers size={20} />
                      Add new guest
                    </Button>
                  </div>

                  {/* submit button */}
                  {mode === "guest" && (
                    <Button
                      type="submit"
                      disabled={checkInMutation.isPending}
                      className="btn w-full sm:w-auto"
                    >
                      <TbDeviceFloppy className="mr-2" />
                      {checkInMutation.isPending ? "Saving..." : "Submit"}
                    </Button>
                  )}

                  {/* Description */}
                  {mode === "staff" && (
                    <div className="p-4">
                      <h3 className="text-black md:text-xl font-semibold">
                        Check-in notes
                      </h3>

                      <Textarea
                        readOnly
                        name="description"
                        placeholder="Internal notes"
                        className="h-20 border-gray-300 mt-2"
                      />
                    </div>
                  )}
                </div>

                {/* Copy url */}
                {mode === "staff" && (
                  <div className="flex flex-col sm:flex-row sm:justify-end my-5 gap-2">
                    <Button
                      type="button"
                      variant={"ghost"}
                      onClick={() => {
                        if (!guestCheckinUrl) return;
                        navigator.clipboard.writeText(guestCheckinUrl);
                        toast.message("Check-in URL copied!");
                      }}
                      className="w-full sm:w-auto text-white bg-gray-700 hover:bg-gray-600 hover:text-white"
                    >
                      Copy Check-in URL
                    </Button>
                  </div>
                )}
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
