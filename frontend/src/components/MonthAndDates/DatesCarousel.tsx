import { slideVariants } from "@/utils/animation";
import { useScrollAndSwipeNavigation } from "@/utils/scrollMonths&DatesHook";
import { format } from "date-fns";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { COLOR_DARK_RED, COLOR_LIGHT_BLUE } from "@/constants/constants";

interface DateCarouselProps {
  visibleDates: Date[];
  dateOffset: number;
  onPrev: () => void;
  onNext: () => void;
  direction: "left" | "right";
  totalDays: number;
  cellWidth: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export default function DateCarousel({
  visibleDates,
  dateOffset,
  onPrev,
  onNext,
  direction,
  totalDays,
  cellWidth,
  scrollRef,
}: DateCarouselProps) {
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = scrollRef || internalScrollRef;

  useScrollAndSwipeNavigation({
    containerRef: scrollContainerRef,
    cellWidth,
    onNext,
    onPrev,
  });

  return (
    <div className="mt-5 flex w-full items-stretch">
      {/* Left arrow - matches property name column width exactly */}
      <div
        className="dates-l-arrow flex justify-center items-center lg:w-[148px] md:w-[97px] w-[70px] flex-shrink-0 border-r bg-white"
        style={{ borderColor: COLOR_LIGHT_BLUE }}
      >
        <button
          onClick={onPrev}
          className="px-0 disabled:opacity-50 hover:bg-gray-100 rounded-md p-1"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Date cells - scrollable area */}
      <div
        className="flex-1 overflow-x-auto overflow-y-hidden"
        ref={scrollContainerRef}
      >
        <div className="relative" style={{ minWidth: "max-content" }}>
          <div className="flex items-stretch">
            {visibleDates.map((day) => {
              const dayOfWeek = day.getDay();
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const isToday =
                format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              return (
                <div
                  key={day.toString()}
                  className={`dates-container flex items-center justify-center border-b flex-shrink-0 ${
                    isToday ? "bg-red-100" : "bg-white"
                  }`}
                  style={{
                    minWidth: cellWidth,
                    width: cellWidth,
                    height: 53.3,
                    borderColor: isToday ? COLOR_DARK_RED : COLOR_LIGHT_BLUE,
                  }}
                >
                  <button
                    disabled
                    className={`date-button cursor-default font-medium flex flex-col items-center justify-center w-full h-full
                      ${isToday ? "text-red-800" : isWeekend ? "text-blue-600" : "text-black"}
                    `}
                  >
                    <span className="text-sm sm:text-[15px]">
                      {format(day, "d")}
                    </span>
                    {isToday ? (
                      <span className="hidden sm:block text-xs font-medium">
                        Today
                      </span>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right arrow */}
      <div
        className="pe-2 md:pe-0 flex-shrink-0 flex items-center justify-center bg-white border-l"
        style={{ borderColor: COLOR_LIGHT_BLUE }}
      >
        <button
          onClick={onNext}
          className="disabled:opacity-50 hover:bg-gray-100 rounded-md p-1"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
