import { Button } from "@/components/ui/Button";
import { useState } from "react";

type SharedButtonProps = {
  text: string;
  width?: string;
  height?: string;
  padding?: string;
  onClick?: () => void;
  bgColor?: string;
  color?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export const SharedButton = ({
  onClick,
  bgColor,
  text,
  width = "w-[142px]",
  height = "h-[40px]",
  padding = "px-[16px] py-[8px]",
  color = "text-white",
  disabled = false,
  type,
}: SharedButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${width} ${height} ${padding} text-[14px] font-medium bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors duration-200 ease-in-out`}
      style={{
        backgroundColor: isHovered ? "#1D4ED8" : bgColor,
        color: color,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </Button>
  );
};
