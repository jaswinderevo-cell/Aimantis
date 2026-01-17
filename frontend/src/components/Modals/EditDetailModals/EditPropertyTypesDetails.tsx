import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  TbBed,
  TbBuildingCommunity,
  TbDeviceFloppy,
  TbListDetails,
} from "react-icons/tb";
import NumberCounter from "../../NumberInput";
import { Button } from "../../ui/Button";
import { Loader } from "@/common/components/loader/Loader";
import DropzoneUploader from "@/components/DropZoneUploader";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import {
  AMENITIES_OPTIONS,
  COLOR_LIGHT_GRAY,
  COLOR_VIOLET,
  OptionType,
} from "@/constants/constants";
import { AddPropertySchema } from "@/schemas/addPropertySchema";
import {
  PropertyTypePayload,
  useUpdatePropertyType,
} from "@/services/propertyTypes";
import { handleEnterSubmit, normalizeAmenities } from "@/utils/helper";
import { PropertyType } from "@/utils/propertyTypesJsonData";
import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { uploadFilesToCloudinary } from "@/utils/upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useFormStatus } from "@/utils/disableFormHook";

// Type for property data coming from backend (amenities as string)
type PropertyTypeBackendResponse = Omit<PropertyTypePayload, "amenities"> & {
  amenities: string | OptionType[];
};

const BED_TYPES = ["Single", "Double", "Queen", "King"];

