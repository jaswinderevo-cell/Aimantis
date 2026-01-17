import { useScrollAndSwipeNavigation } from "@/utils/scrollMonths&DatesHook";
import { addMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface MonthCarouselProps {
  visibleCount?: number;
  onSelectMonth?: (month: Date) => void;
  initialMonth: Date;
  cellWidth?: number;
}

const MonthCarousel: React.FC<MonthCarouselProps> = ({
  visibleCount = 7,
  onSelectMonth,
  initialMonth,
  cellWidth = 120,
}) => {
  const totalMonths = 12 * 6 + 1;
  const startMonth = addMonths(new Date(), -36);

  const allMonths = Array.from({ length: totalMonths }, (_, i) =>
    addMonths(startMonth, i),
  );

  const [direction, setDirection] = useState<"left" | "right">("right");
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [responsiveCount, setResponsiveCount] = useState(visibleCount);
  const [monthOffset, setMonthOffset] = useState(() => {
    // start centered on current month
    const today = new Date();
    const diffInMonths =
      (today.getFullYear() - startMonth.getFullYear()) * 12 +
      (today.getMonth() - startMonth.getMonth());
    return diffInMonths - Math.floor(visibleCount / 2);
  });

  const maxOffset = allMonths.length - responsiveCount;
  const boundedOffset = Math.max(0, Math.min(monthOffset, maxOffset));

  const visibleMonths = allMonths.slice(
    boundedOffset,
    boundedOffset + responsiveCount,
  );

  const handlePrev = () => {
    if (boundedOffset > 0) {
      setDirection("left");
      setMonthOffset((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (boundedOffset < maxOffset) {
      setDirection("right");
      setMonthOffset((prev) => Math.min(maxOffset, prev + 1));
    }
  };

  const handleSelectMonth = (month: Date) => {
    setCurrentMonth(month);
    onSelectMonth?.(month);
  };

  const getOffsetForMonth = (month: Date, count: number) => {
    const diffInMonths =
      (month.getFullYear() - startMonth.getFullYear()) * 12 +
      (month.getMonth() - startMonth.getMonth());

    return Math.max(0, diffInMonths - Math.floor(count / 2));
  };

  // responsive behavior
  useEffect(() => {
    const updateVisibleCount = () => {
      let nextCount = visibleCount;

      if (window.innerWidth < 640) {
        nextCount = 1;
      } else if (window.innerWidth < 1024) {
        nextCount = 3;
      }

      setResponsiveCount((prev) => {
        if (prev !== nextCount) {
          setMonthOffset(getOffsetForMonth(currentMonth, nextCount));
        }
        return nextCount;
      });
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [visibleCount, currentMonth]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useScrollAndSwipeNavigation({
    containerRef: scrollContainerRef,
    cellWidth,
    onNext: handlePrev,
    onPrev: handleNext,
  });

  return (
    <div className="flex items-center justify-between md:justify-normal lg:justify-normal w-full select-none">
      {/* left button */}
      <button
        onClick={handlePrev}
        disabled={boundedOffset === 0}
        className="ml-2 hover:bg-gray-100 disabled:opacity-50 rounded-md"
      >
        <ChevronLeft />
      </button>

      {/* carousel */}
      <div className="relative overflow-hidden flex-1">
        <div
          ref={scrollContainerRef}
          className="flex justify-center md:justify-evenly gap-3"
        >
          {visibleMonths.map((month) => (
            <button
              key={month.toISOString()}
              onClick={() => handleSelectMonth(month)}
              className={`text-[15px] font-medium flex items-center justify-center px-4 py-2 rounded-full transition-all duration-200 ${
                format(month, "MM-yyyy") === format(currentMonth, "MM-yyyy")
                  ? "border border-blue-500 text-blue-600 bg-blue-100"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
              style={{
                minWidth:
                  responsiveCount === 1
                    ? "160px"
                    : responsiveCount === 3
                      ? "140px"
                      : "120px",
              }}
            >
              {format(month, "MMM yy")}
            </button>
          ))}
        </div>
      </div>

      {/* right button */}
      <button
        onClick={handleNext}
        disabled={boundedOffset >= maxOffset}
        className="mr-2 hover:bg-gray-100 rounded-md disabled:opacity-50 transition"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default MonthCarousel;
