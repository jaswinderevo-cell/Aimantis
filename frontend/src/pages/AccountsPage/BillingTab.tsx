import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { LuCalculator } from "react-icons/lu";

import {
  COLOR_ATHENS_GRAY,
  COLOR_EBONY,
  COLOR_LIGHT_GREEN,
  COLOR_LIGHT_SILVER,
  COLOR_OXFORD_BLUE,
  COLOR_PALE_SKY,
  COLOR_ROYAL_BLUE,
} from "@/constants/constants";
import { Dock } from "lucide-react";
import {
  MdOutlinePayments,
} from "react-icons/md";

const BillingTab = () => {
  return (
    <>
      {/* Current Subscription */}
      <Card
        className="border border-[#e0eaff] p-[24px]"
        style={{ borderColor: COLOR_ATHENS_GRAY }}
      >
        <CardHeader className="p-0">
          <div className="flex items-center gap-2 mb-[28px]">
            <Dock className="w-5 h-5" />
            <CardTitle
              className="text-[18px] font-bold"
              style={{ color: COLOR_EBONY }}
            >
              Current Subscription
            </CardTitle>
          </div>

          {/* Plan info + badge aligned */}
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-[18px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                Professional Plan
              </p>
              <p className="text-[16px]" style={{ color: COLOR_PALE_SKY }}>
                Up to 100 properties
              </p>
            </div>

            <button
              className="text-[12px] font-medium text-center py-[4px] px-[12px] rounded-full"
              style={{
                color: "#166534",
                backgroundColor: COLOR_LIGHT_GREEN,
              }}
            >
              Active
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-y-[16px] text-sm">
            <div>
              <p
                className="text-[13.78px] mb-0.5"
                style={{ color: COLOR_PALE_SKY }}
              >
                Monthly Cost
              </p>
              <p
                className="text-[13.56px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                €99.00
              </p>
            </div>
            <div>
              <p
                className="text-[13.78px] mb-0.5"
                style={{ color: COLOR_PALE_SKY }}
              >
                Next Billing Date
              </p>
              <p
                className="text-[13.56px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                March 15, 2024
              </p>
            </div>
            <div>
              <p
                className="text-[13.78px] mb-0.5"
                style={{ color: COLOR_PALE_SKY }}
              >
                Properties Used
              </p>
              <p
                className="text-[13.56px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                47 / 100
              </p>
            </div>
            <div>
              <p
                className="text-[13.78px] mb-0.5"
                style={{ color: COLOR_PALE_SKY }}
              >
                Billing Cycle
              </p>
              <p
                className="text-[13.56px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                Monthly
              </p>
            </div>
          </div>

          <hr className="my-[16px]" style={{ borderColor:COLOR_LIGHT_SILVER }} />

          <div className="flex flex-wrap gap-[40px]">
            <button
              className="text-[13.45px] font-medium"
              style={{ color: COLOR_OXFORD_BLUE }}
            >
              Change Plan
            </button>
            <button
              className="text-[13.45px] font-medium"
              style={{ color: COLOR_OXFORD_BLUE }}
            >
              Switch to Annual
            </button>
            <button
              className="text-[13.45px] font-medium"
              style={{ color: COLOR_OXFORD_BLUE }}
            >
              Cancel Subscription
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="p-[24px]" style={{ borderColor: COLOR_ATHENS_GRAY }}>
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <MdOutlinePayments className="w-5 h-5" />
            <CardTitle
              className="text-[18px] font-bold"
              style={{ color: COLOR_EBONY }}
            >
              Payment Method
            </CardTitle>
          </div>
          <CardDescription
            className="text-[13.78px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Manage your billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-[16px]">
          <div className="space-y-[16px]">
            {/* VISA */}
            <div className="flex flex-col gap-3 md:flex-row items-center justify-between border rounded-md p-[17px]">

              <div className="flex items-center gap-[16px]">
                <button
                  className="font-bold text-[12px] text-white rounded-sm px-[10px] py-[7px] cursor-default"
                  style={{ backgroundColor: COLOR_ROYAL_BLUE }}
                >
                  VISA
                </button>
                <div className="text-sm">
                  <div
                    className="text-[16px] font-medium"
                    style={{ color: COLOR_EBONY }}
                  >
                    **** **** **** 4242
                  </div>
                  <div
                    className="text-[13.89px]"
                    style={{ color: COLOR_PALE_SKY }}
                  >
                    Expires 12/25
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-[40px]">
                <button
                  className="text-[12px] font-medium text-center py-[4px] px-[12px] rounded-full"
                  style={{
                    color: "#166534",
                    backgroundColor: COLOR_LIGHT_GREEN,
                  }}
                >
                  Primary
                </button>
                <button
                  className="text-[13.45px] font-medium"
                  style={{ color: COLOR_OXFORD_BLUE }}
                >
                  Edit
                </button>
              </div>

            </div>

            {/* Mastercard */}
            <div className="flex flex-col gap-3 md:flex-row items-center justify-between border rounded-md p-[17px]">
              <div className="flex items-center gap-[16px]">
                <button
                  className="font-bold text-[12px] text-white rounded-sm px-[14px] py-[7px] cursor-default"
                  style={{ backgroundColor: "#DC2626" }}
                >
                  MC
                </button>
                <div className="text-sm">
                  <div>**** **** **** 8888</div>
                  <div className="text-gray-500">Expires 02/26</div>
                </div>
              </div>
              <div className="flex items-center gap-[40px]">
                <button
                  className="text-[13.45px] font-medium"
                  style={{ color: COLOR_OXFORD_BLUE }}
                >
                  Set Primary
                </button>
                <button
                  className="text-[13.45px] font-medium"
                  style={{ color: COLOR_OXFORD_BLUE }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div>
            <button
              className="text-[13px] font-medium"
              style={{ color: COLOR_OXFORD_BLUE }}
            >
              + Add Payment Method
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card style={{ borderColor: COLOR_ATHENS_GRAY }} className="p-[24px]">
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <LuCalculator className="w-5 h-5" />
            <CardTitle
              className="text-base text-[18px] font-bold"
              style={{ color: COLOR_EBONY }}
            >
              Billing History
            </CardTitle>
          </div>
          <CardDescription
            className="text-[14px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Recent charges and payments
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-[16px]">
          {[
            {
              date: "March 15, 2024",
              plan: "Professional Plan - Monthly",
              amount: "€99.00",
            },
            {
              date: "February 15, 2024",
              plan: "Professional Plan - Monthly",
              amount: "€99.00",
            },
            {
              date: "January 15, 2024",
              plan: "Professional Plan - Monthly",
              amount: "€99.00",
            },
            {
              date: "December 15, 2023",
              plan: "Professional Plan - Monthly",
              amount: "€99.00",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border rounded-md p-[17px]"
            >
              <div>
                <div
                  className="text-[15.88px] font-medium"
                  style={{ color: COLOR_EBONY }}
                >
                  {item.date}
                </div>
                <div className="text-[14px]" style={{ color: COLOR_PALE_SKY }}>
                  {item.plan}
                </div>
              </div>
              <div
                className="text-[15.5px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                {item.amount}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default BillingTab;
