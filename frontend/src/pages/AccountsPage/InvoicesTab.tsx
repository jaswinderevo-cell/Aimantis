import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { FileText } from "lucide-react";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { PiFileArrowDown } from "react-icons/pi";

import {
  COLOR_ATHENS_GRAY,
  COLOR_EBONY,
  COLOR_LIGHT_GREEN,
  COLOR_OXFORD_BLUE,
  COLOR_PALE_SKY,
} from "@/constants/constants";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

const invoices = [
  { label: "Total Invoices", value: "24" },
  { label: "Total Amount", value: "€2,376.00" },
  { label: "Paid This Year", value: "€1,188.00" },
  { label: "Outstanding", value: "€0.00" },
];

const invoiceList = [
  {
    id: "INV-2024-003",
    date: "March 15, 2024",
    amount: "€99.00",
    status: "Paid",
  },
  {
    id: "INV-2024-002",
    date: "February 15, 2024",
    amount: "€99.00",
    status: "Paid",
  },
  {
    id: "INV-2024-001",
    date: "January 15, 2024",
    amount: "€99.00",
    status: "Paid",
  },
  {
    id: "INV-2023-012",
    date: "December 15, 2023",
    amount: "€99.00",
    status: "Paid",
  },
  {
    id: "INV-2023-011",
    date: "November 15, 2023",
    amount: "€99.00",
    status: "Paid",
  },
];

const InvoicesTab = () => {
  return (
    <>
      {/* Stats Section */}
      <div className="overflow-x-auto scr pb-2 scrollbar-hidden">
        <div className="flex gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 scrollbar-hidden">
          {invoices.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-4 shadow rounded-md min-w-[170px] lg:min-w-[220px] flex-shrink-0"
              style={{ borderColor: COLOR_ATHENS_GRAY }}
            >
              <div className="text-[13.78px]" style={{ color: COLOR_PALE_SKY }}>
                {stat.label}
              </div>
              <div
                className="text-[23.25px] font-bold"
                style={{ color: COLOR_EBONY }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice History Table */}
      <Card style={{ borderColor: COLOR_ATHENS_GRAY }} className="p-[24px]">
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: COLOR_EBONY }} />
            <CardTitle
              className="text-base text-[18px] font-bold"
              style={{ color: COLOR_EBONY }}
            >
              Invoice History
            </CardTitle>
          </div>

          <CardDescription
            className="p-0 text-[14px]"
            style={{ color: COLOR_PALE_SKY }}
          >
            Download and view your past invoices
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 space-y-[16px]">
          {/* Filter Row */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-col">
              <Label
                htmlFor="year"
                className="text-[14px] font-medium mb-1"
                style={{ color: COLOR_OXFORD_BLUE }}
              >
                Year
              </Label>
              <Select>
                <SelectTrigger
                  id="year"
                  className="w-[120px] bg-white border-gray-300 text-xs md:text-[14px] rounded-[6px] px-3 py-2"
                >
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                    value="2024"
                  >
                    2024
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                    value="2023"
                  >
                    2023
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-col">
              <Label
                htmlFor="status"
                className="text-[14px] font-medium mb-1"
                style={{ color: COLOR_OXFORD_BLUE }}
              >
                Status
              </Label>
              <Select>
                <SelectTrigger
                  id="status"
                  className="w-[120px] text-xs border-gray-300 md:text-[14px] rounded-[6px] px-3 py-2"
                >
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                    value="all"
                  >
                    All Status
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                    value="paid"
                  >
                    Paid
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer data-[highlighted]:bg-gray-100"
                    value="unpaid"
                  >
                    Unpaid
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-col">
              <p
                className="text-[14px] font-medium mb-1"
                style={{ color: COLOR_OXFORD_BLUE }}
              >
                Search
              </p>
              <input
                type="text"
                placeholder="Invoice number..."
                className="border rounded-[6px] px-3 py-1.5 w-full sm:w-auto"
                style={{ fontSize: "13px" }}
              />
            </div>
          </div>

          {/* Invoice List */}
          {invoiceList.map((invoice, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded-md px-4 py-3 gap-3 sm:gap-0"
            >
              {/* Left Section (ID + Date) */}
              <div>
                <div
                  className="font-medium text-[15.75px]"
                  style={{ color: COLOR_EBONY }}
                >
                  {invoice.id}
                </div>
                <div className="text-[14px]" style={{ color: COLOR_PALE_SKY }}>
                  {invoice.date}
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-[33.43px] gap-3 w-full sm:w-auto">
                {/* Amount + Status */}
                <div className="flex sm:flex-col items-start sm:items-center gap-2 sm:gap-[4px]">
                  <div className="font-semibold text-sm">{invoice.amount}</div>
                  <span
                    className="text-[12px] font-medium rounded-full px-3 py-1"
                    style={{
                      backgroundColor: COLOR_LIGHT_GREEN,
                      color: "#166534",
                    }}
                  >
                    {invoice.status}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 sm:gap-6">
                  <button
                    className="text-[12.8px] flex items-center gap-2"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    <MdOutlineRemoveRedEye
                      size={14}
                      style={{ color: COLOR_OXFORD_BLUE }}
                    />
                    View
                  </button>
                  <button
                    className="text-[12.8px] flex items-center gap-2"
                    style={{ color: COLOR_OXFORD_BLUE }}
                  >
                    <PiFileArrowDown
                      size={14}
                      style={{ color: COLOR_OXFORD_BLUE }}
                    />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export default InvoicesTab;
