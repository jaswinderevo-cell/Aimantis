import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { BsPhone } from "react-icons/bs";
import { FaArrowDownLong } from "react-icons/fa6";
import { LuCalendarMinus2 } from "react-icons/lu";
import { MdOutlinePayments } from "react-icons/md";
import { PiStar } from "react-icons/pi";
import { TbDeviceFloppy, TbMail, TbSettings } from "react-icons/tb";

import { Switch } from "@/components/ui/Switch";
import {
  COLOR_ATHENS_GRAY,
  COLOR_EBONY,
  COLOR_OXFORD_BLUE,
  COLOR_PALE_SKY,
} from "@/constants/constants";
import { MessageCircleMore } from "lucide-react";
import { useState } from "react";
import { TbBuilding } from "react-icons/tb";

const getInitialMethods = () => [
  {
    label: "Email",
    desc: "Receive notifications via email",
    checked: true,
    icon: TbMail,
  },
  {
    label: "Push Notifications",
    desc: "Receive push alerts in your app",
    checked: true,
    icon: BsPhone,
  },
  {
    label: "SMS",
    desc: "Text message notifications",
    checked: false,
    icon: MessageCircleMore,
  },
];

const getInitialSampleData = () => [
  {
    category: "Booking & Reservations",
    icon: <LuCalendarMinus2 />,
    options: [
      {
        label: "New Bookings",
        desc: "Notify me when a new booking is created",
        checked: true,
      },
      {
        label: "Booking Confirmations",
        desc: "Booking has been confirmed",
        checked: true,
      },
      {
        label: "Cancellations",
        desc: "Notify me when a booking is cancelled",
        checked: true,
      },
    ],
  },
  {
    category: "Payments & Billing",
    icon: <MdOutlinePayments />,
    options: [
      {
        label: "Payment Received",
        desc: "A payment has been received",
        checked: true,
      },
      {
        label: "Payment Failed",
        desc: "Notify me if a payment is unsuccessful",
        checked: false,
      },
      {
        label: "Invoice Downloaded",
        desc: "User downloaded an invoice",
        checked: false,
      },
    ],
  },
  {
    category: "Property Management",
    icon: <TbBuilding />,
    options: [
      {
        label: "Payment Received",
        desc: "Notifications when payments are received",
        checked: true,
      },
      {
        label: "Payment Failed",
        desc: "Alerts for failed payment attempts",
        checked: true,
      },
      {
        label: "Invoice Generated",
        desc: "Notifications when new invoices are created",
        checked: true,
      },
    ],
  },
  {
    category: "Marketing & Updates",
    icon: <PiStar />,
    options: [
      {
        label: "Feature Updates",
        desc: "Product feature releases & platform changes",
        checked: false,
      },
      {
        label: "Newsletter",
        desc: "Monthly news & tips",
        checked: false,
      },
      {
        label: "Promotional Offers",
        desc: "Occasional promotional campaigns",
        checked: false,
      },
    ],
  },
];

const NotificationsTab = () => {
  const [methods, setMethods] = useState(getInitialMethods);
  const [sampleData, setSampleData] = useState(getInitialSampleData);

  const handleResetValues = () => {
    setMethods(getInitialMethods());
    setSampleData(getInitialSampleData());
  };

  return (
    <>
      {/* Notification Methods */}
      <Card className="p-4 sm:p-6 md:p-[24px]">
        <CardHeader className="p-0 space-y-2">
          <div className="flex items-center sm:flex-row sm:items-center sm:gap-2 gap-1">
            <FaArrowDownLong
              className="w-5 h-5 shrink-0"
              style={{ color: COLOR_EBONY }}
            />
            <CardTitle
              className="text-[16px] sm:text-[18px] font-bold"
              style={{ color: COLOR_EBONY }}
            >
              Notification Methods
            </CardTitle>
          </div>
          <CardDescription
            className="text-[13px] sm:text-[13.89px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 mt-4">
          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {methods.map((method, idx) => {
              const Icon = method.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border rounded-[8px] p-4 sm:p-[17px] gap-3 sm:gap-0"
                >
                  {/* Left Side (Icon + Text) */}
                  <div className="flex-1">
                    <div
                      className="text-[15px] sm:text-[16px] flex items-center gap-2 font-medium"
                      style={{ color: COLOR_EBONY }}
                    >
                      <Icon size={18} /> {method.label}
                    </div>
                    <div
                      className="text-[13px] sm:text-[13.89px] mt-1"
                      style={{ color: COLOR_PALE_SKY }}
                    >
                      {method.desc}
                    </div>
                  </div>

                  {/* Right Side (Switch) */}
                  <div className="flex sm:block">
                    <Switch
                      className="data-[state=unchecked]:bg-[#D1D5DB] data-[state=checked]:bg-[#2563EB]"
                      checked={method.checked}
                      onCheckedChange={(val) => {
                        const updated = [...methods];
                        updated[idx].checked = val;
                        setMethods(updated);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="p-4 sm:p-6 md:p-[24px]">
        <CardHeader className="p-0 space-y-2">
          <div className="flex items-center sm:flex-row sm:items-center sm:gap-2 gap-1">
            <TbSettings
              className="w-5 h-5 shrink-0"
              style={{ color: COLOR_EBONY }}
            />
            <CardTitle
              className="text-[16px] sm:text-[18px] font-bold"
              style={{ color: COLOR_EBONY }}
            >
              Notification Preferences
            </CardTitle>
          </div>
          <CardDescription
            className="text-[13px] sm:text-[13.89px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Select which notifications to receive by category
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-[16px] p-0 mt-4">
          {sampleData.map((section, index) => (
            <div
              key={index}
              className="space-y-4 p-4 sm:p-[24px] rounded-xl"
              style={{ backgroundColor: COLOR_ATHENS_GRAY }}
            >
              <Label
                className="text-[15px] sm:text-[16px] font-bold flex items-center gap-2"
                style={{ color: COLOR_EBONY }}
              >
                {section.icon}
                {section.category}
              </Label>

              {section.options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0"
                >
                  {/* Text */}
                  <div className={`${idx === 1 ? "my-2 sm:my-7" : "my-0"}`}>
                    <div className="text-[15px] sm:text-[15.88px] font-medium">
                      {opt.label}
                    </div>
                    <div
                      className="text-[13px] sm:text-[14px]"
                      style={{ color: COLOR_PALE_SKY }}
                    >
                      {opt.desc}
                    </div>
                  </div>

                  {/* Switch aligned right on larger screens */}
                  <div className="flex sm:block">
                    <Switch
                      className="data-[state=unchecked]:bg-[#D1D5DB] data-[state=checked]:bg-[#2563EB]"
                      checked={opt.checked}
                      onCheckedChange={(val) => {
                        const updated = [...sampleData];
                        updated[index].options[idx].checked = val;
                        setSampleData(updated);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex flex-col md:flex-row justify-start gap-3 sm:gap-5 items-stretch sm:items-center mt-4">
          <Button
            type="submit"
            className="btn text-[14px] w-full sm:w-auto min-w-[120px]"
          >
            <TbDeviceFloppy size={16} />
            Save Preferences
          </Button>
          <Button
            onClick={handleResetValues}
            variant="ghost"
            className="text-[13px] sm:text-[13.45px] font-medium bg-gray-100 hover:bg-gray-200 w-full sm:w-auto min-w-[120px]"
            style={{ color: COLOR_OXFORD_BLUE }}
          >
            Reset to Default
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default NotificationsTab;
