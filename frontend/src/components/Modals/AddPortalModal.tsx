// AddPortalModal.tsx
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { PORTALS } from "@/constants/constants";
import AirbnbPortal from "@/pages/Portals/Airbnb";
import BookingsPortal from "@/pages/Portals/Bookings.com";
import ExpediaPortal from "@/pages/Portals/Expedia";
import { addPortalSchema } from "@/schemas/addPortal";
import { handleEnterSubmit } from "@/utils/helper";
import { Label } from "@radix-ui/react-label";
import { IconX } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useState } from "react";
import { TbDeviceFloppy } from "react-icons/tb";
import { Button } from "../ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";

export function AddPortalModal({
  open,
  onOpenChange,
  portalName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portalName?: string;
}) {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    handleChange,
    resetForm,
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
  } = useFormik({
    initialValues: {
      portalName: portalName ? portalName.toLowerCase() : "",
    },
    validationSchema: addPortalSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setLoading(true);

      // Simulate an API call
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`overflow-auto max-h-[90vh] ${
          values.portalName ? "sm:max-w-[669px]" : "sm:max-w-[500px]"
        }`}
      >
        <form onSubmit={handleSubmit}>
          {values.portalName ? (
            <>{null}</>
          ) : (
            <>
              <div className="flex flex-col gap-2 ">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[20px] text-black font-semibold">
                    Add Portal
                  </h2>
                  <IconX
                    color="red"
                    className="cursor-pointer hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      resetForm();
                      onOpenChange(false);
                    }}
                  />
                </div>

                <Label
                  htmlFor="portalName"
                  className="text-[14px] text-gray-700"
                >
                  Select New Portal
                </Label>

                <Select
                  value={values.portalName}
                  onValueChange={(value) =>
                    handleChange({
                      target: { name: "portalName", value },
                    } as React.ChangeEvent<HTMLSelectElement>)
                  }
                >
                  <SelectTrigger
                    id="portalName"
                    className="text-gray-500 w-full sm:w-[290px] lg:w-[290px] md:w-[290px] h-[38px] border rounded py-1.5 text-[14px] border-gray-500"
                    onKeyDown={(e) => {
                      handleEnterSubmit(e, isValid, handleSubmit);
                    }}
                  >
                    <SelectValue placeholder="Portal Name" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {PORTALS.map((portal) => (
                      <SelectItem
                        key={portal}
                        className="data-[highlighted]:bg-gray-100 cursor-pointer"
                        value={portal}
                      >
                        {portal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {touched.portalName && errors.portalName && (
                  <span className="text-start text-red-500 text-sm">
                    {errors.portalName}
                  </span>
                )}
              </div>
            </>
          )}

          {values.portalName.toLowerCase() === "booking.com" && (
            <BookingsPortal resetForm={resetForm} onOpenChange={onOpenChange} />
          )}
          {values.portalName.toLowerCase() === "airbnb" && (
            <AirbnbPortal resetForm={resetForm} onOpenChange={onOpenChange} />
          )}
          {values.portalName.toLowerCase() === "expedia" && (
            <ExpediaPortal resetForm={resetForm} onOpenChange={onOpenChange} />
          )}

          <div className="flex gap-4 justify-end mt-7 mb-3">
            <Button
              type="submit"
              className="text-[14px] btn w-full sm:w-fit"
              disabled={isSubmitting || !isValid}
            >
              <TbDeviceFloppy className="mr-2" />
              {isSubmitting || loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
