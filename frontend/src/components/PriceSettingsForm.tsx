import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { COLOR_LIGHT_GRAY, COLOR_VIOLET } from "@/constants/constants";
import { PriceSettingsSchema } from "@/schemas/priceSettings";
import { handleEnterSubmit } from "@/utils/helper";
import { useFormik } from "formik";
import { useState } from "react";
import { TbDeviceFloppy } from "react-icons/tb";

const PriceSettingsForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    isSubmitting,
    errors,
    isValid,
  } = useFormik({
    initialValues: {
      booking: 0,
      airbnb: 0,
      expedia: 0,
    },
    validationSchema: PriceSettingsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setLoading(true);
    },
  });
  const renderError = (field: keyof typeof errors) =>
    errors[field] ? (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        {errors[field]}
      </span>
    ) : (
      <span className="text-start text-red-500 text-[12px] min-h-6">
        &nbsp;
      </span>
    );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <p className="text-black font-normal text-[17px]">
          % increase from base price for each of the platforms
        </p>

        <div className="flex flex-col gap-3 mt-5 sm:flex-row sm:gap-5 sm:justify-between">
          {/* Booking */}
          <div className="w-full sm:w-1/3">
            <Label
              htmlFor="booking"
              className="text-[14px] font-medium"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Booking
            </Label>
            <Input
              className="text-black text-[17px] h-[40px] border-gray-300"
              id="booking"
              name="booking"
              type="number"
              placeholder="25"
              value={values.booking}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleEnterSubmit(e, isValid, handleSubmit)}
            />
            {renderError("booking")}
          </div>

          {/* Airbnb */}
          <div className="w-full sm:w-1/3">
            <Label
              htmlFor="airbnb"
              className="text-[14px] font-medium"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Airbnb
            </Label>
            <Input
              className="text-black text-[17px] h-[40px] border-gray-300"
              id="airbnb"
              name="airbnb"
              type="number"
              placeholder="10"
              value={values.airbnb}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleEnterSubmit(e, isValid, handleSubmit)}
            />
            {renderError("airbnb")}
          </div>

          {/* Expedia */}
          <div className="w-full sm:w-1/3">
            <Label
              htmlFor="expedia"
              className="font-medium text-[14px]"
              style={{ color: COLOR_LIGHT_GRAY }}
            >
              Expedia
            </Label>
            <Input
              className="text-black text-[17px] h-[40px] border-gray-300"
              id="expedia"
              name="expedia"
              type="number"
              placeholder="10"
              value={values.expedia}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={(e) => handleEnterSubmit(e, isValid, handleSubmit)}
            />
            {renderError("expedia")}
          </div>
        </div>

        {/* Submit button */}
        <div className="flex gap-4 justify-end mt-7 mb-3">
          <Button
            type="submit"
            className="text-[14px] w-full md:w-fit" 
            style={{ backgroundColor: COLOR_VIOLET }}
            disabled={isSubmitting || !isValid}
          >
            <TbDeviceFloppy className="mr-2" />
            {isSubmitting || loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default PriceSettingsForm;
