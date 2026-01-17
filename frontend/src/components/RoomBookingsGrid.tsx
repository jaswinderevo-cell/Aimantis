import {
  COLOR_BLUE,
  COLOR_DARK_RED,
  COLOR_LIGHT_BLUE,
} from "@/constants/constants";
import { ROUTES } from "@/constants/routes";
import {
  CreateBlockedDatesPayload,
  useGetBlockDates,
  useUnblockDates,
} from "@/services/blockDates";
import {
  BookingPayload,
  useDeleteBooking,
  useGetBookings,
} from "@/services/bookings";
import { PropertyPayload, useGetAllRooms } from "@/services/rooms";
import { StructurePayload, useGetStructures } from "@/services/structure";
import { getVisibleReservationPosition } from "@/utils/getReservationBarsPosition";
import { getBackgroundColor, getBackgroundColorLight } from "@/utils/helper";
import { IconX } from "@tabler/icons-react";
import { format } from "date-fns";
import { ChevronRight, Clock, Users } from "lucide-react";
import React, { useState } from "react";
import { SiExpedia } from "react-icons/si";
import { TbBrandAirbnb, TbBrandBooking, TbCurrencyEuro } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { CreateBooking } from "./Modals/CreateNewBooking";
import { EditBlockDatesModal } from "./Modals/EditDetailModals/EditBlockDatesModal";
import { FrontDeskDateCellModal } from "./Modals/FrontDeskDateCellModal";
import SplitBookingModal from "./Modals/SplitBookingModal";
import { Button } from "./ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";

