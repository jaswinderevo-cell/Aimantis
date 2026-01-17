import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  AMENITIES_OPTIONS,
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_SILVER,
} from "@/constants/constants";
import { PropertyDetailSchema } from "@/schemas/propertyDetailSchema";
import { PropertyPayload, useUpdateRoom } from "@/services/rooms";
import { useFormStatus } from "@/utils/disableFormHook";
import { handleEnterSubmit, normalizeAmenities } from "@/utils/helper";
import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { useEffect } from "react";
import {
  TbBuildingCommunity,
  TbDeviceFloppy,
  TbListDetails,
} from "react-icons/tb";

export function EditPropertyDetailModal({
  open,
  onOpenChange,
  editingProperty,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProperty: PropertyPayload | null;
}) {
  const editedProperty = useUpdateRoom();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    isSubmitting,
    values,
    errors,
    isValid,
    resetForm,
  } = useFormik<PropertyPayload>({
    enableReinitialize: true,
    initialValues: {
      id: editingProperty?.id ?? undefined,
      name: editingProperty?.name ?? "",
      structure: editingProperty?.structure ?? 0,
      internal_property_type_id: "",
      property_type: editingProperty?.property_type ?? 0,
      floor_number: editingProperty?.floor_number ?? 0,
      amenities: normalizeAmenities(editingProperty?.amenities),
    },
    validationSchema: PropertyDetailSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      editedProperty.mutate(values, {
        onSuccess: () => {
          setSubmitting(false);
          onOpenChange(false);
          resetForm();
        },
      });
    },
  });

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: editedProperty.isPending,
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
      <DialogContent className="w-full max-w-full sm:max-w-[685px] max-h-[90vh] overflow-auto px-4 sm:px-6">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={isFormDisabled}>
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-[20px] text-black font-semibold">
                  Edit Property
                </h2>
                <IconX
                  color="red"
                  className="cursor-pointer hover:bg-gray-100 rounded-md"
                  onClick={() => onOpenChange(false)}
                />
              </div>

              {/* Property Details */}
              <div>
                <div className="flex items-center justify-start mt-6 mb-3 gap-1">
                  <TbBuildingCommunity className="text-black" size={20} />
                  <h2 className="text-base sm:text-[16px] text-black font-semibold">
                    Property Details
                  </h2>
                </div>

                {/* Responsive grid for inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="name"
                      className="text-[14px] font-medium"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Property Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter property name"
                      className="text-black font-normal h-[40px] w-full"
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

                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="property_type"
                      className="text-[14px] font-medium"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Property Type ID
                    </Label>
                    <Input
                      id="property_type"
                      name="property_type"
                      type="number"
                      readOnly
                      placeholder="Enter property type id"
                      className="text-black font-normal h-[40px] w-full"
                      style={{
                        fontSize: "17px",
                        borderColor: COLOR_LIGHT_SILVER,
                      }}
                      value={String(values.property_type)}
                      onChange={(e) =>
                        setFieldValue("property_type", Number(e.target.value))
                      }
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        handleEnterSubmit(e, isValid, handleSubmit)
                      }
                    />
                    {renderError("property_type")}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="floor_number"
                      className="text-[14px] font-medium"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Floor Number
                    </Label>
                    <Input
                      id="floor_number"
                      name="floor_number"
                      type="number"
                      placeholder="Enter floor number"
                      className="text-black font-normal h-[40px] w-full"
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

                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="internal_property_id"
                      className="text-[14px] font-medium"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Property ID (Optional)
                    </Label>
                    <Input
                      id="internal_property_id"
                      name="internal_property_id"
                      type="text"
                      placeholder="Enter the internal property number"
                      className="text-black font-normal h-[40px] w-full"
                      style={{
                        fontSize: "17px",
                        borderColor: COLOR_LIGHT_SILVER,
                      }}
                      value={values.internal_property_type_id}
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
                <div className="flex items-center justify-start mt-6 mb-3 gap-1">
                  <TbListDetails className="text-black" size={20} />
                  <h2 className="text-base sm:text-[16px] text-black font-semibold">
                    Property Type Characteristics
                  </h2>
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="amenities"
                    className="text-[14px] font-medium"
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
              <div className="flex gap-4 justify-end mt-6">
                <Button
                  type="submit"
                  className="btn text-[14px] w-full md:w-fit"
                  disabled={editedProperty.isPending || !isValid}
                >
                  <TbDeviceFloppy className="mr-2" />
                  {editedProperty.isPending || !isValid ? "Saving..." : "Save"}
                </Button>
              </div>
            </fieldset>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
