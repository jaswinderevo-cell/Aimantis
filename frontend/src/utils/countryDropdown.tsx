import React, { useMemo } from "react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

countries.registerLocale(enLocale);

interface CountrySelectProps {
  label?: string;
  htmlFor?: string;
  value: string;
  setFieldValue?: (field: string, value: string) => void;
  name?: string;
  onChange?: (value: string) => void;
  renderError?: (fieldName: string) => React.ReactNode;
  width?: string;
  height?: string;
  placeholder?: string;
  color?: string;
  margin?: string;
  borderColor?: string;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  label = "Select Country",
  htmlFor,
  value,
  setFieldValue,
  name,
  onChange,
  renderError,
  width = "100%",
  height = "40px",
  placeholder = "Select a country",
  color = "#1e293b",
  borderColor,
  margin,
}) => {
  const countryList = useMemo(() => {
    const names = countries.getNames("en", { select: "official" });
    return Object.entries(names).sort((a, b) => a[1].localeCompare(b[1]));
  }, []);

  const handleChange = (val: string) => {
    if (setFieldValue && name) {
      setFieldValue(name, val);
    } else if (onChange) {
      onChange(val);
    }
  };

  return (
    <div style={{ width }}>
      {label && (
        <Label
          htmlFor={htmlFor || name}
          className={`text-[14px] font-medium ${margin ? margin : "mb-2"} block`}
          style={{ color }}
        >
          {label}
        </Label>
      )}

      <Select value={value || ""} onValueChange={handleChange}>
        <SelectTrigger
          className="border border-gray-300 w-full rounded-md text-sm"
          style={{ height, borderColor: borderColor ? borderColor : "#d1d5dc" }}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="max-h-64 overflow-y-auto bg-white">
          {countryList.map(([code, name]) => (
            <SelectItem
              key={code}
              value={name}
              className="data-[highlighted]:bg-gray-100 cursor-pointer"
            >
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {renderError && name && renderError(name)}
    </div>
  );
};

export default CountrySelect;
