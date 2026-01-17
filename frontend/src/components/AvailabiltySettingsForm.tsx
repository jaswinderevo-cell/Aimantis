import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  COLOR_LIGHT_GRAY,
  COLOR_LIGHT_SILVER,
  COLOR_VIOLET,
} from "@/constants/constants";
import { AvailabilitySchema } from "@/schemas/availabilitySettings";
import { handleEnterSubmit } from "@/utils/helper";
import { useFormik } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Tag } from "lucide-react";
import React, { useState } from "react";
import { TbCoins, TbDeviceFloppy } from "react-icons/tb";
import { DatePicker } from "./DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";

const AvailabiltySettingsForm = ({
  selectedStructureId,
}: {
  selectedStructureId: number;
}) => {
  const [loading, setLoading] = React.useState(false);

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    isSubmitting,
    values,
    errors,
    isValid,
  } = useFormik({
    initialValues: {
      websiteBookable: "",
      days: "",
      airbnbBookable: "",
      date: "",
      individualWebsiteBookable: "",
      selectedRoomId: "",
      individualDays: "",
    },
    validationSchema: AvailabilitySchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setLoading(true);
    },
  });

  const [showIndividualAccomodation, setShowIndividualAccomodation] =  useState(true);
  const [showDefaultSettings, setShowDefaultSettings] = useState(true);

  //get all rooms
  const getAllRooms = useGetAllRooms();
  const roomsData = getAllRooms?.data || [];

  //filter rooms by seleted structure
  const filteredRooms = roomsData?.filter((item: PropertyPayload) =>
    selectedStructureId === 0 || item.structure === selectedStructureId);

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
        {/* Default settings */}
        <div
          onClick={() => setShowDefaultSettings((prev) => !prev)}
          className="flex justify-between w-[100%] cursor-pointer items-center"
        >
          <div className="flex items-center gap-2">
            <TbCoins className="text-black" size={22} />
            <h2 className="text-black font-semibold text-[16px]">
              Default Settings
            </h2>
          </div>
          {showDefaultSettings ? (
            <>
              <ChevronUp className="text-black" size={23} />
            </>
          ) : (
            <>
              <ChevronDown className="text-black" size={23} />
            </>
          )}
        </div>

        <AnimatePresence>
          {showDefaultSettings && (
            <motion.div
              key="defaultSettings"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-5"
            >
              {/* website booking until */}
              <div className="flex flex-col">
                <Label
                  htmlFor="websiteBookable"
                  className="text-[13px] mb-2 font-medium"
                  style={{ color: COLOR_LIGHT_GRAY }}
                >
                  Website Bookable Until
                </Label>
                <div className="flex flex-col md:gap-4 md:flex-row md:items-center">
                  <div className="w-full">
                    <Select
                      value={values.websiteBookable}
                      onValueChange={(val) =>
                        setFieldValue("websiteBookable", val)
                      }
                    >
                      <SelectTrigger
                        className="w-full h-[40px] border rounded-md px-2 text-sm"
                        style={{ borderColor: COLOR_LIGHT_SILVER }}
                      >
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          className="cursor-pointer data-[highlighted]:bg-gray-100"
                          value="Absolute"
                        >
                          Absolute
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer data-[highlighted]:bg-gray-100"
                          value="Relative"
                        >
                          Relative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {renderError("websiteBookable")}
                  </div>

                  <div className="w-full">
                    <Input
                      className="text-black h-[38px] font-normal border-gray-300"
                      style={{ fontSize: "17px" }}
                      id="days"
                      name="days"
                      type="number"
                      placeholder="180"
                      value={values.days}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        handleEnterSubmit(e, isValid, handleSubmit)
                      }
                    />
                    {renderError("days")}
                  </div>
                </div>
              </div>

              {/* airbnb booking until */}
              <div className="flex flex-col">
                <Label
                  htmlFor="airbnbBookable"
                  className="text-[14px] font-medium mb-2"
                  style={{ color: COLOR_LIGHT_GRAY }}
                >
                  Airbnb Bookable Until
                </Label>
                <div className="flex flex-col md:gap-4 md:flex-row md:items-center">
                  <div className="w-full">
                    <Select
                      value={values.airbnbBookable}
                      onValueChange={(val) =>
                        setFieldValue("airbnbBookable", val)
                      }
                    >
                      <SelectTrigger
                        className="w-full h-[40px] border rounded-md px-2 text-sm"
                        style={{ borderColor: COLOR_LIGHT_SILVER }}
                      >
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          className="cursor-pointer data-[highlighted]:bg-gray-100"
                          value="Absolute "
                        >
                          Absolute
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer data-[highlighted]:bg-gray-100"
                          value="Relative"
                        >
                          Relative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {renderError("airbnbBookable")}
                  </div>
                  <div className="w-full">
                    <DatePicker
                      value={values.date}
                      onBlur={() => handleBlur("date")}
                      onChange={(val) => setFieldValue("date", val)}
                      name="date"
                      width=""
                      height="h-[38px]"
                      mode="date"
                    />
                    {renderError("date")}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Individual Accomodations */}
        <div
          onClick={() => setShowIndividualAccomodation((prev) => !prev)}
          className="flex justify-between w-[100%] mt-8 cursor-pointer items-center"
        >
          <div className="flex items-center gap-2">
            <Tag className="text-black" size={22} />
            <h2 className="text-black font-semibold text-[16px]">
              Individual Accomodations
            </h2>
          </div>
          {showIndividualAccomodation ? (
            <>
              <ChevronUp className="text-black" size={23} />
            </>
          ) : (
            <>
              <ChevronDown className="text-black" size={23} />
            </>
          )}
        </div>

        <AnimatePresence>
          {showIndividualAccomodation && (
            <motion.div
              key="individualWebsiteBookable"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              {/* Select */}
              <div className="mt-3 mb-3">
                <Select
                  value={values.selectedRoomId}
                  onValueChange={(val) => setFieldValue("selectedRoomId", val)}
                >
                  <SelectTrigger className="capitalize border h-[40px] border-gray-300 py-2 px-3 hover:cursor-pointer w-full md:w-[48%]">
                    <SelectValue placeholder="Select Room" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {filteredRooms?.map((room: PropertyPayload) => (
                      <SelectItem
                        key={room.id}
                        value={String(room.id)}
                        className="cursor-pointer data-[highlighted]:bg-gray-100"
                      >
                        <span className="capitalize">{room.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {renderError("selectedRoomId")}
              </div>

              <div className="flex flex-col">
                <Label
                  htmlFor="individualWebsiteBookable"
                  className="text-[14px] mb-2 text-gray-700"
                >
                  Airbnb Booking Until
                </Label>
                <div className="flex flex-col md:gap-4 md:flex-row md:items-center">
                  <div className="w-full">
                    <Select
                      value={values.individualWebsiteBookable}
                      onValueChange={(val) =>
                        setFieldValue("individualWebsiteBookable", val)
                      }
                    >
                      <SelectTrigger
                        className="w-full h-[40px] border rounded-md px-2 text-sm"
                        style={{ borderColor: COLOR_LIGHT_SILVER }}
                      >
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem
                          className="cursor-pointer data-[highlighted]:bg-gray-100"
                          value="Absolute "
                        >
                          Absolute
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer data-[highlighted]:bg-gray-100"
                          value="Relative"
                        >
                          Relative
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {renderError("individualWebsiteBookable")}
                  </div>
                  <div className="w-full">
                    <Input
                      className="text-black h-[40px]  border-gray-300"
                      style={{ fontSize: "17px" }}
                      id="individualDays"
                      name="individualDays"
                      type="number"
                      placeholder="180"
                      value={values.individualDays}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={(e) =>
                        handleEnterSubmit(e, isValid, handleSubmit)
                      }
                    />
                    {renderError("individualDays")}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

export default AvailabiltySettingsForm;
