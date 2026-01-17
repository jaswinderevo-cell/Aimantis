import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";
import { useEffect, useState } from "react";
import { CalendarWrapper } from "./CalendarWrapper";

interface RatesProps {
  selectedPropertyTypeId: number;
  selectedStructureId: number;
  searchTerm: string;
  visibleDateCount?: number;
}
const Rates: React.FC<RatesProps> = ({
  selectedPropertyTypeId,
  selectedStructureId,
  searchTerm,
  visibleDateCount = 10,
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
    }
  };

  const showNextDate = () => {
    if (dateOffset + 10 < totalDays) {
      setDateDirection("right");
      setDateOffset(dateOffset + 1);
    }
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
    <CalendarWrapper
      selectedPropertyTypeId={selectedPropertyTypeId}
      selectedStructureId={selectedStructureId}
      visibleDates={visibleDates}
      currentMonth={currentMonth}
      onSelectMonth={(month) => {
        setCurrentMonth(month);
        setDateOffset(0);
      }}
      dateOffset={dateOffset}
      onPrevDate={showPrevDate}
      onNextDate={showNextDate}
      direction={dateDirection}
      totalDays={totalDays}
      showRoomGrid={false}
      showPricingGrid={true}
      selectedType={null}
      searchTerm={searchTerm}
      allDates={allDates}
    />
  );
};

export default Rates;
