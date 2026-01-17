import { useState, useRef, useEffect } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

interface OptionItem {
  value: number | string;
  label: string;
}

interface CustomSelectProps {
  value: number | string | null;
  options: OptionItem[];
  onChange: (value: number | string) => void;
  error?: React.ReactNode;
}

export default function CustomSelect({
  value,
  options,
  onChange,
  error,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => String(o.value) === String(value));

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }  

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative w-full">
        <button
          type="button"
          className={`w-full h-10 border rounded-md px-3 pr-10 text-left flex items-center ${
            open ? "border-gray-600" : "border-gray-300"
          }`}
          onClick={() => setOpen((p) => !p)}
        >
          {selected ? selected.label : "Select room"}
        </button>

        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <MdKeyboardArrowDown size={20} />
        </div>
      </div>

      {open && (
        <div className="absolute z-20 bg-white shadow-md rounded-md w-full py-1 max-h-60 overflow-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-start text-red-500 text-[12px] min-h-6">{error}</p>
      )}
    </div>
  );
}
