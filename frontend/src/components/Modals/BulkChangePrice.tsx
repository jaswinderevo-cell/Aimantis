import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  COLOR_LIGHT_GRAY,
  COLOR_VIOLET,
  DAYS_OPTIONS,
  ROOMS_OPTIONS,
} from "@/constants/constants";
import { BulkChangePriceSchema } from "@/schemas/bulkPriceChanges";
import {
  PropertyRatePayload,
  usePostPropertyRates,
} from "@/services/ratesCalendar";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { IconX } from "@tabler/icons-react";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { TbCoins, TbDeviceFloppy } from "react-icons/tb";
import { DatePicker } from "../DatePicker";
import MultiSelectDropdown from "../MultiSelectDropdown";
import NumberCounter from "../NumberInput";
import { Button } from "../ui/Button";
import { useFormStatus } from "@/utils/disableFormHook";

export function BulkChangePrice({
  selectedStructureId,
  open,
  onOpenChange,
}: {
  selectedStructureId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  //get all rooms
  const getRooms = useGetAllRooms();

  //filtering the rooms
  const filterRoomsBySelectedStructure = getRooms?.data?.filter(
    (room: PropertyPayload) => room.structure === selectedStructureId,
  );

  const roomOptions =
    filterRoomsBySelectedStructure?.map((room: PropertyPayload) => ({
      label: room.name,
      value: room.id,
    })) ?? [];

  // bulk price mutation
  const bulkPriceUpdate = usePostPropertyRates();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    setFieldTouched,
    touched,
    values,
    errors,
    isSubmitting,
    isValid,
  } = useFormik<PropertyRatePayload>({
    initialValues: {
      properties: [],
      start_date: "",
      end_date: "",
      base_price: "",
      min_nights: 1,
      weekdays: [],
      booking_pct: "",
      airbnb_pct: "",
      experia_pct: "",
    },
    validationSchema: BulkChangePriceSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setLoading(true);
      bulkPriceUpdate.mutateAsync(values);
      resetForm();
      onOpenChange(false);
    },
  });

  const renderError = (field: keyof typeof errors) =>
    touched[field] && errors[field] ? (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        {errors[field]}
      </span>
    ) : (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        &nbsp;
      </span>
    );

  const [showIndividualAccomodation, setShowIndividualAccomodation] =
    useState(true);

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: bulkPriceUpdate.isPending,
  });

  //reset
  useEffect(() => {
    if (!open) {
      resetForm();
      setLoading(false);
    }
  }, [open, resetForm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] md:max-w-[779px] max-h-[90vh] overflow-auto">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="md:text-[20px] text-black font-semibold">
              Bulk Price Changes Settings
            </h2>
            <button
              type="button"
              className="cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => onOpenChange(false)}
            >
              <IconX color="red" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={isFormDisabled}>
              {/* Price Settings */}
              <div className="flex items-center gap-1 my-9">
                <TbCoins className="text-black" size={20} />
                <h2 className="text-sm md:text-[16px] text-black font-semibold">
                  Price Settings
                </h2>
              </div>

              <div className="flex flex-wrap items-center ">
                <div className="flex flex-col gap-2 w-full">
                  <Label
                    htmlFor="properties"
                    className="text-[14px] font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Room
                  </Label>
                  <MultiSelectDropdown
                    name="properties"
                    value={roomOptions.filter((opt: ROOMS_OPTIONS) =>
                      values.properties.includes(opt.value),
                    )}
                    onChange={(selected) =>
                      setFieldValue(
                        "properties",
                        selected.map((opt) => opt.value),
                      )
                    }
                    onBlur={() => setFieldTouched("properties", true)}
                    options={roomOptions}
                    placeholder="Select Room(s)"
                  />
                  {renderError("properties")}
                </div>
              </div>

              {/* Date Range */}
              <div className="flex flex-col sm:flex-row items-center sm:gap-3">
                <div className="flex w-full flex-col gap-2">
                  <Label
                    htmlFor="start_date"
                    className="font-medium text-[14px]"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Start Date
                  </Label>
                  <DatePicker
                    value={values.start_date}
                    onBlur={() => handleBlur("start_date")}
                    onChange={(val) => setFieldValue("start_date", val)}
                    name="start_date"
                    mode="date"
                  />
                  {renderError("start_date")}
                </div>

                <div className="flex w-full flex-col gap-2">
                  <Label
                    htmlFor="end_date"
                    className="font-medium text-[14px]"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    End Date
                  </Label>
                  <DatePicker
                    value={values.end_date}
                    onBlur={() => handleBlur("end_date")}
                    onChange={(val) => setFieldValue("end_date", val)}
                    name="end_date"
                    mode="date"
                  />
                  {renderError("end_date")}
                </div>
              </div>

              {/* Base price & nights */}
              <div className="lg:flex-row md:flex-row flex flex-col gap-3 mt-5">
                <div className="flex flex-col gap-2 w-full">
                  <Label
                    htmlFor="base_price"
                    className="font-medium text-[14px]"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Base Price
                  </Label>
                  <Input
                    id="base_price"
                    name="base_price"
                    type="number"
                    placeholder="Enter base price"
                    className="text-black h-9 border-gray-300"
                    value={values.base_price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {renderError("base_price")}
                </div>

                <div className="flex flex-col gap-8 w-full">
                  <NumberCounter
                    name={values.min_nights > 1 ? "nights" : "night"}
                    label="Minimum Nights"
                    value={values.min_nights}
                    onChange={(val) => setFieldValue("min_nights", val)}
                    error={renderError("min_nights")}
                  />
                </div>
              </div>

              {/* Weekdays selector */}
              <div className="flex flex-col gap-2 mt-5">
                <Label
                  htmlFor="weekdays"
                  className="text-[14px] font-medium"
                  style={{ color: COLOR_LIGHT_GRAY }}
                >
                  Day Selector (optional)
                </Label>
                <MultiSelectDropdown
                  name="weekdays"
                  value={DAYS_OPTIONS.filter((opt) =>
                    values.weekdays.includes(opt.value),
                  )}
                  onChange={(val) =>
                    setFieldValue(
                      "weekdays",
                      val.map((opt) => opt.value),
                    )
                  }
                  options={DAYS_OPTIONS}
                  placeholder="Select weekdays"
                />
              </div>

              {/* Individual Accommodations */}
              <div
                onClick={() => setShowIndividualAccomodation((prev) => !prev)}
                className="flex justify-between mt-10 cursor-pointer items-center"
              >
                <div className="flex items-center gap-2">
                  <Tag className="text-black" size={22} />
                  <h2 className="text-black font-semibold md:text-[16px]">
                    Individual Accommodations
                  </h2>
                </div>
                {showIndividualAccomodation ? (
                  <ChevronUp className="text-black" size={23} />
                ) : (
                  <ChevronDown className="text-black" size={23} />
                )}
              </div>

              <AnimatePresence>
                {showIndividualAccomodation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mt-5"
                  >
                    <h2 className="text-sm md:text-[17px] text-black font-normal">
                      % increase from base price for each platform
                    </h2>

                    {/* Responsive Grid for Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                      {/* Booking */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="booking_pct"
                          style={{ color: COLOR_LIGHT_GRAY }}
                        >
                          Booking
                        </Label>
                        <Input
                          id="booking_pct"
                          name="booking_pct"
                          type="number"
                          value={values.booking_pct}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Booking.com"
                          className="text-black border-gray-300"
                        />
                        {renderError("booking_pct")}
                      </div>

                      {/* Airbnb */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="airbnb_pct"
                          style={{ color: COLOR_LIGHT_GRAY }}
                        >
                          Airbnb
                        </Label>
                        <Input
                          id="airbnb_pct"
                          name="airbnb_pct"
                          type="number"
                          value={values.airbnb_pct}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Airbnb"
                          className="text-black border-gray-300"
                        />
                        {renderError("airbnb_pct")}
                      </div>

                      {/* Expedia */}
                      <div className="flex flex-col gap-2">
                        <Label
                          htmlFor="experia_pct"
                          style={{ color: COLOR_LIGHT_GRAY }}
                        >
                          Expedia
                        </Label>
                        <Input
                          id="experia_pct"
                          name="experia_pct"
                          type="number"
                          value={values.experia_pct}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Expedia"
                          className="text-black border-gray-300"
                        />
                        {renderError("experia_pct")}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <div className="flex gap-4 justify-end mt-7 mb-3">
                <Button
                  type="submit"
                  className="text-[14px] w-full md:w-fit"
                  style={{ backgroundColor: COLOR_VIOLET }}
                  disabled={isSubmitting || !isValid || loading}
                >
                  <TbDeviceFloppy className="mr-2" />
                  {isSubmitting || loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </fieldset>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
