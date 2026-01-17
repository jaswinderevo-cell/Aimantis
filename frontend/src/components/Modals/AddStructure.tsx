import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  COLOR_LIGHT_GRAY,
  COUNTRY,
  CURRENCY,
  LANGUAGE,
  TIME,
} from "@/constants/constants";
import { AddstructureSchema } from "@/schemas/addStructureSchema";
import { StructurePayload, useAddStructure } from "@/services/structure";
import { handleEnterSubmit } from "@/utils/helper";
import { uploadFilesToCloudinary } from "@/utils/upload";
import { IconMapPin, IconX } from "@tabler/icons-react";
import { getIn, useFormik } from "formik";
import { useEffect } from "react";
import {
  TbBuildingBank,
  TbBuildingCommunity,
  TbDeviceFloppy,
  TbSettingsCog,
} from "react-icons/tb";
import TimezoneSelect from "react-timezone-select";
import DropzoneUploader from "../DropZoneUploader";
import { Button } from "../ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { useFormStatus } from "@/utils/disableFormHook";

export function AddStructureModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const addStructureMutation = useAddStructure();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    resetForm,
    values,
    errors,
    isSubmitting,
    isValid,
    setFieldValue,
  } = useFormik<StructurePayload>({
    initialValues: {
      name: "",
      structure_type: "",
      internal_reference_code: "",
      street_address: "",
      zip_code: "",
      country: "",
      legal_entity_name: "",
      tax_id_vat_number: 0,
      default_currency: "",
      default_language: "",
      time_zone: "",
      default_check_in_time: TIME[1] || "",
      default_check_out_time: TIME[2] || "",
      status: "",
      image_url: "",
      _localFiles: [],
    },
    validationSchema: AddstructureSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      //upload image
      const uploadedUrls = await uploadFilesToCloudinary(
        values._localFiles || [],
      );
      if (uploadedUrls.length > 0) {
        values.image_url = uploadedUrls[0];
      }
      //call mutation
      addStructureMutation.mutate(values, {
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
    isLoading: addStructureMutation.isPending,
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
      <DialogContent className="sm:max-w-[670px] max-h-[90vh] overflow-auto lg:w-[49vw]">
        <div>
          <div className="flex justify-between items-center pb-4">
            <h2 className="text-[20px] font-semibold capitalize">
              Add Structure
            </h2>

            <span
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              <IconX color="red" className="hover:bg-gray-100 rounded-md" />
            </span>
          </div>

          <form onSubmit={handleSubmit} id="structure">
            <fieldset disabled={isFormDisabled}>
              <div>
                <div className="flex items-center justify-start gap-1 mt-9 mb-4">
                  <TbBuildingCommunity className="text-black" size={24} />
                  <h2 className="text-[16px] text-black">Basic Information</h2>
                </div>

                <div className="lg:flex-row flex flex-col items-center gap-5 justify-between">
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="name"
                      className="text-[14px] text-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Structure Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        handleEnterSubmit(e, isValid, handleSubmit)
                      }
                      placeholder="The Bliss Apartments"
                      className="text-black h-[40px] border-gray-400 border-1"
                      style={{ fontSize: "17px" }}
                    />
                    {renderError("name")}
                  </div>

                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="structure_type"
                      className="text-[14px] text-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Structure Type
                    </Label>

                    <Select
                      onValueChange={(value) =>
                        setFieldValue("structure_type", value)
                      }
                      defaultValue={values.structure_type}
                    >
                      <SelectTrigger
                        id="structure_type"
                        className="w-full border-gray-400 text-black data-[placeholder]:text-gray-500"
                        style={{ fontSize: "17px", height: "40px" }}
                      >
                        <SelectValue placeholder="Select structure type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          className="data-[highlighted]:bg-gray-100"
                          value="hotel"
                        >
                          Hotel
                        </SelectItem>
                        <SelectItem
                          className="data-[highlighted]:bg-gray-100"
                          value="apartment"
                        >
                          Apartment
                        </SelectItem>
                        <SelectItem
                          className="data-[highlighted]:bg-gray-100"
                          value="mixed_use"
                        >
                          Mixed Use
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {renderError("structure_type")}
                  </div>
                </div>

                <div className="lg:flex-row flex flex-col items-center gap-5 justify-between mt-2 pb-2">
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="internal_reference_code"
                      className="text-[14px] text-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Internal Reference Code
                    </Label>
                    <Input
                      id="internal_reference_code"
                      name="internal_reference_code"
                      type="text"
                      value={values.internal_reference_code}
                      onChange={handleChange}
                      placeholder="Enter reference code"
                      className="text-black h-[40px] border-gray-400 border-1"
                      style={{ fontSize: "17px" }}
                    />
                  </div>
                  <div className="flex-col gap-2 lg:w-1/2 w-full hidden"></div>
                </div>

                {/* Location */}
                <div className="flex items-center justify-start gap-1 mt-9 mb-4">
                  <IconMapPin className="text-black" size={24} />
                  <h2 className="text-[16px] text-black">Location</h2>
                </div>
                <div className="lg:flex-row flex flex-col items-center gap-5 justify-between">
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="street_address"
                      className="text-[14px] text-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Street Address
                    </Label>
                    <Input
                      id="street_address"
                      name="street_address"
                      type="text"
                      placeholder="Street Address"
                      className="text-black h-[40px] border-gray-400 border-1 "
                      style={{ fontSize: "17px" }}
                      value={values.street_address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {renderError("street_address")}
                  </div>

                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="zip_code"
                      className="text-[14px] text-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Zip Code
                    </Label>
                    <Input
                      id="zip_code"
                      name="zip_code"
                      type="text"
                      className="text-black h-[40px] border-gray-400 border-1 "
                      style={{ fontSize: "17px" }}
                      placeholder="Zip code"
                      value={values.zip_code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {renderError("zip_code")}
                  </div>
                </div>

                <div className="lg:flex-row flex flex-col items-center gap-5 justify-between pb-2">
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="country"
                      className="text-[14px] text-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Country
                    </Label>

                    <Select
                      value={values.country || ""}
                      onValueChange={(value) => setFieldValue("country", value)}
                    >
                      <SelectTrigger
                        id="country"
                        className="h-[40px] w-full border-gray-400 text-black data-[placeholder]:text-gray-400"
                        style={{ fontSize: "17px" }}
                      >
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>

                      <SelectContent className="bg-white">
                        {COUNTRY.map((country, index) => (
                          <SelectItem
                            key={index}
                            value={country}
                            className="data-[highlighted]:bg-gray-100"
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {renderError("country")}
                  </div>

                  <div className="flex-col gap-2 lg:w-1/2 w-full hidden"></div>
                </div>

                {/* Legal & Administrative */}
                <div className="flex items-center justify-start gap-3 mt-2 mb-4">
                  <TbBuildingBank className="text-black" size={24} />
                  <h2 className="text-[16px] text-black">
                    Legal & Administrative
                  </h2>
                </div>

                <div className="lg:flex-row flex flex-col items-center gap-5 justify-between pb-2">
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="legal_entity_name"
                      className="text-[14px] text-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Legal Entity Name
                    </Label>
                    <Input
                      id="legal_entity_name"
                      name="legal_entity_name"
                      type="text"
                      placeholder="Legal entity name"
                      className="text-black h-[40px] border-gray-400 border-1 "
                      style={{ fontSize: "17px" }}
                      value={values.legal_entity_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="tauseStatex_id_vat_number"
                      className="text-[14px] text-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Tax ID/Vat Number
                    </Label>
                    <Input
                      id="tax_id_vat_number"
                      name="tax_id_vat_number"
                      type="text"
                      className="text-black  h-[40px] border-gray-400 border-1 text-[17px]"
                      style={{ fontSize: "17px" }}
                      placeholder="Tax ID/Vat number"
                      value={values.tax_id_vat_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Operational Settings */}
                <div className="flex items-center justify-start gap-3 mt-9 mb-4 w-full">
                  <TbSettingsCog className="text-black" size={24} />
                  <h2 className="text-[16px] text-black">
                    Operational Settings
                  </h2>
                </div>

                <div className="flex flex-col lg:flex-row items-start md:gap-5 w-full">
                  {/* Default Currency */}
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="default_currency"
                      className="text-[14px] font-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Default Currency
                    </Label>
                    <Select
                      value={values.default_currency || ""}
                      onValueChange={(value) =>
                        setFieldValue("default_currency", value)
                      }
                    >
                      <SelectTrigger
                        id="default_currency"
                        className="w-full border border-gray-400 text-black data-[placeholder]:text-gray-400 text-[17px]"
                        style={{ height: "40px" }}
                      >
                        <SelectValue placeholder="Select Currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {CURRENCY.map((curr, index) => (
                          <SelectItem
                            key={index}
                            value={curr}
                            className="cursor-pointer data-[highlighted]:bg-gray-100"
                          >
                            {curr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {renderError("default_currency")}
                  </div>

                  {/* Default Language */}
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="default_language"
                      className="text-[14px] font-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Default Language
                    </Label>
                    <Select
                      value={values.default_language}
                      onValueChange={(value) =>
                        setFieldValue("default_language", value)
                      }
                    >
                      <SelectTrigger
                        id="default_language"
                        className="w-full border border-gray-400 text-black data-[placeholder]:text-gray-400 text-[17px]"
                        style={{ height: "40px" }}
                      >
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {LANGUAGE.map((lang, index) => (
                          <SelectItem
                            key={index}
                            value={lang}
                            className="data-[highlighted]:bg-gray-100"
                          >
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Timezone + Check-in Time */}
                <div className="flex flex-col lg:flex-row items-start gap-5 w-full mt-2">
                  {/* Time Zone */}
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="time_zone"
                      className="text-[14px] text-gray-200 font-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Time Zone
                    </Label>
                    <TimezoneSelect
                      id="time_zone"
                      name="time_zone"
                      value={values.time_zone}
                      onChange={(timezone) =>
                        setFieldValue("time_zone", timezone.value)
                      }
                      className="text-black w-full"
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          minHeight: "40px",
                          height: "40px",
                          borderColor: "#6a7282",
                          borderRadius: "6px",
                          fontSize: "17px",
                          color: "black",
                          boxShadow: "none",
                          "&:hover": {
                            borderColor: "#6a7282",
                            cursor: "pointer",
                          },
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          color: "black",
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: "#99a1af",
                        }),
                        dropdownIndicator: (provided) => ({
                          ...provided,
                          color: "#e5e7eb ",
                        }),
                        option: (provided, state) => ({
                          ...provided,
                          cursor: "pointer",
                          backgroundColor: state.isFocused
                            ? "#f3f4f6"
                            : "white",
                          color: "black",
                        }),
                      }}
                    />
                  </div>

                  {/* Default Check-in Time */}
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="default_check_in_time"
                      className="text-[14px] font-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Default Check-in Time
                    </Label>
                    <Select
                      value={values.default_check_in_time}
                      onValueChange={(value) =>
                        setFieldValue("default_check_in_time", value)
                      }
                    >
                      <SelectTrigger
                        id="default_check_in_time"
                        className="w-full border border-gray-400 text-black data-[placeholder]:text-gray-400 text-[17px]"
                        style={{ height: "40px" }}
                      >
                        <SelectValue placeholder="Select check-in time" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {TIME.map((time, index) => (
                          <SelectItem
                            key={index}
                            value={time}
                            className="data-[highlighted]:bg-gray-100"
                          >
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {renderError("default_check_in_time")}
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row items-start gap-5 w-full">
                  {/* Default Check-out Time */}
                  <div className="flex flex-col gap-1 lg:w-1/2 w-full">
                    <Label
                      htmlFor="default_check_out_time"
                      className="text-[14px] font-semiBold"
                      style={{ color: COLOR_LIGHT_GRAY }}
                    >
                      Default Check-out Time
                    </Label>
                    <Select
                      value={values.default_check_out_time}
                      onValueChange={(value) =>
                        setFieldValue("default_check_out_time", value)
                      }
                    >
                      <SelectTrigger
                        id="default_check_out_time"
                        className="h-[40px] w-full border border-gray-400 text-black data-[placeholder]:text-gray-400 text-[17px]"
                      >
                        <SelectValue placeholder="Select check-out time" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {TIME.map((time, index) => (
                          <SelectItem
                            key={index}
                            value={time}
                            className="data-[highlighted]:bg-gray-100"
                          >
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {renderError("default_check_out_time")}
                  </div>
                </div>

                {/* Uplaod image */}
                <div className="mb-4">
                  <DropzoneUploader
                    showLabel
                    onFilesSelected={async (files) => {
                      // Save raw files for local preview
                      setFieldValue("_localFiles", files);
                    }}
                  />
                </div>

                {/* save */}
                <div className="flex gap-4 justify-end mt-7 mb-3">
                  <Button
                    type="submit"
                    className="btn text-[14px] w-full md:w-fit"
                    disabled={
                      addStructureMutation.isPending || !isValid || isSubmitting
                    }
                  >
                    <TbDeviceFloppy className="mr-2" />
                    {addStructureMutation.isPending || isSubmitting
                      ? "Saving..."
                      : "Save"}
                  </Button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
