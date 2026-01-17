import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { RoomBookingGrid } from "@/components/RoomBookingsGrid";
import { RoomPricingGrid } from "./RoomsPricingGrid";
import DateCarousel from "./MonthAndDates/DatesCarousel";
import MonthCarousel from "./MonthAndDates/MonthCarousel";

interface CalendarWrapperProps {
  allDates: Date[];
  visibleDates: Date[];
  currentMonth: Date;
  onSelectMonth: (month: Date) => void;
  dateOffset: number;
  onPrevDate: () => void;
  onNextDate: () => void;
  direction: "left" | "right";
  totalDays: number;
  showRoomGrid: boolean;
  showPricingGrid: boolean;
  selectedType: string | null;
  selectedPropertyTypeId: number;
  selectedStructureId: number;
  searchTerm: string;
  cellsWidth?: number;
}

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({
  allDates,
  visibleDates,
  currentMonth,
  onSelectMonth,
  dateOffset,
  onPrevDate,
  onNextDate,
  direction,
  totalDays,
  showRoomGrid,
  showPricingGrid,
  selectedType,
  selectedPropertyTypeId,
  selectedStructureId,
  searchTerm,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dateHeaderScrollRef = useRef<HTMLDivElement>(null);
  const gridScrollRef = useRef<HTMLDivElement>(null);
  const [cellWidth, setCellWidth] = useState(80);

  // Sync scroll between date header and grid
  useEffect(() => {
    const dateHeader = dateHeaderScrollRef.current;
    const grid = gridScrollRef.current;

    if (!dateHeader || !grid) return;

    const isSyncing = false;

    const syncScroll = (source: HTMLElement, target: HTMLElement) => {
      if (!source.isConnected || !target.isConnected) return;
      target.scrollLeft = source.scrollLeft;
    };
    const handleDateHeaderScroll = () => {
      if (!grid || !grid.isConnected) return;
      syncScroll(dateHeader, grid);
    };

    const handleGridScroll = () => {
      if (!dateHeader || !dateHeader.isConnected) return;
      syncScroll(grid, dateHeader);
    };
    dateHeader.addEventListener("scroll", handleDateHeaderScroll);
    grid.addEventListener("scroll", handleGridScroll);

    return () => {
      dateHeader.removeEventListener("scroll", handleDateHeaderScroll);
      grid.removeEventListener("scroll", handleGridScroll);
    };
  }, [showRoomGrid, dateHeaderScrollRef, gridScrollRef]);

  useEffect(() => {
    const updateCellWidth = () => {
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

      if (isMobile) {
        // Fixed width for mobile to ensure proper scrolling
        setCellWidth(80);
      } else if (isTablet) {
        // Fixed width for tablet
        setCellWidth(90);
      } else {
        // Calculate width for desktop
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth;
          const sidebarWidth = 148;
          const extraSpacing = 80;

          const newWidth = Math.floor(
            (containerWidth - sidebarWidth - extraSpacing) / visibleDates.length,
          );

          setCellWidth((prev) =>
            newWidth > 60 && newWidth !== prev ? newWidth : prev,
          );
        }
      }
    };

    updateCellWidth();

    const resizeObserver = new ResizeObserver(updateCellWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateCellWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateCellWidth);
    };
  }, [visibleDates.length]);

  return (
    <div className="calendar-wrapper w-full" ref={containerRef}>
      {/* Month row */}
      <div className="w-full">
        <MonthCarousel
          visibleCount={7}
          cellWidth={cellWidth}
          initialMonth={currentMonth}
          onSelectMonth={onSelectMonth}
        />
      </div>

      {/* Dates row */}
      <div className="w-full">
        <DateCarousel
          visibleDates={visibleDates}
          dateOffset={dateOffset}
          onPrev={onPrevDate}
          onNext={onNextDate}
          direction={direction}
          totalDays={totalDays}
          cellWidth={cellWidth}
          scrollRef={dateHeaderScrollRef}
        />
      </div>

      {/* Room bookings */}
      {showRoomGrid && (
        <RoomBookingGrid
          allDates={allDates}
          dateOffset={dateOffset}
          visibleDates={visibleDates}
          cellWidth={cellWidth}
          selectedMonth={format(currentMonth, "yyyy-MM")}
          selectedType={selectedType}
          searchTerm={searchTerm}
          selectedPropertyTypeId={selectedPropertyTypeId}
          selectedStructureId={selectedStructureId}
          scrollRef={gridScrollRef}
        />
      )}

      {showPricingGrid && (
        <RoomPricingGrid
          allDates={allDates}
          visibleDates={visibleDates}
          dateOffset={dateOffset}
          direction={direction}
          cellWidth={cellWidth}
          selectedMonth={format(currentMonth, "yyyy-MM")}
          selectedPropertyTypeId={selectedPropertyTypeId}
          selectedStructureId={selectedStructureId}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
};
