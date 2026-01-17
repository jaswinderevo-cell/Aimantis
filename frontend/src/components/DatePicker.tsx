"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Calendar } from "./ui/Calendar";
import { format } from "date-fns";
import { MonthPickerGrid } from "./MonthPicker";
import { COLOR_LIGHT_SILVER } from "@/constants/constants";

interface DatePickerProps {
  value: string | undefined;
  onChange: (date: string | undefined) => void;
  onBlur?: () => void;
  borderColor?: string;
  name?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  mode?: "date" | "month";
  disableDate?: (date: Date) => boolean;
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  name,
  width,
  height,
  backgroundColor,
  borderColor,
  mode = "date",
  disableDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined,
  );

  function formatDisplayDate(date: string | undefined) {
    if (!date) return "";
    const parsed = new Date(date);
    return mode === "month"
      ? format(parsed, "MMMM yyyy")
      : format(parsed, "MMMM dd, yyyy");
  }

  function handleSelect(date: Date | undefined) {
    if (!date) return;

    const formatted =
      mode === "month" ? format(date, "yyyy-MM") : format(date, "yyyy-MM-dd");

    onChange(formatted);
    setOpen(false);
  }

  return (
    <div className="relative flex gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              id={name}
              name={name}
              value={formatDisplayDate(value)}
              readOnly
              onClick={() => setOpen(true)}
              className={`${height ?? "h-[40px]"} pr-10 text-sm md:text-[14px] cursor-pointer`}
              style={{
                borderColor: borderColor ? borderColor : COLOR_LIGHT_SILVER,
                width: width ?? "100%",
                backgroundColor: backgroundColor ?? "white",
              }}
              onBlur={onBlur}
            />

            {!value && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {mode === "month" ? "June 2025" : "June 01, 2025"}
              </span>
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          {mode === "month" ? (
            <MonthPickerGrid
              value={value ? new Date(value) : undefined}
              onChange={handleSelect}
            />
          ) : (
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={handleSelect}
              disabled={disableDate}
            />
          )}
        </PopoverContent>
      </Popover>

      <Button
        id="date-picker"
        variant="ghost"
        onClick={() => setOpen(true)}
        className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
      >
        <CalendarIcon className="size-4" />
        <span className="sr-only">Select date</span>
      </Button>
    </div>
  );
}
