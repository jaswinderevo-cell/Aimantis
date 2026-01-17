import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { useEffect, useState } from "react";
import { CalendarWrapper } from "./CalendarWrapper";

interface CalendarProps {
  selectedType: string | null;
  visibleDateCount?: number;
  searchTerm: string;
  selectedPropertyTypeId: number;
  selectedStructureId: number;
}

const FrontDesk: React.FC<CalendarProps> = ({
  selectedType,
  visibleDateCount = 10,
  searchTerm,
  selectedStructureId,
  selectedPropertyTypeId,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dateOffset, setDateOffset] = useState(0);
  const [dateDirection, setDateDirection] = useState<"left" | "right">("right");
  const [responsiveCount, setResponsiveCount] = useState(visibleDateCount);

  const allDates = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  //always wisible the current date on the first render
  useEffect(() => {
    const today = new Date();

    const todayIndex = allDates.findIndex(
      (d) => d.toDateString() === today.toDateString(),
    );

    if (todayIndex === -1) {
      setDateOffset(0);
      return;
    }

    let start = todayIndex;

    if (start + responsiveCount > totalDays) {
      start = totalDays - responsiveCount;
    }

    if (start < 0) start = 0;

    setDateOffset(start);
  }, [currentMonth, responsiveCount]);

  const visibleDates = allDates.slice(dateOffset, dateOffset + responsiveCount);

  const totalDays = allDates.length;

  const showPrevDate = () => {
    if (dateOffset > 0) {
      setDateDirection("left");
      setDateOffset(dateOffset - 1);
    } else {
      const prevMonth = addMonths(currentMonth, -1);
      setCurrentMonth(prevMonth);

      const prevMonthDates = eachDayOfInterval({
        start: startOfMonth(prevMonth),
        end: endOfMonth(prevMonth),
      });

      const lastOffset = Math.max(0, prevMonthDates.length - responsiveCount);

      setDateOffset(lastOffset);
      setDateDirection("left");
    }
  };

  const showNextDate = () => {
    if (dateOffset + responsiveCount < totalDays) {
      setDateDirection("right");
      setDateOffset(dateOffset + 1);
    } else {
      const nextMonth = addMonths(currentMonth, 1);
      setCurrentMonth(nextMonth);
      setDateOffset(0);
      setDateDirection("right");
    }
  };

  const handleMonthChange = (month: Date) => {
    setCurrentMonth(month);
    setDateOffset(0);
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setResponsiveCount(4);
      } else {
        setResponsiveCount(visibleDateCount);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [visibleDateCount]);

  return (
    <div className="bg-white py-5 my-5 pb-40 overflow-x-hidden">
      <div className="w-full">
        <CalendarWrapper
          allDates={allDates}
          selectedPropertyTypeId={selectedPropertyTypeId}
          selectedStructureId={selectedStructureId}
          selectedType={selectedType}
          visibleDates={visibleDates}
          currentMonth={currentMonth}
          onSelectMonth={handleMonthChange}
          dateOffset={dateOffset}
          onPrevDate={showPrevDate}
          onNextDate={showNextDate}
          direction={dateDirection}
          totalDays={totalDays}
          showRoomGrid={true}
          showPricingGrid={false}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
};

export default FrontDesk;
