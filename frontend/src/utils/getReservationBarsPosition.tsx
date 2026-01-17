interface GetVisibleBookingPositionArgs {
  startIndex: number;
  endIndex: number;
  dateOffset: number;
  visibleCount: number;
  cellWidth: number;
}

interface VisibleBookingPosition {
  left: number;
  width: number;
}

export function getVisibleReservationPosition(
  args: GetVisibleBookingPositionArgs,
): VisibleBookingPosition | null {
  const { startIndex, endIndex, dateOffset, visibleCount, cellWidth } = args;

  // Visible date window
  const visibleStart = dateOffset;
  const visibleEnd = dateOffset + visibleCount - 1;

  // Fully outside visible range → hide
  if (endIndex < visibleStart || startIndex > visibleEnd) {
    return null;
  }

  const left = (startIndex - dateOffset) * cellWidth + cellWidth / 2;
  // Width spans from check-in to check-out (not including check-out day itself)
  const width = (endIndex - startIndex) * cellWidth;

  return { left, width };
}
