import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  AMENITIES_OPTIONS,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_SILVER,
} from "@/constants/constants";
import { PropertyDetailSchema } from "@/schemas/propertyDetailSchema";
import {
  PropertyTypePayload,
  useGetPropertyTypeByStructure,
} from "@/services/propertyTypes";
import { PropertyPayload, useAddNewRoom } from "@/services/rooms";
import { handleEnterSubmit } from "@/utils/helper";
import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { useEffect } from "react";
import {
  TbBuildingCommunity,
  TbDeviceFloppy,
  TbListDetails,
} from "react-icons/tb";
import MultiSelectDropdown from "../MultiSelectDropdown";
import { Button } from "../ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { useFormStatus } from "@/utils/disableFormHook";

export function AddPropertylModal({
  selectedStructureId,
  selectedPropertyTypeId,
  open,
  onOpenChange,
  getPropertyTypesByStructure,
}: {
  selectedStructureId: number;
  selectedPropertyTypeId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getPropertyTypesByStructure: ReturnType<typeof useGetPropertyTypeByStructure>;
}) {
  //add property
  const addProperty = useAddNewRoom();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    isSubmitting,
    values,
    errors,
    isValid,
  } = useFormik<PropertyPayload>({
    enableReinitialize: true,
    initialValues: {
      name: "",
      structure: selectedStructureId ? selectedStructureId : 0,
      internal_property_type_id: "",
      property_type: selectedPropertyTypeId ? selectedPropertyTypeId : null,
      floor_number: 0,
      amenities: [],
    },
    validationSchema: PropertyDetailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      addProperty.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
          resetForm();
          setSubmitting(false);
        },
      });
    },
  });

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: addProperty.isPending,
  });

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, resetForm]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-[90vw] lg:max-w-[800px] max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg md:text-xl text-black font-semibold">
            Add Property
          </h2>
          <IconX
            color="red"
            className="cursor-pointer hover:bg-gray-100 rounded-md"
            onClick={() => onOpenChange(false)}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          <fieldset disabled={isFormDisabled}>
            {/* Property Details */}
            <div>
              <div className="flex items-center gap-1 mb-4">
                <TbBuildingCommunity className="text-black" size={20} />
                <h2 className="text-base md:text-lg text-black font-semibold">
                  Property Details
                </h2>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Property Name */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Property Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter name"
                    className="text-black font-normal h-10 w-full"
                    style={{
                      fontSize: "17px",
                      borderColor: COLOR_LIGHT_SILVER,
                    }}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) =>
                      handleEnterSubmit(e, isValid, handleSubmit)
                    }
                  />
                  {renderError("name")}
                </div>

                {/* Property Type */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="property_type"
                    className="text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Select Property Type
                  </Label>
                  <Select
                    value={
                      values.property_type ? String(values.property_type) : ""
                    }
                    onValueChange={(val) =>
                      setFieldValue("property_type", Number(val))
                    }
                  >
                    <SelectTrigger
                      id="property_type"
                      className="text-black font-normal h-10 w-full"
                      style={{
                        fontSize: "17px",
                        borderColor: COLOR_LIGHT_SILVER,
                      }}
                    >
                      <SelectValue placeholder="Choose a property type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {getPropertyTypesByStructure?.data?.map(
                        (pt: PropertyTypePayload) => (
                          <SelectItem
                            key={pt.id}
                            value={String(pt.id)}
                            className="data-[highlighted]:bg-gray-100 cursor-pointer"
                          >
                            {pt.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {renderError("property_type")}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                {/* Floor Number */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="floor_number"
                    className="text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Floor Number
                  </Label>
                  <Input
                    id="floor_number"
                    name="floor_number"
                    type="number"
                    placeholder="Enter floor number"
                    className="text-black font-normal h-10 w-full"
                    style={{
                      fontSize: "17px",
                      borderColor: COLOR_LIGHT_SILVER,
                    }}
                    value={values.floor_number}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) =>
                      handleEnterSubmit(e, isValid, handleSubmit)
                    }
                  />
                  {renderError("floor_number")}
                </div>

                {/* Internal Property ID */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="internal_property_id"
                    className="text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Internal Property ID (Optional)
                  </Label>
                  <Input
                    id="internal_property_id"
                    name="internal_property_id"
                    type="text"
                    placeholder="Enter internal property id"
                    className="text-black font-normal h-10 w-full"
                    style={{
                      fontSize: "17px",
                      borderColor: COLOR_LIGHT_SILVER,
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) =>
                      handleEnterSubmit(e, isValid, handleSubmit)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Property Characteristics */}
            <div>
              <div className="flex items-center gap-1 mb-4">
                <TbListDetails className="text-black" size={20} />
                <h2 className="text-base md:text-lg text-black font-semibold">
                  Property Type Characteristics
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="amenities"
                  className="text-sm font-medium"
                  style={{ color: COLOR_LIGHT_GRAY }}
                >
                  Amenities (Separate by commas)
                </Label>
                <MultiSelectDropdown
                  name="amenities"
                  value={values.amenities}
                  onChange={(val) => setFieldValue("amenities", val)}
                  options={AMENITIES_OPTIONS}
                  placeholder="AC, WiFi, TV"
                  onBlur={handleBlur}
                />
                {renderError("amenities")}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 mt-7 mb-3">
              <Button
                type="submit"
                className="btn w-full md:w-fit text-sm md:text-base"
                disabled={addProperty.isPending || !isValid || isSubmitting}
              >
                <TbDeviceFloppy className="mr-2" />
                {addProperty.isPending || isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