export function EditPropertyTypeModal({
  open,
  onOpenChange,
  property,
}: {
  open: boolean;
  onSave?: (updatedItem: PropertyType) => void;
  onOpenChange: (open: boolean) => void;
  property?: PropertyTypeBackendResponse | null;
}) {
  const updatePropertyTypeMutation = useUpdatePropertyType();

  const {
    handleSubmit,
    handleChange,
    isSubmitting,
    handleBlur,
    setFieldValue,
    resetForm,
    values,
    errors,
    isValid,
  } = useFormik<PropertyTypePayload>({
    enableReinitialize: true,
    initialValues: {
      id: property?.id ?? undefined,
      structure: property?.structure ?? null,
      name: property?.name ?? "",
      internal_property_type_id: property?.internal_property_type_id ?? "",
      property_size_sqm: property?.property_size_sqm ?? "",
      max_guests: property?.max_guests ?? 1,
      num_beds: property?.num_beds ?? 1,
      num_sofa_beds: property?.num_sofa_beds ?? 0,
      num_bedrooms: property?.num_bedrooms ?? 0,
      num_bathrooms: property?.num_bathrooms ?? 0,
      amenities: normalizeAmenities(property?.amenities),
      beds: property?.beds ?? [
        {
          bed_type: "Single",
          quantity: 1,
        },
      ],
      image_url: property?.image_url ?? "",
    },
    validationSchema: AddPropertySchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      //image upload
      const uploadedUrls = await uploadFilesToCloudinary(
        values._localFiles || [],
      );
      if (uploadedUrls.length > 0) {
        values.image_url = uploadedUrls[0];
      }
      updatePropertyTypeMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
          setSubmitting(false);
          resetForm();
        },
      });
    },
  });

  const { isFormDisabled } = useFormStatus({
    isSubmitting,
    isLoading: updatePropertyTypeMutation.isPending,
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

  const addBedType = () => {
    setFieldValue("beds", [
      ...values.beds,
      { bed_type: "Single", quantity: 1 },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90vw] lg:w-[55vw] max-w-[800px] max-h-[90vh] overflow-auto mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-4">
          <h2 className="text-lg md:text-xl font-semibold capitalize">
            Edit Property Type
          </h2>
          <span className="cursor-pointer" onClick={() => onOpenChange(false)}>
            <IconX color="red" className="hover:bg-gray-100 rounded-md" />
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset disabled={isFormDisabled}>
            {/* Property Type Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TbBuildingCommunity className="text-black" size={22} />
                <h2 className="text-base md:text-lg font-semibold text-black">
                  Add Property Type
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-4 border-b">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Property Type Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter room type"
                    className="h-10 text-[17px] border-gray-400 rounded-md text-black"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) =>
                      handleEnterSubmit(e, isValid, handleSubmit)
                    }
                  />

                  {renderError("name")}
                </div>
                {/* Internal ID */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="internal_property_type_id"
                    className="text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Property Type ID (Optional)
                  </Label>
                  <Input
                    id="internal_property_type_id"
                    name="internal_property_type_id"
                    type="text"
                    placeholder="Internal property ID"
                    className="h-10 text-[17px] border-gray-400 rounded-md text-black"
                    value={values.internal_property_type_id}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) =>
                      handleEnterSubmit(e, isValid, handleSubmit)
                    }
                  />
                  {renderError("internal_property_type_id")}
                </div>
              </div>
            </div>

            {/* Characteristics */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TbListDetails className="text-black" size={22} />
                <h2 className="text-base md:text-lg font-semibold text-black">
                  Property Type Characteristics
                </h2>
              </div>
              <div className="grid items-center grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Size */}
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="property_size_sqm"
                    className="text-sm font-medium"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Property size m²
                  </Label>
                  <Input
                    id="property_size_sqm"
                    name="property_size_sqm"
                    type="text"
                    placeholder="Enter property size"
                    className="h-10 text-[17px] border-gray-300 rounded-md text-black"
                    value={values.property_size_sqm}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) =>
                      handleEnterSubmit(e, isValid, handleSubmit)
                    }
                  />
                  {renderError("property_size_sqm")}
                </div>
                {/* Guests */}
                <NumberCounter
                  label="Max Number of Guests"
                  value={values.max_guests}
                  onChange={(val) => setFieldValue("max_guests", val)}
                  min={1}
                  error={renderError("max_guests")}
                  disabled={isFormDisabled}
                />
              </div>

              {/* Beds / Sofa Beds */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                <NumberCounter
                  label="Number of Beds"
                  value={values.num_beds}
                  onChange={(val) => setFieldValue("num_beds", val)}
                  error={renderError("num_beds")}
                  disabled={isFormDisabled}
                />
                <NumberCounter
                  label="Number of Sofa Beds"
                  value={values.num_sofa_beds}
                  onChange={(val) => setFieldValue("num_sofa_beds", val)}
                  error={renderError("num_sofa_beds")}
                  disabled={isFormDisabled}
                />
              </div>

              {/* Bedrooms / Bathrooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                <NumberCounter
                  label="Number of Bedrooms"
                  value={values.num_bedrooms}
                  onChange={(val) => setFieldValue("num_bedrooms", val)}
                  error={renderError("num_bedrooms")}
                />
                <NumberCounter
                  label="Number of Bathrooms"
                  value={values.num_bathrooms}
                  onChange={(val) => setFieldValue("num_bathrooms", val)}
                  error={renderError("num_bathrooms")}
                  disabled={isFormDisabled}
                />
              </div>

              {/* Amenities */}
              <div className="">
                <Label
                  htmlFor="amenities"
                  className="mb-2 text-sm font-medium"
                  style={{ color: COLOR_LIGHT_GRAY }}
                >
                  Amenities (Separate by commas)
                </Label>
                <MultiSelectDropdown
                  name="amenities"
                  options={AMENITIES_OPTIONS}
                  value={values.amenities}
                  onChange={(val) => setFieldValue("amenities", val || [])}
                  onBlur={handleBlur}
                  placeholder="AC, WiFi, TV"
                  borderColor="#d1d5dc"
                />
                {renderError("amenities")}
              </div>
            </div>

            {/* Bed Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TbBed className="text-black" size={20} />
                <span className="text-base md:text-lg font-semibold text-black">
                  Bed Information
                </span>
              </div>
              <div className="space-y-4">
                {values.beds.map((_, index) => (
                  <div
                    key={index}
                    className="space-y-3 p-3 sm:p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          className="text-sm font-medium"
                          style={{ color: COLOR_LIGHT_GRAY }}
                        >
                          Bed Type
                        </Label>
                        <Select
                          value={values.beds[index].bed_type}
                          onValueChange={(val) =>
                            setFieldValue(`beds[${index}].bed_type`, val)
                          }
                        >
                          <SelectTrigger className="h-10 w-full border border-gray-300 rounded-md px-3 text-base text-black">
                            <SelectValue placeholder="Select bed type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {BED_TYPES.map((type) => (
                              <SelectItem
                                className="cursor-pointer data-[highlighted]:bg-gray-100"
                                key={type}
                                value={type}
                              >
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {renderError(`beds[${index}].bed_type`)}
                      </div>
                      <NumberCounter
                        label="Number of Beds"
                        value={values.beds[index].quantity}
                        onChange={(val) =>
                          setFieldValue(`beds[${index}].quantity`, val)
                        }
                        min={1}
                        error={renderError(`beds[${index}].quantity`)}
                        disabled={isFormDisabled}
                      />
                    </div>
                    {index !== 0 && (
                      <div>
                        <Button
                          type="button"
                          className="btn-secondary rounded-md px-3 py-2 flex items-center gap-2 text-sm"
                          onClick={() => {
                            const updated = [...values.beds];
                            updated.splice(index, 1);
                            setFieldValue("beds", updated);
                          }}
                        >
                          <FaMinus size={12} />
                          <span className="hidden sm:inline">
                            Remove Bed Type
                          </span>
                          <span className="sm:hidden">Remove</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex justify-center sm:justify-end">
                  <Button
                    type="button"
                    className="btn rounded-md w-full md:w-fit px-4 py-2 font-semiBold text-white flex items-center gap-2 hover:cursor-pointer text-[14px] transition-colors"
                    onClick={addBedType}
                  >
                    <FaPlus size={12} />
                    Add Bed Type
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload image */}
            <div>
              <DropzoneUploader
                showLabel
                onFilesSelected={(files) => setFieldValue("_localFiles", files)}
              />
              {renderError("image")}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="btn text-[14px] w-full sm:w-auto min-w-[120px]"
                style={{ backgroundColor: COLOR_VIOLET }}
                disabled={
                  updatePropertyTypeMutation.isPending ||
                  !isValid ||
                  isSubmitting
                }
              >
                <TbDeviceFloppy className="mr-2" />
                {updatePropertyTypeMutation.isPending || isSubmitting
                  ? "Saving..."
                  : "Save"}
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
}