interface RoomBookingGridProps {
  allDates: Date[];
  visibleDates: Date[];
  cellWidth: number;
  dateOffset: number;
  selectedMonth: string;
  selectedType: string | null;
  searchTerm: string;
  selectedPropertyTypeId: number;
  selectedStructureId: number;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export const RoomBookingGrid: React.FC<RoomBookingGridProps> = ({
  allDates,
  visibleDates,
  cellWidth,
  selectedMonth,
  dateOffset,
  selectedType,
  searchTerm,
  selectedPropertyTypeId,
  selectedStructureId,
  scrollRef,
}) => {
  const [isCellModalOpen, setIsCellModalOpen] = useState(false);
  const [activeCell, setActiveCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [selectedCellDate, setSelectedCellDate] = useState<Date | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<PropertyPayload | null>(
    null,
  );
  const [selectedBooking, setSelectedBooking] = useState<BookingPayload | null>(
    null,
  );
  const [selectedBlocked, setSelectedBlocked] =
    useState<CreateBlockedDatesPayload | null>(null);
  const [isSplitBookingModalOpen, setIsSplitBookingModalOpen] = useState(false);
  const [splitBooking, setSplitBooking] = useState<BookingPayload | null>(null);
  const [editBlockId, setEditBlockId] = useState<number | null>(null);
  const [isOpenEditBlockDateModal, setIsOpenEditBlockDateModal] =
    useState<boolean>(false);

  const handleCellClick = (
    colIndex: number,
    row: number,
    property: PropertyPayload,
  ) => {
    setActiveCell({ row: row, col: colIndex });
    setIsCellModalOpen(true);
    setSelectedRoom(property);
  };

  const handleModalChange = (open: boolean) => {
    setIsCellModalOpen(open);
    if (!open) {
      setActiveCell(null);
    }
  };

  //get blocked dates
  const { data: getBlockedDates = [] } = useGetBlockDates();

  //get blocked dates
  const unBlockDatesMutation = useUnblockDates();

  // get bookings data
  const { data: bookingsData = [] } = useGetBookings();
  // get all rooms
  const { data: propertiesData = [] } = useGetAllRooms();
  //delete booking
  const deleteBooking = useDeleteBooking();
  //get all structures
  const getAllStructures = useGetStructures();
  const structuresData = getAllStructures?.data || [];

  // Filter properties
  const filteredProperties = React.useMemo(() => {
    return propertiesData.filter((p: PropertyPayload) => {
      const matchesSearch = searchTerm
        ? p.name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesPropertyType = selectedPropertyTypeId
        ? p.property_type === selectedPropertyTypeId
        : true;
      const matchesStructure = selectedStructureId
        ? p.structure === selectedStructureId
        : true;

      return matchesSearch && matchesPropertyType && matchesStructure;
    });
  }, [propertiesData, searchTerm, selectedPropertyTypeId, selectedStructureId]);

  // Filter bookings data
  const filteredBookings = React.useMemo(() => {
    return bookingsData.filter((b: BookingPayload) => {
      const matchesType = selectedType ? b.platform === selectedType : true;
      const matchesSearch = searchTerm
        ? b.property_name?.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesPropertyType = selectedPropertyTypeId
        ? b.property_type === selectedPropertyTypeId
        : true;
      const matchesStructure = selectedStructureId
        ? b.structure === selectedStructureId
        : true;
      return (
        matchesType && matchesSearch && matchesPropertyType && matchesStructure
      );
    });
  }, [
    bookingsData,
    selectedType,
    searchTerm,
    selectedPropertyTypeId,
    selectedStructureId,
  ]);

  //filter blocked dates
  const filteredBlockedDates = React.useMemo(() => {
    return getBlockedDates.filter((bd: CreateBlockedDatesPayload) => {
      const matchesType = selectedType ? selectedType === "blocked" : true;
      const matchesPropertyType = selectedPropertyTypeId
        ? bd.property_type === selectedPropertyTypeId
        : true;
      const matchesStructure = selectedStructureId
        ? bd.structure === selectedStructureId
        : true;

      return matchesType && matchesPropertyType && matchesStructure;
    });
  }, [
    getBlockedDates,
    selectedType,
    selectedPropertyTypeId,
    selectedStructureId,
  ]);

  //navigation for booking bar popover
  const navigate = useNavigate();
  const handleNavigate = (id: string, fromFrontDesk: boolean) => {
    navigate(ROUTES.BOOKING_DETAILS.replace(":id", id), {
      state: { fromFrontDesk },
    });
  };

  // Today's date index
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const todayIndex = visibleDates.findIndex(
    (d) => format(d, "yyyy-MM-dd") === todayStr,
  );

  return (
    <>
      <div
        className="booking-grid relative w-full overflow-hidden"
        style={{ position: "relative" }}
      >
        <div
          className="booking-grid overflow-x-auto overflow-y-auto w-full"
          ref={scrollRef}
        >
          <div className="relative" style={{ minWidth: "max-content" }}>
            <div className="grid relative z-10">
              {filteredProperties.length > 0 ? (
                <>
                  {filteredProperties.map(
                    (property: PropertyPayload, index: number) => {
                      // find bookings for the property
                      const propertyBookings = filteredBookings.filter(
                        (b: BookingPayload) => b.property === property.id,
                      );

                      return (
                        <div
                          key={property.id}
                          className={`flex items-stretch ${
                            index === filteredProperties.length - 1
                              ? "border-b"
                              : ""
                          } border-t min-h-[98px] relative`}
                          style={{ borderColor: COLOR_BLUE }}
                        >
                          {/* property label - fixed left column - matches date header left arrow width */}
                          <div
                            className="bg-white z-50 truncate lg:w-[148px] md:w-[97px] w-[70px] flex-shrink-0 h-full flex items-center justify-start ps-2 sm:ps-3 font-medium text-black text-xs sm:text-[14px] capitalize sticky left-0 border-r"
                            style={{ borderColor: COLOR_LIGHT_BLUE }}
                          >
                            <span className="truncate">
                              {property.name || "Unknown Room"}
                            </span>
                          </div>

                          {/* dates column - matches date header scrollable area */}
                          <div
                            className="flex relative justify-start overflow-visible flex-shrink-0"
                            style={{
                              height: "100%",
                              position: "relative",
                              minWidth: "max-content",
                            }}
                          >
                            {/* date cells */}
                            {visibleDates.map((date, colIndex) => {
                              const isToday =
                                format(date, "yyyy-MM-dd") === todayStr;
                              //to check booked date cells
                              const isCellBooked = propertyBookings.some(
                                (booking: BookingPayload) => {
                                  const checkIn = new Date(
                                    booking.check_in_date,
                                  );
                                  const checkOut = new Date(
                                    booking.check_out_date,
                                  );

                                  // normalize all to midnight
                                  checkIn.setHours(0, 0, 0, 0);
                                  checkOut.setHours(0, 0, 0, 0);

                                  const cellDate = new Date(date);
                                  cellDate.setHours(0, 0, 0, 0);

                                  return (
                                    cellDate >= checkIn && cellDate <= checkOut
                                  );
                                },
                              );
                              const isCellBlocked = getBlockedDates?.some(
                                (bd: CreateBlockedDatesPayload) => {
                                  if (bd.property !== property.id) return false;

                                  const start = new Date(bd.start_date);
                                  const end = new Date(bd.end_date);
                                  const cell = new Date(date);

                                  start.setHours(0, 0, 0, 0);
                                  end.setHours(0, 0, 0, 0);
                                  cell.setHours(0, 0, 0, 0);

                                  return cell >= start && cell <= end;
                                },
                              );

                              return (
                                <div
                                  onClick={() => {
                                    if (!isCellBooked && !isCellBlocked) {
                                      handleCellClick( 
                                        colIndex,
                                        index,
                                        property,
                                      );
                                      setSelectedCellDate(date);
                                    } 
                                  }} 
                                  key={colIndex}
                                  className={`flex items-center justify-center text-sm relative border-r border-b flex-shrink-0
                                  ${isToday ? "bg-red-100" : "bg-white"}
                                  ${activeCell?.row === index && activeCell?.col === colIndex ? "bg-gray-100" : ""}
                                  ${isCellBooked || isCellBlocked ? "cursor-default pointer-events-none" : "cursor-pointer"}
                                  active:bg-gray-100`}
                                  style={{
                                    minWidth: cellWidth,
                                    width: cellWidth,
                                    height: "100%",
                                    borderColor: COLOR_LIGHT_BLUE,
                                  }}
                                />
                              );
                            })}

                            {/* booking bars */}
                            {propertyBookings.map(
                              (booking: BookingPayload, idx: number) => {
                                const startIndex = allDates.findIndex(
                                  (d) =>
                                    format(d, "yyyy-MM-dd") ===
                                    format(
                                      new Date(booking.check_in_date),
                                      "yyyy-MM-dd",
                                    ),
                                );

                                const endIndex = allDates.findIndex(
                                  (d) =>
                                    format(d, "yyyy-MM-dd") ===
                                    format(
                                      new Date(booking.check_out_date),
                                      "yyyy-MM-dd",
                                    ),
                                );

                                if (startIndex === -1 || endIndex === -1)
                                  return null;

                                const position = getVisibleReservationPosition({
                                  startIndex,
                                  endIndex,
                                  dateOffset,
                                  visibleCount: visibleDates.length,
                                  cellWidth,
                                });

                                if (!position) return null;

                                const { left, width } = position;

                                const mainGuest =
                                  booking?.guests?.find((g) => g.is_main_guest)
                                    ?.full_name || "Guest";

                                // find structure
                                const structure = structuresData.find(
                                  (s: StructurePayload) =>
                                    s.id === booking.structure,
                                );

                                return (
                                  <Popover
                                    key={idx}
                                    open={selectedBooking?.id === booking.id}
                                    onOpenChange={(open) => {
                                      if (!open) setSelectedBooking(null);
                                    }}
                                  >
                                    <PopoverTrigger
                                      asChild
                                      onClick={() => setSelectedRoom(property)}
                                    >
                                      <div
                                        onClick={() =>
                                          setSelectedBooking(booking)
                                        }
                                        className="absolute font-medium text-xs flex items-center justify-start px-[16px] py-[8px] rounded-full text-white shadow-sm overflow-hidden cursor-pointer"
                                        style={{
                                          left: `${left}px`,
                                          width: `${width}px`,
                                          top: "50%",
                                          transform: "translateY(-50%)",
                                          backgroundColor:
                                            getBackgroundColorLight(
                                              booking.platform,
                                            ),
                                          zIndex: 2,
                                          height: "40px",
                                          fontSize: "14px",
                                          borderRadius: "9999px",
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                                            style={{
                                              backgroundColor:
                                                getBackgroundColor(
                                                  booking.platform.toLowerCase(),
                                                ),
                                              color: getBackgroundColorLight(
                                                booking.platform.toLowerCase(),
                                              ),
                                            }}
                                          >
                                            {booking.platform === "airbnb" ? (
                                              <TbBrandAirbnb />
                                            ) : booking.platform ===
                                              "booking_com" ? (
                                                <TbBrandBooking size={18} />
                                              ) : booking.platform ===
                                              "expedia" ? (
                                                  <SiExpedia />
                                                ) : (
                                                  booking.platform?.[0]?.toUpperCase() ||
                                              ""
                                                )}
                                          </div>

                                          <span className="text-sm whitespace-nowrap text-gray-900 w-fit">
                                            {booking.guests?.find(
                                              (g) => g.is_main_guest,
                                            )?.full_name || "Guest"}
                                          </span>
                                        </div>
                                      </div>
                                    </PopoverTrigger>

                                    <PopoverContent
                                      side="bottom"
                                      avoidCollisions={true}
                                      collisionPadding={30}
                                      sticky="always"
                                      collisionBoundary={document.querySelector(
                                        ".booking-grid",
                                      )}
                                      className="w-[260px] rounded-xl shadow-lg p-4 bg-white border border-gray-200"
                                    >
                                      {/* Header */}
                                      <div className="mb-2 flex flex-col gap-2">
                                        <div className="flex justify-between">
                                          <h3 className="text-[15px] font-semibold text-gray-800">
                                            {mainGuest}
                                          </h3>
                                          <IconX
                                            className="cursor-pointer hover:bg-gray-100 rounded-md text-red-500"
                                            size={22}
                                            onClick={() =>
                                              setSelectedBooking(null)
                                            }
                                          />
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold"
                                            style={{
                                              backgroundColor:
                                                getBackgroundColor(
                                                  booking.platform.toLowerCase(),
                                                ),
                                              color: getBackgroundColorLight(
                                                booking.platform.toLowerCase(),
                                              ),
                                            }}
                                          >
                                            {booking.platform === "airbnb" ? (
                                              <TbBrandAirbnb />
                                            ) : booking.platform ===
                                              "booking_com" ? (
                                                <TbBrandBooking size={18} />
                                              ) : booking.platform ===
                                              "expedia" ? (
                                                  <SiExpedia />
                                                ) : (
                                                  booking.platform?.[0]?.toUpperCase() ||
                                              ""
                                                )}
                                          </div>
                                          <p className="text-[14px] text-gray-800 flex items-center gap-1">
                                            <span className="capitalize">
                                              {booking.platform ===
                                              "booking_com"
                                                ? "booking.com"
                                                : booking.platform}
                                            </span>
                                          </p>
                                        </div>
                                      </div>

                                      {/* Info rows */}
                                      <div className="space-y-1.5 text-sm text-gray-700">
                                        <div className="flex justify-between items-center">
                                          <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-800" />
                                            <span className="text-gray-800 text-sm">
                                              {booking.adults_count ?? 0}
                                            </span>
                                          </div>
                                          <div className="flex items-center w-[71px] max-w-[71px] gap-2">
                                            <Clock className="w-4 h-4 text-gray-800" />
                                            <span className="text-gray-800 text-sm">
                                              {booking.length_of_stay ?? 0}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2 text-sm text-gray-700">
                                          {/* From */}
                                          <div className="flex flex-col">
                                            <span className="text-gray-800 text-sm font-medium">
                                              From
                                            </span>
                                            <span className="text-sm text-gray-800">
                                              {format(
                                                new Date(booking.check_in_date),
                                                "dd.MM.yyyy",
                                              )}
                                            </span>
                                            <span className="text-gray-800 text-sm">
                                              {`(${structure?.default_check_in_time?.slice(0, 5)})`}
                                            </span>
                                          </div>

                                          {/* to */}
                                          <div className="flex flex-col">
                                            <span className="text-gray-800 text-sm font-medium">
                                              To
                                            </span>
                                            <span className="text-sm text-gray-800">
                                              {format(
                                                new Date(
                                                  booking.check_out_date,
                                                ),
                                                "dd.MM.yyyy",
                                              )}
                                            </span>
                                            <span className="text-gray-800 text-sm">
                                              {`(${structure?.default_check_out_time?.slice(0, 5)})`}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex flex-col text-gray-800 text-sm gap-1 mt-2">
                                          <span className="font-medium">
                                            Payout value
                                          </span>
                                          <div className="flex items-center">
                                            <TbCurrencyEuro className="w-4 h-4 text-gray-800" />
                                            <span className="text-gray-800">
                                              {booking.total_price ?? 0}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Buttons */}
                                      <div className="mt-3 space-y-2">
                                        <Button
                                          className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full text-sm"
                                          onClick={() => {
                                            setIsSplitBookingModalOpen(true);
                                            setSplitBooking(booking);
                                          }}
                                        >
                                          Split booking
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            handleNavigate(
                                              booking.id.toString(),
                                              true,
                                            )
                                          }
                                          variant="outline"
                                          className="w-full border-gray-800 hover:bg-gray-100 rounded-full text-sm"
                                        >
                                          Edit booking
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            deleteBooking.mutate(booking.id)
                                          }
                                          variant="destructive"
                                          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 rounded-full text-sm"
                                        >
                                          Cancel booking
                                        </Button>
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                );
                              },
                            )}

                            {/* bar for blocked dates  */}
                            {filteredBlockedDates
                              ?.filter(
                                (bd: CreateBlockedDatesPayload) =>
                                  bd.property === property.id,
                              )
                              .map(
                                (
                                  bd: CreateBlockedDatesPayload,
                                  idx: number,
                                ) => {
                                  const startIndex = allDates.findIndex(
                                    (d) =>
                                      format(d, "yyyy-MM-dd") === bd.start_date,
                                  );
                                  const endIndex = allDates.findIndex(
                                    (d) =>
                                      format(d, "yyyy-MM-dd") === bd.end_date,
                                  );

                                  if (startIndex === -1 || endIndex === -1)
                                    return null;

                                  const left =
                                    (startIndex - dateOffset) * cellWidth +
                                    cellWidth / 2;
                                  const width =
                                    (endIndex - startIndex) * cellWidth;

                                  // calculate visible boundaries
                                  const visibleStart = dateOffset;
                                  const visibleEnd =
                                    dateOffset + visibleDates.length - 1;

                                  // hide if fully outside visible range
                                  if (
                                    endIndex < visibleStart ||
                                    startIndex > visibleEnd
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <Popover
                                      open={selectedBlocked?.id === bd.id}
                                      onOpenChange={(open) => {
                                        if (!open) setSelectedBlocked(null);
                                      }}
                                    >
                                      <PopoverTrigger
                                        asChild
                                        onClick={() =>
                                          setSelectedRoom(property)
                                        }
                                      >
                                        <div
                                          key={`blocked-${idx}`}
                                          onClick={() => setSelectedBlocked(bd)}
                                          className="absolute rounded-full shadow-sm cursor-pointer"
                                          style={{
                                            left: `${left}px`,
                                            width: `${width}px`,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            height: "28px",
                                            backgroundImage: `repeating-linear-gradient(
                                            45deg,
                                            #9ca3af 0px,
                                            #9ca3af 6px,
                                            #ffffff 6px,
                                            #ffffff 12px
                                          )`,
                                            opacity: 0.8,
                                            zIndex: 1,
                                            borderRadius: "9999px",
                                          }}
                                        />
                                      </PopoverTrigger>

                                      <PopoverContent className="w-[300px] p-5 rounded-2xl shadow-lg">
                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-3">
                                          <h2 className="text-base font-semibold text-gray-900">
                                            Blocked date
                                          </h2>

                                          <button className="hover:bg-gray-100 rounded-lg">
                                            <IconX
                                              color="red"
                                              className="cursor-pointer w-5 h-5"
                                              onClick={() => {
                                                setSelectedBlocked(null);
                                              }}
                                            />
                                          </button>
                                        </div>

                                        {/* Subtext */}
                                        <p className="text-sm text-gray-600 mb-5">
                                          These dates have been manually blocked
                                        </p>

                                        {/* Buttons */}
                                        <div className="space-y-3">
                                          {/* edit */}
                                          <Button
                                            variant="ghost"
                                            className="w-full border border-gray-300 rounded-full hover:bg-gray-100 text-gray-900 font-medium text-sm transition"
                                            onClick={() => {
                                              setEditBlockId(bd.id ?? null);
                                              setIsOpenEditBlockDateModal(true);
                                              setSelectedBlocked(null);
                                            }}
                                          >
                                            Edit
                                          </Button>

                                          {/* unblock */}
                                          <Button
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border-red-200 rounded-full text-sm transition"
                                            onClick={() => {
                                              if (!bd.id) return;
                                              unBlockDatesMutation.mutate(
                                                bd.id,
                                              );
                                              setSelectedBlocked(null);
                                            }}
                                          >
                                            Unblock
                                          </Button>
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  );
                                },
                              )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-center text-normal mt-5 font-semibold">
                    No Room exists with this name!
                  </h3>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <FrontDeskDateCellModal
        open={isCellModalOpen}
        onOpenChange={handleModalChange}
        date={selectedCellDate}
        openCreateBookingModal={setIsCreateModalOpen}
        selectedProperty={selectedRoom}
        selectedStructureId={selectedStructureId}
      />
      <CreateBooking
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        date={selectedCellDate}
        selectedPropertyTypeId={selectedPropertyTypeId}
        selectedProperty={selectedRoom}
        selectedStructureId={selectedStructureId}
      />
      <SplitBookingModal
        open={isSplitBookingModalOpen}
        onOpenChange={setIsSplitBookingModalOpen}
        booking={splitBooking}
        selectedStructureId={selectedStructureId}
      />
      <EditBlockDatesModal
        id={editBlockId}
        open={isOpenEditBlockDateModal}
        onOpenChange={setIsOpenEditBlockDateModal}
        date={selectedCellDate}
        selectedProperty={selectedRoom}
        selectedStructureId={selectedStructureId}
      />
    </>
  );
};
