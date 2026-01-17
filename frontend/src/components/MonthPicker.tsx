import { Button } from "./ui/Button";

export function MonthPickerGrid({
  value,
  onChange,
}: {
  value: Date | undefined;
  onChange: (date: Date) => void;
}) {
  const currentYear = (value ?? new Date()).getFullYear();
  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(currentYear, i, 1),
  );

  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      {months.map((month) => {
        const isSelected =
          value &&
          value.getFullYear() === month.getFullYear() &&
          value.getMonth() === month.getMonth();

        return (
          <Button
            key={month.toISOString()}
            variant={isSelected ? "default" : "outline"}
            className="w-full hover:bg-gray-100"
            onClick={() => onChange(month)}
          >
            {month.toLocaleString("default", { month: "short" })}
          </Button>
        );
      })}
    </div>
  );
}
