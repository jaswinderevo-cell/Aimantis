import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { GiSettingsKnobs } from "react-icons/gi";
import { LuCalendarMinus2 } from "react-icons/lu";
import { TbBulb, TbDeviceFloppy } from "react-icons/tb";

import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import {
  COLOR_EBONY,
  COLOR_LIGHT_SILVER,
  COLOR_OXFORD_BLUE,
  COLOR_PALE_SKY,
  CURRENCY,
  LANGUAGE,
  TIME,
} from "@/constants/constants";
import { HiOutlineGlobe } from "react-icons/hi";
import TimezoneSelect from "react-timezone-select";

const Preferences = () => {
  return (
    <>
      <CardContent className="space-y-6 p-0">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Language & Region */}
          <Card className="h- p-[24px]">
            <CardHeader className="p-0">
              <div className="flex items-center gap-2">
                <HiOutlineGlobe className="w-5 h-5" />
                <CardTitle
                  className="text-[18px] font-bold"
                  style={{ color: COLOR_EBONY }}
                >
                  Language & Region
                </CardTitle>
              </div>
              <CardDescription
                className="text-[14px]"
                style={{ color: COLOR_PALE_SKY }}
              >
                Set your language and regional preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="grid gap-[16px]">
                <div className="flex flex-col gap-1 w-full">
                  <Label
                    htmlFor="default_language"
                    className="text-[14px] font-semiBold"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Default Language
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="default_language"
                      className="w-full border text-black data-[placeholder]:text-gray-400 text-[14px]"
                      style={{ borderColor: COLOR_LIGHT_SILVER }}
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
                <div>
                  <Label
                    htmlFor="timezone"
                    className="text-[14px]"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Time Zone
                  </Label>
                  <TimezoneSelect
                    className="h-[34px] rounded-[6px] mt-1 text-black"
                    id="time_zone"
                    name="time_zone"
                    value={""}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: "30px",
                        cursor: "pointer",
                        borderColor: COLOR_LIGHT_SILVER,
                        borderRadius: "6px",
                        fontSize: "14px",
                        color: "black",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: COLOR_LIGHT_SILVER,
                        },
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: "black",
                        cursor: "pointer",
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        cursor: "pointer",
                        backgroundColor: state.isFocused ? "#f3f4f6" : "white",
                        color: "black",
                      }),
                    }}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="dateformat"
                    className="text-[14px]"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Date Format
                  </Label>
                  <Input
                    type="text"
                    id="dateformat"
                    placeholder="Format"
                    className="h-[36px] rounded-[6px] mt-1 text-black"
                    style={{
                      borderColor: COLOR_LIGHT_SILVER,
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <Label
                    htmlFor="default_currency"
                    className="text-[14px] font-semiBold"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Default Currency
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="default_currency"
                      className="w-full border border-gray-400 text-black data-[placeholder]:text-gray-400 text-[14px]"
                      style={{ borderColor: COLOR_LIGHT_SILVER }}
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Settings */}
          <Card className="h-full p-[24px]">
            <CardHeader className="p-0">
              <div className="flex items-center gap-2">
                <LuCalendarMinus2 className="w-5 h-5" />
                <CardTitle
                  className="text-[18px] font-bold"
                  style={{ color: COLOR_EBONY }}
                >
                  Operational Settings
                </CardTitle>
              </div>
              <CardDescription
                className="text-[14px]"
                style={{ color: COLOR_PALE_SKY }}
              >
                Configure your property management defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="grid gap-[16px]">
                <div className="flex flex-col gap-1 w-full">
                  <Label
                    htmlFor="default_check_out_time"
                    className="text-[14px] font-semiBold"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Default Check-in Time
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="default_check_out_time"
                      className="h-[40px] w-full border text-black data-[placeholder]:text-gray-400 text-[14px]"
                      style={{ borderColor: COLOR_LIGHT_SILVER }}
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
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <Label
                    htmlFor="default_check_out_time"
                    className="text-[14px] font-semiBold"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Default Check-out Time
                  </Label>
                  <Select>
                    <SelectTrigger
                      id="default_check_out_time"
                      className="h-[40px] w-full border text-black data-[placeholder]:text-gray-400 text-[14px]"
                      style={{ borderColor: COLOR_LIGHT_SILVER }}
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
                </div>
                <div>
                  <Label
                    htmlFor="bookingwindow"
                    className="text-[14px]"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Booking Window
                  </Label>
                  <Input
                    id="bookingwindow"
                    defaultValue="1 week in advance"
                    className="h-[36px] rounded-[6px] mt-1 text-black"
                    style={{
                      borderColor: COLOR_LIGHT_SILVER,
                      fontSize: "14px",
                    }}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="cancellation"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    Cancellation Policy
                  </Label>
                  <Input
                    id="cancellation"
                    defaultValue="Moderate (5 days)"
                    className="h-[36px] rounded-[6px] mt-1 text-black"
                    style={{
                      borderColor: COLOR_LIGHT_SILVER,
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Display Preferences */}
        <Card className="h-full p-4 sm:p-6 md:p-[24px]">
          <CardHeader className="p-0 space-y-2">
            <div className="flex items-center sm:flex-row sm:items-center gap-2">
              <TbBulb className="w-5 h-5 shrink-0" />
              <CardTitle
                className="text-[16px] sm:text-[18px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                Display Preferences
              </CardTitle>
            </div>
            <CardDescription
              className="text-[13px] sm:text-[14px] ms-0.5"
              style={{ color: COLOR_PALE_SKY }}
            >
              Customize your interface and display options
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-6 sm:space-y-[33px] mt-4">
            {/* Dark Mode */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="darkMode"
                  className="text-[15px] sm:text-[16px] font-medium"
                  style={{ color: COLOR_EBONY }}
                >
                  Dark Mode
                </Label>
                <p
                  className="text-[13px] sm:text-[13.78px]"
                  style={{ color: COLOR_PALE_SKY }}
                >
                  Enable dark theme across the platform
                </p>
              </div>
              <Switch
                className="self-start sm:self-auto data-[state=unchecked]:bg-[#D1D5DB] data-[state=checked]:bg-[#2563EB]"
                id="darkMode"
              />
            </div>

            {/* Compact View */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="compactView"
                  className="text-[15px] sm:text-[16px] font-medium"
                  style={{ color: COLOR_EBONY }}
                >
                  Compact View
                </Label>
                <p
                  className="text-[13px] sm:text-[13.78px]"
                  style={{ color: COLOR_PALE_SKY }}
                >
                  Reduce spacing for more condensed layout
                </p>
              </div>
              <Switch
                className="self-start sm:self-auto data-[state=unchecked]:bg-[#D1D5DB] data-[state=checked]:bg-[#2563EB]"
                id="compactView"
              />
            </div>

            {/* Show Property Images */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="showPropertyImages"
                  className="text-[15px] sm:text-[16px] font-medium"
                  style={{ color: COLOR_EBONY }}
                >
                  Show Property Images
                </Label>
                <p
                  className="text-[13px] sm:text-[13.78px]"
                  style={{ color: COLOR_PALE_SKY }}
                >
                  Display images in the property list
                </p>
              </div>
              <Switch
                className="self-start sm:self-auto data-[state=unchecked]:bg-[#D1D5DB] data-[state=checked]:bg-[#2563EB]"
                id="showPropertyImages"
                defaultChecked
              />
            </div>

            {/* Auto-refresh Dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="autoRefreshDashboard"
                  className="text-[15px] sm:text-[16px] font-medium"
                  style={{ color: COLOR_EBONY }}
                >
                  Auto-refresh Dashboard
                </Label>
                <p
                  className="text-[13px] sm:text-[13.78px]"
                  style={{ color: COLOR_PALE_SKY }}
                >
                  Automatically update dashboard data
                </p>
              </div>
              <Switch
                className="self-start sm:self-auto data-[state=unchecked]:bg-[#D1D5DB] data-[state=checked]:bg-[#2563EB]"
                id="autoRefreshDashboard"
                defaultChecked
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card className="h-full p-4 sm:p-6 md:p-[24px]">
          <CardHeader className="p-0 space-y-2">
            <div className="flex items-center sm:flex-row sm:items-center gap-2">
              <GiSettingsKnobs className="w-5 h-5 mt-0.5 shrink-0" />
              <CardTitle
                className="text-[16px] sm:text-[18px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                Advanced Settings
              </CardTitle>
            </div>
            <CardDescription
              className="text-[13px] sm:text-[14px]"
              style={{ color: COLOR_PALE_SKY }}
            >
              Configure advanced system preferences
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-6 sm:space-y-[33px] mt-4">
            {/* Email Digest Frequency */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Label
                htmlFor="emailDigest"
                className="text-[15px] sm:text-[16px] font-medium"
                style={{ color: COLOR_EBONY }}
              >
                Email Digest Frequency
              </Label>
              <Select defaultValue="daily">
                <SelectTrigger
                  className="w-full sm:w-[220px] cursor-pointer bg-white border rounded-md px-3 py-2"
                  style={{ borderColor: COLOR_LIGHT_SILVER }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem
                    value="daily"
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                  >
                    Daily
                  </SelectItem>
                  <SelectItem
                    value="weekly"
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                  >
                    Weekly
                  </SelectItem>
                  <SelectItem
                    value="monthly"
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                  >
                    Monthly
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Export Format */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Label
                htmlFor="dataExport"
                className="text-[15px] sm:text-[16px] font-medium"
                style={{ color: COLOR_EBONY }}
              >
                Data Export Format
              </Label>
              <Select defaultValue="csv">
                <SelectTrigger
                  className="w-full sm:w-[220px] cursor-pointer rounded-md bg-white border px-3 py-2"
                  style={{ borderColor: COLOR_LIGHT_SILVER }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem
                    value="csv"
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                  >
                    CSV
                  </SelectItem>
                  <SelectItem
                    value="xlsx"
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                  >
                    XLSX
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Session Timeout */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Label
                htmlFor="sessionTimeout"
                className="text-[15px] sm:text-[16px] font-medium"
                style={{ color: COLOR_EBONY }}
              >
                Session Timeout
              </Label>
              <Select defaultValue="30min">
                <SelectTrigger
                  className="w-full sm:w-[220px] cursor-pointer rounded-md bg-white border px-3 py-2"
                  style={{ borderColor: COLOR_LIGHT_SILVER }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem
                    value="30min"
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                  >
                    30 Minutes
                  </SelectItem>
                  <SelectItem
                    value="1h"
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                  >
                    1 Hour
                  </SelectItem>
                  <SelectItem
                    value="2h"
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                  >
                    2 Hours
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            className="btn text-[14px] w-full sm:w-auto min-w-[120px]"
          >
            <TbDeviceFloppy  size={16} />
              Save Preferences
          </Button>
        </div>
      </CardContent>
    </>
  );
};

export default Preferences;
