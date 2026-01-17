import { COLOR_DARK_RED, OptionType } from "@/constants/constants";
import React from "react";
import Select, { MultiValue } from "react-select";

interface MultiSelectDropdownProps {
  name: string;
  value: OptionType[];
  onChange: (selected: OptionType[]) => void;
  options: OptionType[];
  placeholder?: string;
  onBlur?: <T = Element>(e: React.FocusEvent<T>) => void;
  borderColor?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder,
  borderColor = "#d1d5dc",
}) => {
  const handleChange = (selected: MultiValue<OptionType>) => {
    onChange([...selected]);
  };

  return (
    <div className="w-full">
      <Select
        isMulti
        options={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="text-sm"
        closeMenuOnSelect={false}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: borderColor,
            borderRadius: "5px",
            fontSize: "17px",
            color: "black",
            boxShadow: "none",
            minHeight: "40px",
            height: "auto",
            "&:hover": {
              borderColor: "#000000",
              cursor: "pointer",
            },
            // padding: window.innerWidth < 640 ? "2px 4px" : "4px 8px",
          }),
          valueContainer: (base) => ({
            ...base,
            // padding: window.innerWidth < 640 ? "0 4px" : "0 8px",
            flexWrap: "wrap",
            gap: "4px",
            alignItems: "flex-start",
            minHeight: "32px",
          }),
          input: (base) => ({
            ...base,
            margin: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
          }),
          indicatorsContainer: (base) => ({
            ...base,
            alignItems: "flex-start",
            paddingTop: "4px",
          }),
          option: (base) => ({
            ...base,
            color: "#000000",
            fontSize: window.innerWidth < 640 ? "13px" : "17px",
            padding: window.innerWidth < 640 ? "8px 10px" : "10px 12px",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#e5e7eb",
            color: "#000000",
            fontSize: window.innerWidth < 640 ? "14px" : "16px",
            borderRadius: "4px",
            margin: "1px",
            maxWidth: window.innerWidth < 640 ? "100%" : "auto",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "#374151",
            padding: window.innerWidth < 640 ? "2px 4px" : "3px 6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: COLOR_DARK_RED,
            padding: window.innerWidth < 640 ? "2px" : "3px",
            ":hover": {
              backgroundColor: "#f3f4f6",
              color: "#111827",
            },
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: "#6a7282",
            padding: window.innerWidth < 640 ? "4px" : "8px",
            "&:hover": {
              color: "#4b5563",
            },
          }),
          clearIndicator: (provided) => ({
            ...provided,
            color: "#6a7282",
            padding: window.innerWidth < 640 ? "4px" : "8px",
            "&:hover": {
              color: "#4b5563",
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
            fontSize: window.innerWidth < 640 ? "15px" : "17px",
          }),
          menuList: (base) => ({
            ...base,
            maxHeight: window.innerWidth < 640 ? "200px" : "300px",
          }),
        }}
      />
    </div>
  );
};

export default MultiSelectDropdown;
