"use client";

import { COLOR_LIGHT_GRAY } from "@/constants/constants";
import React from "react";
import { Label } from "./ui/Label";

type NumberCounterProps = {
  label: string;
  value: number;
  onChange: (newVal: number) => void;
  min?: number;
  name?: string;
  error?: React.ReactNode;
  labelColor?: string;
  borderColor?: string;
  disabled?: boolean;
};

const NumberCounter: React.FC<NumberCounterProps> = ({
  label,
  value,
  onChange,
  min = 0,
  name = "",
  error,
  labelColor = COLOR_LIGHT_GRAY,
  borderColor,
  disabled,
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium" style={{ color: labelColor }}>
        {label}
      </Label>
      <div
        className="flex items-center border h-[38px] px-2 rounded-md"
        style={{ borderColor: borderColor }}
      >
        <button
          type="button"
          className="w-8 h-8 text-black text-xl disabled:text-gray-400 flex items-center justify-center hover:bg-gray-50"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min || disabled}
        >
          −
        </button>
        <span className="px-4 py-2 text-[14px] text-black text-center min-w-[84%]">
          {value} {name}
        </span>
        <button
          type="button"
          className="w-8 h-8 text-black text-xl disabled:text-gray-400 flex items-center justify-center hover:bg-gray-50"
          onClick={() => onChange(value + 1)}
          disabled={disabled}
        >
          +
        </button>
      </div>
      {error}
    </div>
  );
};

export default NumberCounter;
