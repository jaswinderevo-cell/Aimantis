import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { AMENITIES_OPTIONS, COLOR_LIGHT_GRAY } from "@/constants/constants";
import { AddPropertySchema } from "@/schemas/addPropertySchema";
import {
  PropertyTypePayload,
  useAddPropertyType,
} from "@/services/propertyTypes";
import {
  StructurePayload,
  useGetStructureById,
  useGetStructures,
} from "@/services/structure";
import { Structure } from "@/utils/dataFormatter";
import { handleEnterSubmit } from "@/utils/helper";
import { uploadFilesToCloudinary } from "@/utils/upload";
import { IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  TbBed,
  TbBuildingCommunity,
  TbDeviceFloppy,
  TbListDetails,
} from "react-icons/tb";
import DropzoneUploader from "../DropZoneUploader";
import MultiSelectDropdown from "../MultiSelectDropdown";
import NumberCounter from "../NumberInput";
import { Button } from "../ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { useFormStatus } from "@/utils/disableFormHook";
export function AddPropertyTypeModal({
  open,
  onOpenChange,
  getStructureById,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStructure?: Structure | null;
  onSuccess?: () => void;
  getStructureById: ReturnType<typeof useGetStructureById>;
}) {
  const addPropertyTypeMutation = useAddPropertyType();
  const getAllStrucutres = useGetStructures();

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
    initialValues: {
      structure: getStructureById?.data?.id ?? null,
      name: "",
      internal_property_type_id: "",
      property_size_sqm: "",
      max_guests: 1,
      num_beds: 1,
      num_sofa_beds: 0,
      num_bedrooms: 0,
      num_bathrooms: 0,
      amenities: [],
      beds: [
        {
          bed_type: "Single",
          quantity: 1,
        },
      ],
      image_url: "",
      _localFiles: [],
    },
    enableReinitialize: true,
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
      addPropertyTypeMutation.mutate(values, {
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
    isLoading: addPropertyTypeMutation.isPending,
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
      <DialogContent className="w-[95vw] max-w-[670px] max-h-[90vh] overflow-auto lg:w-[49vw] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 sm:pb-4">
          <h2 className="text-lg sm:text-xl font-semibold capitalize">
            Add Property Type
          </h2>
          <button
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => onOpenChange(false)}
          >
            <IconX color="red" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <fieldset disabled = {isFormDisabled}>
            {/* select structure */}
            <div className="mt-5">
              <Label
                htmlFor="structure"
                className="text-[14px] font-semiBold mb-1 block"
                style={{ color: COLOR_LIGHT_GRAY }}
              >
                Select Structure
              </Label>

              <Select
                value={
                  values.structure
                    ? String(values.structure)
                    : getStructureById.data?.id
                      ? String(getStructureById.data.id)
                      : ""
                }
                onValueChange={(value) =>
                  setFieldValue("structure", Number(value))
                }
              >
                <SelectTrigger
                  className="lg:w-56 w-full capitalize"
                  style={{ borderColor: COLOR_LIGHT_GRAY }}
                >
                  <SelectValue placeholder="Select Structure" />
                </SelectTrigger>

                <SelectContent className="bg-white capitalize">
                  {getAllStrucutres.data?.map((item: StructurePayload) => (
                    <SelectItem
                      key={item.id}
                      value={String(item.id)}
                      className="cursor-pointer data-[highlighted]:bg-gray-100"
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {renderError("structure")}
            </div>

            {/* Property Type Details Section */}
            <div>
              <div className="flex items-center gap-2 mt-4 mb-4">
                <TbBuildingCommunity className="text-black" size={20} />
                <span className="text-[16px] sm:text-[16px] font-semibold text-black">
                  Add Property Type
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[14px] font-semiBold block"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Property Type Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter room type"
                    className="text-black font-normal h-10 w-full text-[16px]"
                    style={{ borderColor: COLOR_LIGHT_GRAY }}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) =>
                      handleEnterSubmit(e, isValid, handleSubmit)
                    }
                  />
                  {renderError("name")}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="internal_property_type_id"
                    className="text-[14px] font-semiBold block"
                    style={{ color: COLOR_LIGHT_GRAY }}
                  >
                    Property Type ID (Optional)
                  </Label>
                  <Input
                    id="internal_property_type_id"
                    name="internal_property_type_id"
                    type="text"
                    placeholder="Enter the internal property ID"
                    className="text-black font-normal h-10 w-full"
                    style={{ borderColor: COLOR_LIGHT_GRAY }}
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

            {/* Property Type Characteristics Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TbListDetails className="text-black" size={20} />
                <span className="text-[16px] sm:text-[16px] font-semibold text-black">
                  Property Type Characteristics
                </span>
              </div>

              <div className="space-y-1">
                {/* Property Size and Max Guests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="property_size_sqm"
                      className="text-[14px] font-semiBold block"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Property size (m²)
                    </Label>
                    <Input
                      id="property_size_sqm"
                      name="property_size_sqm"
                      type="number"
                      placeholder="Enter property size in m²"
                      className="text-black font-normal h-10 w-full text-[16px]"
                      style={{ borderColor: COLOR_LIGHT_GRAY }}
                      value={values.property_size_sqm}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        handleEnterSubmit(e, isValid, handleSubmit)
                      }
                    />
                    {renderError("property_size_sqm")}
                  </div>

                  <div>
                    <NumberCounter
                      label="Max Number of Guests"
                      value={values.max_guests}
                      onChange={(val) => setFieldValue("max_guests", val)}
                      min={1}
                      name=""
                      error={renderError("max_guests")}
                    />
                  </div>
                </div>

                {/* Beds and Sofa Beds */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <NumberCounter
                      label="Number of Beds"
                      value={values.num_beds}
                      onChange={(val) => setFieldValue("num_beds", val)}
                      min={1}
                      name=""
                      error={renderError("num_beds")}
                    />
                  </div>

                  <div>
                    <NumberCounter
                      label="Number of Sofa Beds"
                      value={values.num_sofa_beds}
                      onChange={(val) => setFieldValue("num_sofa_beds", val)}
                      min={1}
                      name=""
                      error={renderError("num_sofa_beds")}
                    />
                  </div>
                </div>

                {/* Bedrooms and Bathrooms */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <NumberCounter
                      label="Number of Bedrooms"
                      value={values.num_bedrooms}
                      onChange={(val) => setFieldValue("num_bedrooms", val)}
                      min={1}
                      name=""
                      error={renderError("num_bedrooms")}
                    />
                  </div>

                  <div>
                    <NumberCounter
                      label="Number of Bathrooms"
                      value={values.num_bathrooms}
                      onChange={(val) => setFieldValue("num_bathrooms", val)}
                      min={1}
                      name=""
                      error={renderError("num_bathrooms")}
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-2">
                  <Label
                    htmlFor="amenities"
                    className="text-[14px] font-semiBold block"
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
                    borderColor="#667085"
                  />
                  {renderError("amenities")}
                </div>
              </div>
            </div>

            {/* Bed Information Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TbBed className="text-black" size={20} />
                <span className="text-[16px] sm:text-[16px] font-semibold text-black">
                  Bed Information
                </span>
              </div>

              <div className="space-y-4">
                {values.beds.map((config, index) => (
                  <div
                    key={index}
                    className="space-y-3 p-3 sm:p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          className="text-[14px] font-semiBold block"
                          style={{ color: COLOR_LIGHT_GRAY }}
                        >
                          Bed Type
                        </Label>
                        <Select
                          name={`beds[${index}].bed_type`}
                          value={values.beds[index].bed_type}
                          onValueChange={(val) =>
                            handleChange({
                              target: {
                                name: `beds[${index}].bed_type`,
                                value: val,
                              },
                            } as React.ChangeEvent<HTMLInputElement>)
                          }
                        >
                          <SelectTrigger className="w-full cursor-pointer h-10 text-[16px] border border-gray-400">
                            <SelectValue placeholder="Select Bed Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem
                              value="Single"
                              className="cursor-pointer data-[highlighted]:bg-gray-100"
                            >
                              Single
                            </SelectItem>
                            <SelectItem
                              value="Double"
                              className="cursor-pointer data-[highlighted]:bg-gray-100"
                            >
                              Double
                            </SelectItem>
                            <SelectItem
                              value="Queen"
                              className="cursor-pointer data-[highlighted]:bg-gray-100"
                            >
                              Queen
                            </SelectItem>
                            <SelectItem
                              value="King"
                              className="cursor-pointer data-[highlighted]:bg-gray-100"
                            >
                              King
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {renderError(`beds[${index}].bed_type`)}
                      </div>

                      <div>
                        <NumberCounter
                          label="Number of Beds"
                          value={values.beds[index].quantity}
                          onChange={(val) =>
                            setFieldValue(`beds[${index}].quantity`, val)
                          }
                          min={1}
                          name=""
                          error={renderError(`beds[${index}].quantity`)}
                        />
                      </div>
                    </div>

                    {index !== 0 && (
                      <div className="flex justify-start">
                        <button
                          type="button"
                          className="btn-secondary rounded-md px-3 py-2 font-semiBold flex items-center gap-2 hover:cursor-pointer text-[14px] transition-colors"
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
                        </button>
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
            <div className="mt-9 mb-4">
              <DropzoneUploader
                showLabel
                onFilesSelected={async (files) => {
                  // Save raw files for local preview
                  setFieldValue("_localFiles", files);
                }}
              />
              {renderError("image_url")}
            </div>
            {/* Submit Button */}
            <div className="flex justify-center sm:justify-end pt-4">
              <Button
                type="submit"
                className="btn text-[14px] w-full sm:w-auto min-w-[120px]"
                disabled={
                  addPropertyTypeMutation.isPending || !isValid || isSubmitting
                }
              >
                <TbDeviceFloppy className="mr-2" size={16} />
                {addPropertyTypeMutation.isPending || isSubmitting
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
